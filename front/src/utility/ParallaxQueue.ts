import { useRef } from 'react'
import { isEqual } from 'lodash'

const DEFAULT_MIN_DELAY_MS = 20
const DEFAULT_TARGET_DELAY_MS = 200

export const useParallaxQueue = ({
  targetDelayMs,
  autoStart = true,
  observerProps,
}: {
  targetDelayMs?: number
  autoStart?: boolean
  observerProps?: IntersectionObserverInit
} = {}) => {
  const observerPropsRef = useRef<IntersectionObserverInit>(observerProps)
  const queueRef = useRef<ParallaxQueue>()
  if (!queueRef.current) queueRef.current = new ParallaxQueue({ autoStart, observerProps })
  // if observerProps have changed, re-init
  else if (!isEqual(observerPropsRef.current, observerProps)) {
    observerPropsRef.current = observerProps
    queueRef.current.reInitObserver(observerProps)
  }
  if (targetDelayMs !== undefined) queueRef.current.setTargetDelay(targetDelayMs)
  return queueRef.current
}

type SetIsVisibleFunc = (boolean) => void
interface Item {
  element: Element
  isVisible: boolean
  setIsVisible: SetIsVisibleFunc
}
interface ToViewportEdges {
  toTop: number
  toLeft: number
  toBottom: number
  toRight: number
}
interface ViewportEdges {
  top: number
  left: number
  bottom: number
  right: number
}

/**
 * Triggers show functions sequentially as they come into view with some delay in-between.
 *
 * The first goal of ParallaxQueue is to space out show animations that would normally all trigger
 * roughly at the same time. The delay is eased based on queue size.
 * E.g. if 5 elements come into view at the "same time" (according to IntersectionObserver) their
 * show functions will be triggered something like this:
 *
 *                     targetDelayMs
 *            ________/
 *           |        |
 * +- time -------------------------->
 * [ animation 1 ]
 *     [ animation 2 ]
 *           [ animation 3 ]
 *                    [ animation 4 ]
 *
 * The second goal of ParallaxQueue is to ensure show functions are called in the right order.
 * IntersectionObserver tends to invoke callback with entries out of order. Order to animate is
 * thus calculated manually to match the order of appearance that would be expected based on window
 * resize or scroll.
 *
 * Consider the following situation:
 * - browser viewport is instantaneously scrolled from shown position at t1 to shown position at t2
 * - at t2, elements e1 and e2 will be hidden immediately
 * - at t2, elements e4, e5, e6, e7 will be shown in that order
 *
 *                     viewport at t1
 *                    /
 * +-----------------+
 * |                 |\
 * |                 | \
 * |                 |  \
 * | ######   ###### |   \
 * | # e1 #   # e2 # |    \   viewport at t2
 * | ######   ###### |     \ /
 * |      +-----------------+
 * |      |   ###### | ######
 * |      |   # e3 # | # e4 #
 * |      |   ###### | ######
 * +-----------------+      |
 *  \     |                 |
 *   \    |   ######   ######
 *    \   |   # e5 #   # e6 #
 *     \  |   ######   ######
 *      \ |       ######    |
 *       \|       # e7 #    |
 *        +-------######----+
 */
export class ParallaxQueue {
  private easingEnabled: boolean
  private minDelayMs: number
  private targetDelayMs: number
  private readonly queue: ((() => void) | Item)[] = []
  private nextTimeout: NodeJS.Timeout | null = null
  private observer: IntersectionObserver
  private observerProps: IntersectionObserverInit
  private readonly itemsByVisibilitySetter: Map<SetIsVisibleFunc, Item> = new Map()
  private readonly itemsByElement: Map<Element, Item> = new Map()
  private lastViewportEdges: ViewportEdges
  private paused: boolean
  private rootMargin: { top: number; right: number; bottom: number; left: number }

  /**
   * @param targetDelayMs delay between showing one element and the next approaches this value when
   *        there are few elements queued. @see {getDelay}
   * @param observerProps
   */
  constructor({
    easingEnabled = true,
    minDelayMs = DEFAULT_MIN_DELAY_MS,
    targetDelayMs = DEFAULT_TARGET_DELAY_MS,
    observerProps,
    autoStart = true,
  }: {
    easingEnabled?: boolean
    minDelayMs?: number
    targetDelayMs?: number
    observerProps?: IntersectionObserverInit
    autoStart?: boolean
  } = {}) {
    this.setEasingEnabled(easingEnabled)
    this.setMinDelay(minDelayMs)
    this.setTargetDelay(targetDelayMs)

    this.initObserver(observerProps)

    this.paused = !autoStart
  }

  public pause(): void {
    this.paused = true
  }

  public resume(): void {
    this.paused = false
    this.next()
  }

  public add(setIsVisible: SetIsVisibleFunc, element: Element): void {
    const item = { element, isVisible: false, setIsVisible }
    this.itemsByVisibilitySetter.set(setIsVisible, item)
    this.itemsByElement.set(element, item)
    this.observer.observe(element)
  }

  public remove(setIsVisible: SetIsVisibleFunc): void {
    const item = this.itemsByVisibilitySetter.get(setIsVisible)
    if (item) {
      this.itemsByVisibilitySetter.delete(setIsVisible)
      this.itemsByElement.delete(item.element)
      this.observer.unobserve(item.element)
    }
  }

  public forceHideAll(callback?: () => void): void {
    Array.from(this.itemsByElement.entries())
      .filter(([_element, { isVisible }]) => isVisible)
      .sort(([elA], [elB]) => this.getRtlOrderIndex(elA) - this.getRtlOrderIndex(elB))
      .forEach(([_node, item]) =>
        this.queue.push(() => this.setItemVisibility(item, false)),
      )
    callback && this.queue.push(callback)
    this.next()
  }

