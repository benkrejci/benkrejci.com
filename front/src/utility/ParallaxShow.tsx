import React, { HTMLProps, ReactElement, useCallback, useEffect, useState } from 'react'

import { Fade, Grow, Slide } from '@material-ui/core'

import { AnimationQueue } from './AnimationQueue'
import { isInView } from './isInView'

export const ParallaxShow = ({
  children,
  transition = 'grow',
  direction = 'left',
  animationQueue,
  ...props
}: {
  children: ReactElement
  transition?: 'grow' | 'slide' | 'fade'
  direction?: 'left' | 'right' | 'up' | 'down'
  animationQueue?: AnimationQueue
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [isVisible, ref] = isInView({ threshold: 0.3 })
  const [animateIn, setAnimateIn] = useState(false)

  const setAnimateInTrue = useCallback(() => setAnimateIn(true), [])

  useEffect(() => {
    if (animationQueue) {
      if (isVisible) {
        animationQueue.add(setAnimateInTrue)
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
      {(() => {
        if (transition === 'grow') return <Grow in={animateIn}>{children}</Grow>
        if (transition === 'slide')
          return (
            <Slide in={animateIn} direction={direction}>
              {children}
            </Slide>
          )
        if (transition === 'fade') return <Fade in={animateIn}>{children}</Fade>
      })()}
    </div>
  )
}
