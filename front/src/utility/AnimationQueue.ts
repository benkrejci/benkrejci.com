import { MutableRefObject, useRef } from 'react'

const DEFAULT_DELAY_MS = 160

let lastScrollDirection: 'up' | 'down' = 'down'
let lastScrollTop = 0

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', (e) => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop
    lastScrollDirection = scrollTop > lastScrollTop ? 'down' : 'up'
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
  })
}

/**
 * Triggers animation events sequentially with some delay in-between starting each.
 * The more queued animations, the shorter the delay to the next one.
 * @see https://www.desmos.com/calculator/gbvhcqhm3b
 */
export class AnimationQueue {
  private targetDelayMs: number
  private preQueue: Array<[Function, number]> = []
  private readonly queue: Function[] = []
  private debounceTimeout: NodeJS.Timeout | null = null
  private nextTimeout: NodeJS.Timeout | null = null

  constructor(targetDelayMs: number = DEFAULT_DELAY_MS) {
    this.targetDelayMs = targetDelayMs
  }

  public add(animate: Function, ref?: MutableRefObject<HTMLElement>): void {
    let currentNode = ref.current
    let index: number
    while ((currentNode = currentNode.parentElement)) {
      index = Array.from(currentNode.parentNode.children).indexOf(currentNode)
      if (index !== 0) break
    }
    this.preQueue.push([animate, index || 0])
    if (this.debounceTimeout === null)
      this.debounceTimeout = setTimeout(() => {
        this.enqueue()
        this.debounceTimeout = null
      }, 0)
  }

  public remove(animate: Function): void {
    let index = this.queue.indexOf(animate)
    if (index > -1) {
      this.queue.splice(index, 1)
    }
  }

  public setTargetDelay(delayMs: number) {
    this.targetDelayMs = delayMs
  }

  private enqueue(): void {
    this.preQueue.sort(
      lastScrollDirection === 'down' ? (a, b) => a[1] - b[1] : (a, b) => b[1] - a[1],
    )
    this.preQueue.forEach(([animate]) => this.queue.push(animate))
    this.preQueue = []
    this.next()
  }

  private next(): void {
    if (!this.queue.length || this.nextTimeout !== null) return
    this.queue.shift()()
    this.nextTimeout = setTimeout(() => {
      this.nextTimeout = null
      this.next()
    }, this.getDelay())
  }

  /**
   * As queue.length → 0, delay → targetDelayMs
   * As queue.length → ∞, delay → 0
   */
  private getDelay(): number {
    return this.targetDelayMs * Math.pow(0.85, this.queue.length)
  }
}

export const useAnimationQueue = (targetDelayMs?: number) => {
  const ref = useRef<AnimationQueue>()
  if (!ref.current) ref.current = new AnimationQueue()
  if (targetDelayMs !== undefined) ref.current.setTargetDelay(targetDelayMs)
  return ref.current
}
