import React, { cloneElement, HTMLProps, ReactElement, useEffect, useRef, useState } from 'react'

import { Grow, useForkRef } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { isInView } from './isInView'

export const ParallaxShow = <T extends TransitionProps>({
  children,
  transition = <Grow />,
  observerProps,
  ...props
}: {
  children: ReactElement
  transition?: ReactElement
  transitionProps?: Omit<T, 'in' & 'children'>
  observerProps?: IntersectionObserverInit
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [isVisible, inViewRef] = isInView({ threshold: 0, ...observerProps })
  const queueRef = useRef<HTMLElement>()
  const ref = useForkRef(queueRef, inViewRef)
  const [animateIn, setAnimateIn] = useState(false)

  useEffect(() => {
    setAnimateIn(isVisible)
  }, [isVisible])

  return (
    <div ref={ref} {...props}>
      {cloneElement(transition, { in: animateIn, children })}
    </div>
  )
}
