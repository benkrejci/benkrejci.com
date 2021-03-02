import { ReactElement } from 'react'

import { Slide, Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { AnimationQueue } from '../../utility/AnimationQueue'
import { ParallaxShow } from '../../utility/ParallaxShow'
import { useTimelineStyles, YEAR_LABEL_ANIMATION_DURATION_MS } from './styles'

export const YearLabel = ({
  year,
  style,
  animationQueue,
}: {
  year: number
  style?: CSSProperties
  animationQueue?: AnimationQueue
}): ReactElement => {
  const styles = useTimelineStyles()
  return (
    <div className={styles.dateCell} style={style} aria-hidden>
      <ParallaxShow
        transition={<Slide direction="right" timeout={YEAR_LABEL_ANIMATION_DURATION_MS} />}
        animationQueue={animationQueue}
      >
        <Typography variant="subtitle1" component="h3">
          {year}
        </Typography>
      </ParallaxShow>
    </div>
  )
}
