import React, { cloneElement, HTMLProps, ReactElement, useCallback, useState } from 'react'

import { Grow } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { ParallaxQueue } from './ParallaxQueue'

export const QueuedParallaxShow = <T extends TransitionProps>({
  children,
  queue,
  transition = <Grow />,
  observerProps,
  ...props
}: {
  children: ReactElement
  queue: ParallaxQueue
  transition?: ReactElement
  transitionProps?: Omit<T, 'in' & 'children'>
  observerProps?: IntersectionObserverInit
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [animateIn, setAnimateIn] = useState(false)

  const ref = useCallback((node: HTMLElement) => {
    if (node) queue.add(setAnimateIn, node)
    else queue.remove(setAnimateIn)
  }, [])

  return (
    <div ref={ref} {...props}>
      {cloneElement(transition, { in: animateIn, children })}
    </div>
  )
}