  public setEasingEnabled(enabled: boolean) {
    this.easingEnabled = enabled
  }

  public setMinDelay(delayMs: number) {
    this.minDelayMs = delayMs
  }

  public setTargetDelay(delayMs: number) {
    this.targetDelayMs = delayMs
  }

  public reInitObserver(observerProps?: IntersectionObserverInit) {
    this.observer.disconnect()
    this.initObserver(observerProps ?? this.observerProps)
  }

  private setItemVisibility(item: Item, isVisible: boolean) {
    item.setIsVisible(isVisible)
    item.isVisible = isVisible
  }

  private initObserver(observerProps: IntersectionObserverInit): void {
    this.observerProps = observerProps

    const rootMarginParts = (observerProps?.rootMargin || '0px')
      .split(' ')
      .map((part) => {
        if (part.match(/^-?\d+(\.\d+)?px$/)) return parseInt(part)
        throw new TypeError(
          `Invalid rootMargin value for ParallaxQueue "${part}", only px allowed`,
        )
      })
    if (rootMarginParts.length === 1) {
      this.rootMargin = {
        top: rootMarginParts[0],
        right: rootMarginParts[0],
        bottom: rootMarginParts[0],
        left: rootMarginParts[0],
      }
    } else if (rootMarginParts.length === 2) {
      this.rootMargin = {
        top: rootMarginParts[0],
        right: rootMarginParts[1],
        bottom: rootMarginParts[0],
        left: rootMarginParts[1],
      }
    } else {
      this.rootMargin = {
        top: rootMarginParts[0],
        right: rootMarginParts[1],
        bottom: rootMarginParts[2] || 0,
        left: rootMarginParts[3] || 0,
      }
    }

    this.observer =
      typeof window !== 'undefined' &&
      new IntersectionObserver((entries) => this.intersect(entries), observerProps)

    // if there are already elements to observe (in case of re-init), observe again
    Array.from(this.itemsByElement)
      .sort(([elA], [elB]) => this.getRtlOrderIndex(elA) - this.getRtlOrderIndex(elB))
      .forEach(([element]) => this.observer.observe(element))
  }

  private intersect(entries: IntersectionObserverEntry[]): void {
    const lastViewportEdges = this.lastViewportEdges
    const viewportEdges = this.getViewportEdges()
    const members: {
      index: number
      item: Item
    }[] = []
    entries.forEach((entry) => {
      const item = this.itemsByElement.get(entry.target)
      if (!entry.isIntersecting) {
        this.setItemVisibility(item, false)
      } else {
        const edges = this.getEdges(entry)
        const index = this.getIntersectIndex(lastViewportEdges, viewportEdges, edges)
        members.push({ index, item })
      }
    })
    members
      .sort((a, b) => a.index - b.index)
      .forEach(({ item }) => this.queue.push(item))
    this.next()
    this.lastViewportEdges = viewportEdges
  }

  private getViewportEdges(): ViewportEdges {
    return {
      top: window.pageYOffset - this.rootMargin.top,
      left: window.pageXOffset - this.rootMargin.left,
      bottom:
        window.pageYOffset -
        this.rootMargin.bottom +
        document.documentElement.clientHeight,
      right:
        window.pageXOffset - this.rootMargin.right + document.documentElement.clientWidth,
    }
  }

  private getEdges(entry: IntersectionObserverEntry): ToViewportEdges {
    return {
      toTop: entry.boundingClientRect.top,
      toLeft: entry.boundingClientRect.left,
      toBottom: entry.rootBounds.height - entry.boundingClientRect.bottom,
      toRight: entry.rootBounds.width - entry.boundingClientRect.right,
    }
  }

  private getIntersectIndex(
    lastViewportEdges: ViewportEdges,
    viewportEdges: ViewportEdges,
    edges: ToViewportEdges,
  ): number {
    if (!lastViewportEdges) return -edges.toBottom
    let maxToEdge
    if (viewportEdges.top < lastViewportEdges.top) maxToEdge = edges.toTop
    if (viewportEdges.left < lastViewportEdges.left && edges.toLeft > maxToEdge)
      maxToEdge = edges.toLeft
    if (viewportEdges.bottom > lastViewportEdges.bottom && edges.toBottom > maxToEdge)
      maxToEdge = edges.toBottom
    if (viewportEdges.right > lastViewportEdges.right && edges.toRight)
      maxToEdge = edges.toRight
    return -maxToEdge
  }

  private ARBITRARILY_LARGE_COORDINATE = 100_000

  private getRtlOrderIndex = (node: Element) =>
    // Use arbitrarily large multiplier to give vertical coordinate priority
    this.ARBITRARILY_LARGE_COORDINATE * node.getBoundingClientRect().y +
    Math.min(this.ARBITRARILY_LARGE_COORDINATE, node.getBoundingClientRect().x)

  private next(): void {
    if (this.paused || !this.queue.length || this.nextTimeout !== null) return
    const queued = this.queue.shift()
    if (queued instanceof Function) {
      queued()
    } else {
      this.setItemVisibility(queued, true)
    }
    this.nextTimeout = setTimeout(() => {
      this.nextTimeout = null
      this.next()
    }, this.getDelay())
  }

  /**
   * The more queued animations, the shorter the delay to the next one.
   * As queue.length → 0, delay → targetDelayMs
   * As queue.length → ∞, delay → 0
   * @see https://www.desmos.com/calculator/gbvhcqhm3b
   */
  private getDelay(): number {
    return this.easingEnabled
      ? Math.max(this.minDelayMs, this.targetDelayMs * Math.pow(0.8, this.queue.length))
      : this.minDelayMs
    }
}
