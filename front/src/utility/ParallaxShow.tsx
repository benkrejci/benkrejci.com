import React, {
  cloneElement, HTMLProps, ReactElement, useCallback, useEffect, useState
} from 'react'

import { Grow } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions'

import { AnimationQueue } from './AnimationQueue'
import { isInView } from './isInView'

export const ParallaxShow = <T extends TransitionProps>({
  children,
  transition = <Grow />,
  animationQueue,
  ...props
}: {
  children: ReactElement
  transition?: ReactElement
  transitionProps?: Omit<T, 'in' & 'children'>
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
      {cloneElement(transition, { in: animateIn, children })}
    </div>
  )
}
