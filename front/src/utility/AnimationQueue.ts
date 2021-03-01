import { useRef } from 'react'

const DEFAULT_DELAY_MS = 75

export class AnimationQueue {
  private delayMs: number
  private queue: Function[]
  private currentInterval: NodeJS.Timeout | null = null

  constructor(delayMs: number = DEFAULT_DELAY_MS) {
    this.delayMs = delayMs
    this.queue = []
  }

  public add(animate: Function): void {
    this.queue.push(animate)
    this.start()
  }

  public remove(animate: Function): void {
    const index = this.queue.indexOf(animate)
    if (index > -1) this.queue.splice(index, 1)
  }

  private start(): void {
    if (this.currentInterval === null)
      this.currentInterval = setInterval(this.next.bind(this), this.delayMs)
  }

  private next(): void {
    if (!this.queue.length) {
      if (this.currentInterval !== null) clearInterval(this.currentInterval)
      this.currentInterval = null
      return
    }

    this.queue.shift()()
  }
}

export const useAnimationQueue = () => {
  const ref = useRef<AnimationQueue>()
  if (!ref.current) ref.current = new AnimationQueue()
  return ref.current
}
