import React, { HTMLProps, ReactElement } from 'react'

import { Fade, Grow, Slide } from '@material-ui/core'

import { isInView } from './isInView'

export const ParallaxShow = ({
  children,
  transition = 'grow',
  direction = 'left',
  ...props
}: {
  children: ReactElement
  transition?: 'grow' | 'slide' | 'fade'
  direction?: 'left' | 'right' | 'up' | 'down'
} & HTMLProps<HTMLDivElement>): ReactElement => {
  const [isVisible, ref] = isInView({ threshold: 0.1 })
  return (
    <div ref={ref} {...props}>
      {(() => {
        if (transition === 'grow') return <Grow in={isVisible}>{children}</Grow>
        if (transition === 'slide')
          return (
            <Slide in={isVisible} direction={direction}>
              {children}
            </Slide>
          )
        if (transition === 'fade') return <Fade in={isVisible}>{children}</Fade>
      })()}
    </div>
  )
}
