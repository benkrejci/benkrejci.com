import { useRef } from 'react'

const DEFAULT_DELAY_MS = 80

export class AnimationQueue {
  private delayMs: number
  private queue: Function[]
  private currentTimeout: NodeJS.Timeout | null = null

  constructor(delayMs: number = DEFAULT_DELAY_MS) {
    this.delayMs = delayMs
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

  public setDelay(delayMs: number) {
    this.delayMs = delayMs
  }

  private next(): void {
    if (!this.queue.length || this.currentTimeout !== null) return

    this.queue.shift()()
    this.currentTimeout = setTimeout(() => {
      this.currentTimeout = null
      this.next()
    }, this.delayMs)
  }
}

export const useAnimationQueue = (delay?: number) => {
  const ref = useRef<AnimationQueue>()
  if (!ref.current) ref.current = new AnimationQueue()
  if (delay !== undefined) ref.current.setDelay(delay)
  return ref.current
}
