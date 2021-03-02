import { ReactElement } from 'react'

import { Zoom } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { AnimationQueue } from '../../utility/AnimationQueue'
import { ParallaxShow } from '../../utility/ParallaxShow'
import { useTimelineStyles, YEAR_LINE_ANIMATION_DURATION_MS } from './styles'

export const YearLine = ({
  fadeOut,
  style,
  animationQueue,
}: {
  fadeOut?: boolean
  style?: CSSProperties
  animationQueue?: AnimationQueue
  animationDurationMs?: number
}): ReactElement => {
  const styles = useTimelineStyles()

  return (
    <div className={styles.verticalLineCell} style={style} aria-hidden>
      <ParallaxShow
        transition={<Zoom timeout={YEAR_LINE_ANIMATION_DURATION_MS} />}
        className={styles.verticalLineContainer}
        animationQueue={animationQueue}
      >
        <div className={`${styles.verticalLine} ${fadeOut ? styles.fadeOutLine : ''}`} />
      </ParallaxShow>
    </div>
  )
}
