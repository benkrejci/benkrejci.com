import { ReactElement } from 'react'

import { Zoom } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { ParallaxQueue } from '../../utility/ParallaxQueue'
import { QueuedParallaxShow } from '../../utility/QueuedParallaxShow'
import { useTimelineStyles, YEAR_LINE_ANIMATION_DURATION_MS } from './styles'

export const YearLine = ({
  parallaxQueue,
  fadeOut,
  style,
}: {
  parallaxQueue: ParallaxQueue
  fadeOut?: boolean
  style?: CSSProperties
  animationDurationMs?: number
}): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <div className={styles.verticalLineCell} style={style} aria-hidden>
      <QueuedParallaxShow
        transition={<Zoom timeout={YEAR_LINE_ANIMATION_DURATION_MS} />}
        className={styles.verticalLineContainer}
        queue={parallaxQueue}
      >
        <div className={`${styles.verticalLine} ${fadeOut ? styles.fadeOutLine : ''}`} />
      </QueuedParallaxShow>
    </div>
  )
}
