import { ReactElement } from 'react'

import { Box, Grow, Link, Paper, Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { Icon } from '../../icons/Icon'
import { useGlobalStyles } from '../../style/global'
import { AnimationQueue } from '../../utility/AnimationQueue'
import { ExternalLink } from '../../utility/ExternalLink'
import { ParallaxShow } from '../../utility/ParallaxShow'
import { WrapIf } from '../../utility/WrapIf'
import { RichText } from '../widgets/RichText'
import { EVENT_ANIMATION_DURATION_MS, EVENT_INTERSECTION_MARGIN, useTimelineStyles } from './styles'
import { TimelineEvent } from './types'

export const Event = ({
  event,
  style,
  animationQueue,
}: {
  event: TimelineEvent
  style?: CSSProperties
  animationQueue?: AnimationQueue
}): ReactElement => {
  const globalStyles = useGlobalStyles()
  const styles = useTimelineStyles()

  return (
    <div className={styles.eventCell} style={style}>
      <WrapIf
        if={event.url}
        wrapper={
          <Link href={event.url} target="_blank" component={ExternalLink}>
            {' '}
          </Link>
        }
      >
        <ParallaxShow
          animationQueue={animationQueue}
          transition={<Grow timeout={EVENT_ANIMATION_DURATION_MS} />}
          observerProps={{ rootMargin: EVENT_INTERSECTION_MARGIN }}
        >
          <Paper elevation={2}>
            <Icon name={event.icon} className={styles.eventIcon} />
            <Typography variant="h5" component="h4">
              {event.title}
            </Typography>
            <Box className={globalStyles.visuallyHidden}>Category: {event.category.name}</Box>
            <RichText>{event.description}</RichText>
          </Paper>
        </ParallaxShow>
      </WrapIf>
    </div>
  )
}
