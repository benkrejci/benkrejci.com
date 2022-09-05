import { CSSProperties, forwardRef, ReactChildren, ReactElement, ReactNode, useRef } from 'react'
import { useForkRef } from 'rooks'

import { Typography } from '@material-ui/core'

import { isInView } from '../../utility/isInView'
import { useRect } from '../../utility/useRect'
import { useTimelineStyles } from './styles'
import { TimelineCategory } from './types'

export const StickyHeader = forwardRef<
  HTMLElement,
  {
    children: () => ReactNode
    className?: string
    stickyHeaderEnabled?: boolean
    style?: CSSProperties
  }
>(
  ({ className, children, stickyHeaderEnabled, style }, outerRef): ReactElement => {
    const styles = useTimelineStyles()

    // Disregard horizontal occlusion by adding arbitrarily large horizontal margin
    // (This actually does not work in Chrome at the time of writing due to a presumed bug)
    const [inView, inViewRef] = isInView({ threshold: 1, rootMargin: '0px 2000px' })
    const rectRef = useRef()
    const headerRect = useRect(rectRef)
    const tempRef = useForkRef(inViewRef, rectRef)
    const headerRef = useForkRef(tempRef, outerRef)

    return (
      <>
        <div
          className={className}
          style={style}
          aria-hidden
          ref={headerRef}
        >
          {children()}
        </div>
        <div
          className={`${className} ${styles.stickyHeader}`}
          style={{
            display: stickyHeaderEnabled && !inView ? 'block' : 'none',
            left: headerRect?.left,
            width: headerRect?.width,
            height: headerRect?.height,
            ...style,
          }}
          aria-hidden
        >
          {children()}
        </div>
      </>
    )
  },
)
