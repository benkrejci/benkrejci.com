import { CSSProperties, ReactElement } from 'react'

import { Zoom } from '@material-ui/core'

import { ParallaxQueue } from '../../utility/ParallaxQueue'
import { QueuedParallaxShow } from '../../utility/QueuedParallaxShow'
import { useTimelineStyles, YEAR_LINE_ANIMATION_DURATION_MS } from './styles'

export const YearLine = ({
  parallaxQueue,
  enabled,
  fadeOut,
  fadeIn,
  style,
}: {
  parallaxQueue: ParallaxQueue
  enabled?: boolean
  fadeOut?: boolean
  fadeIn?: boolean
  style?: CSSProperties
  animationDurationMs?: number
}): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <div className={styles.verticalLineCell} style={style} aria-hidden>
      <QueuedParallaxShow
        enabled={enabled}
        transition={<Zoom timeout={YEAR_LINE_ANIMATION_DURATION_MS} />}
        className={styles.verticalLineContainer}
        queue={parallaxQueue}
      >
        <div
          className={`${styles.verticalLine} ${
            fadeOut ? styles.fadeOutLine : fadeIn ? styles.fadeInLine : ''
          }`}
        />
      </QueuedParallaxShow>
    </div>
  )
}
