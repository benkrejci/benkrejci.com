import { CSSProperties, ReactElement } from 'react'

import { Slide, Typography } from '@material-ui/core'

import { ParallaxQueue } from '../../utility/ParallaxQueue'
import { QueuedParallaxShow } from '../../utility/QueuedParallaxShow'
import { useTimelineStyles, YEAR_LABEL_ANIMATION_DURATION_MS } from './styles'

export const YearLabel = ({
  year,
  style,
  parallaxQueue,
}: {
  year: number
  parallaxQueue: ParallaxQueue
  style?: CSSProperties
}): ReactElement => {
  const styles = useTimelineStyles()
  return (
    <div className={styles.dateCell} style={style} aria-hidden>
      <QueuedParallaxShow
        transition={
          <Slide direction="right" timeout={YEAR_LABEL_ANIMATION_DURATION_MS} />
        }
        queue={parallaxQueue}
      >
        <Typography variant="subtitle1" component="h3">
          {year}
        </Typography>
      </QueuedParallaxShow>
    </div>
  )
}
