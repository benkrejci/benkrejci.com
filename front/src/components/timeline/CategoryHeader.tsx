import { ReactElement, useRef } from 'react'
import { useForkRef } from 'rooks'

import { Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { isInView } from '../../utility/isInView'
import { useRect } from '../../utility/useRect'
import { useTimelineStyles } from './styles'
import { TimelineCategory } from './types'

export const CategoryHeader = ({
  category,
  stickyHeaderEnabled,
  style,
}: {
  category: TimelineCategory
  stickyHeaderEnabled?: boolean
  style?: CSSProperties
}): ReactElement => {
  const styles = useTimelineStyles()

  const [categoryInView, inViewRef] = isInView({ threshold: 1 })
  const rectRef = useRef()
  const headerRect = useRect(rectRef)
  const headerRef = useForkRef(inViewRef, rectRef)

  return (
    <>
      <div
        className={styles.categoryCell}
        style={{ color: category.color, ...style }}
        aria-hidden
        ref={headerRef}
      >
        <Typography variant="h5" component="h2">
          {category.name}
        </Typography>
      </div>
      <div
        className={`${styles.categoryCell} ${styles.stickyHeader}`}
        style={{
          display: stickyHeaderEnabled && !categoryInView ? 'block' : 'none',
          color: category.color,
          left: headerRect?.left,
          width: headerRect?.width,
          height: headerRect?.height,
        }}
        aria-hidden
      >
        <Typography variant="h5" component="h2">
          {category.name}
        </Typography>
      </div>
    </>
  )
}
