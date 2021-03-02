import { useRef } from 'react'

const DEFAULT_DELAY_MS = 200

/**
 * Triggers animation events sequentially with some delay in-between starting each.
 * The more queued animations, the shorter the delay to the next one.
 * @see https://www.desmos.com/calculator/gbvhcqhm3b
 */
export class AnimationQueue {
  private targetDelayMs: number
  private queue: Function[]
  private currentTimeout: NodeJS.Timeout | null = null

  constructor(targetDelayMs: number = DEFAULT_DELAY_MS) {
    this.targetDelayMs = targetDelayMs
    this.queue = []
  }

  public add(animate: Function): void {
    this.queue.push(animate)
    this.next()
  }

  public remove(animate: Function): void {
    const index = this.queue.indexOf(animate)
    if (index > -1) this.queue.splice(index, 1)
  }

  public setTargetDelay(delayMs: number) {
    this.targetDelayMs = delayMs
  }

  private next(): void {
    if (!this.queue.length || this.currentTimeout !== null) return

    this.queue.shift()()
    this.currentTimeout = setTimeout(() => {
      this.currentTimeout = null
      this.next()
    }, this.getDelay())
  }

  /**
   * As queue.length → 0, delay → targetDelayMs
   * As queue.length → ∞, delay → 0
   */
  private getDelay(): number {
    return this.targetDelayMs * Math.pow(0.75, this.queue.length)
  }
}

export const useAnimationQueue = (targetDelayMs?: number) => {
  const ref = useRef<AnimationQueue>()
  if (!ref.current) ref.current = new AnimationQueue()
  if (targetDelayMs !== undefined) ref.current.setTargetDelay(targetDelayMs)
  return ref.current
}
