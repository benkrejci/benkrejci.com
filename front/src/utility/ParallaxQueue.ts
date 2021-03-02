import { useRef } from 'react'

const DEFAULT_DELAY_MS = 160

export const useParallaxQueue = (targetDelayMs?: number) => {
  const ref = useRef<ParallaxQueue>()
  if (!ref.current) ref.current = new ParallaxQueue()
  if (targetDelayMs !== undefined) ref.current.setTargetDelay(targetDelayMs)
  return ref.current
}

type SetIsVisibleFunc = (boolean) => void
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
 * Consider the follwing situation:
 * - browser viewport is instantaneously scrolled from shown position at t1 to shown position at t2
 * - at t2, elements e1 and e2 will be hidden immediately
 * - at t2, elements e4, e5, e6, e7 will be shown in that order
 *
 *                viewport at t1
 *                    /
 * +-----------------+
 * |                 |
 * |                 |
 * |                 |
 * | ######   ###### |
 * | # e1 #   # e2 # |     viewport at t2
 * | ######   ###### |         /
 * |        +-----------------+
 * |        | ###### | ###### |
 * |        | # e3 # | # e4 # |
 * |        | ###### | ###### |
 * +-----------------+        |
 *          |                 |
 *          | ######   ###### |
 *          | # e5 #   # e6 # |
 *          | ######   ###### |
 *          |     ######      |
 *          |     # e7 #      |
 *          +-----######------+
 */
export class ParallaxQueue {
  private targetDelayMs: number
  private readonly showQueue: SetIsVisibleFunc[] = []
  private nextTimeout: NodeJS.Timeout | null = null
  private observer: IntersectionObserver
  private elementBySetIsVisible: Map<SetIsVisibleFunc, Element> = new Map()
  private setIsVisibleByElement: Map<Element, SetIsVisibleFunc> = new Map()
  private lastViewportEdges: ViewportEdges

  /**
   * @param targetDelayMs delay between showing one element and the next approaches this value when
   *        there are few elements queued. @see {getDelay}
   * @param observerProps
   */
  constructor(targetDelayMs: number = DEFAULT_DELAY_MS, observerProps?: IntersectionObserverInit) {
    this.targetDelayMs = targetDelayMs
    this.observer =
      typeof window !== 'undefined' &&
      new IntersectionObserver((entries) => this.intersect(entries), observerProps)
  }

  public add(setIsVisible: SetIsVisibleFunc, element: Element): void {
    this.elementBySetIsVisible.set(setIsVisible, element)
    this.setIsVisibleByElement.set(element, setIsVisible)
    this.observer.observe(element)
  }

  public remove(setIsVisible: SetIsVisibleFunc): void {
    const element = this.elementBySetIsVisible.get(setIsVisible)
    if (element) {
      this.elementBySetIsVisible.delete(setIsVisible)
      this.setIsVisibleByElement.delete(element)
      this.observer.unobserve(element)
    }
  }

  public setTargetDelay(delayMs: number) {
    this.targetDelayMs = delayMs
  }

  private intersect(entries: IntersectionObserverEntry[]): void {
    const lastViewportEdges = this.lastViewportEdges
    const viewportEdges = this.getViewportEdges()
    const members: Array<{
      setIsVisible: SetIsVisibleFunc
      index: number
    }> = []
    entries.forEach((entry) => {
      const setIsVisible = this.setIsVisibleByElement.get(entry.target)
      if (!entry.isIntersecting) {
        setIsVisible(false)
      } else {
        const edges = this.getEdges(entry)
        const index = this.getIntersectIndex(lastViewportEdges, viewportEdges, edges)
        members.push({ setIsVisible, index })
      }
    })
    members
      .sort((a, b) => a.index - b.index)
      .forEach(({ setIsVisible }) => {
        this.showQueue.push(setIsVisible)
        this.next()
      })
    this.lastViewportEdges = viewportEdges
  }

  private getViewportEdges(): ViewportEdges {
    return {
      top: window.pageYOffset,
      left: window.pageXOffset,
      bottom: window.pageYOffset + document.documentElement.clientHeight,
      right: window.pageXOffset + document.documentElement.clientWidth,
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
    if (viewportEdges.right > lastViewportEdges.right && edges.toRight) maxToEdge = edges.toRight
    return -maxToEdge
  }

  private next(): void {
    if (!this.showQueue.length || this.nextTimeout !== null) return
    this.showQueue.shift()(true)
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
    return this.targetDelayMs * Math.pow(0.8, this.showQueue.length)
  }
}
