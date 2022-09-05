import { CSSProperties, forwardRef, ReactElement, useRef } from 'react'
import { useForkRef } from 'rooks'

import { Typography } from '@material-ui/core'

import { isInView } from '../../utility/isInView'
import { useRect } from '../../utility/useRect'
import { useTimelineStyles } from './styles'
import { TimelineCategory } from './types'
import { StickyHeader } from './StickyHeader'

export const CategoryHeader = forwardRef<
  HTMLElement,
  {
    category: TimelineCategory
    stickyHeaderEnabled?: boolean
    style?: CSSProperties
  }
>(({ category, stickyHeaderEnabled, style }, outerRef): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <StickyHeader
      className={styles.categoryCell}
      stickyHeaderEnabled={stickyHeaderEnabled}
      style={{ color: category.color, ...style }}
    >
      {() => (
        <Typography variant="h5" component="h2">
          {category.name}
        </Typography>
      )}
    </StickyHeader>
  )
})
