import { CSSProperties, ReactElement } from 'react'

import { Box, Grow, Link, Paper, Typography } from '@material-ui/core'

import { Icon } from '../../icons/Icon'
import { useGlobalStyles } from '../../style/global'
import { ExternalLink } from '../../utility/ExternalLink'
import { ParallaxQueue } from '../../utility/ParallaxQueue'
import { QueuedParallaxShow } from '../../utility/QueuedParallaxShow'
import { WrapIf } from '../../utility/WrapIf'
import { RichText } from '../widgets/RichText'
import { EVENT_ANIMATION_DURATION_MS, EVENT_INTERSECTION_MARGIN, useTimelineStyles } from './styles'
import { TimelineEvent } from './types'

export const Event = ({
  enabled,
  event,
  parallaxQueue,
  style,
}: {
  enabled?: boolean
  event: TimelineEvent
  parallaxQueue: ParallaxQueue
  style?: CSSProperties
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
        <QueuedParallaxShow
          enabled={enabled}
          queue={parallaxQueue}
          transition={<Grow timeout={EVENT_ANIMATION_DURATION_MS} />}
        >
          <Paper elevation={2}>
            <Icon name={event.icon} className={styles.eventIcon} />
            <Typography variant="h5" component="h4">
              {event.title}
            </Typography>
            <Box className={globalStyles.visuallyHidden}>Category: {event.category.name}</Box>
            <RichText>{event.description}</RichText>
          </Paper>
        </QueuedParallaxShow>
      </WrapIf>
    </div>
  )
}
