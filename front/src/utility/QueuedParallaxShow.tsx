import React, { cloneElement, HTMLProps, ReactElement, useCallback, useEffect, useState } from 'react'

import { Grow } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { ParallaxQueue } from './ParallaxQueue'

export const QueuedParallaxShow = <T extends TransitionProps>({
  children,
  queue,
  enabled = true,
  transition = <Grow />,
  ...props
}: {
  children: ReactElement
  queue: ParallaxQueue
  enabled?: boolean
  transition?: ReactElement
  transitionProps?: Omit<T, 'in' & 'children'>
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [animateIn, setAnimateIn] = useState(false)

  const ref = useCallback((node: HTMLElement) => {
    if (node) {
      queue.add(setAnimateIn, node)
    } else {
      queue.remove(setAnimateIn)
    }
  }, [])

  return (
    <div ref={ref} {...props}>
      {cloneElement(transition, { in: enabled && animateIn, children })}
    </div>
  )
}
