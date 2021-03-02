import React, {
  cloneElement, HTMLProps, ReactElement, useCallback, useEffect, useRef, useState
} from 'react'

import { Grow, useForkRef } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { AnimationQueue } from './AnimationQueue'
import { isInView } from './isInView'

export const ParallaxShow = <T extends TransitionProps>({
  children,
  transition = <Grow />,
  animationQueue,
  observerProps,
  ...props
}: {
  children: ReactElement
  transition?: ReactElement
  transitionProps?: Omit<T, 'in' & 'children'>
  animationQueue?: AnimationQueue
  observerProps?: IntersectionObserverInit
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [isVisible, inViewRef] = isInView({ threshold: 0, ...observerProps })
  const queueRef = useRef<HTMLElement>()
  const ref = useForkRef(queueRef, inViewRef)
  const [animateIn, setAnimateIn] = useState(false)

  const setAnimateInTrue = useCallback(() => setAnimateIn(true), [])

  useEffect(() => {
    if (animationQueue) {
      if (isVisible) {
        animationQueue.add(setAnimateInTrue, queueRef)
      } else {
        animationQueue.remove(setAnimateInTrue)
        setAnimateIn(false)
      }
    } else {
      setAnimateIn(isVisible)
    }
    return () => animationQueue?.remove(setAnimateInTrue)
  }, [isVisible, animationQueue])

  return (
    <div ref={ref} {...props}>
      {cloneElement(transition, { in: animateIn, children })}
    </div>
  )
}
