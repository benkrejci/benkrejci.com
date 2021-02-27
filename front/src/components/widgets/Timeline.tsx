import React, { ReactElement } from 'react'

import { makeStyles, Paper, Typography, useTheme } from '@material-ui/core'
import MuiTimeline from '@material-ui/lab/Timeline'
import TimelineConnector from '@material-ui/lab/TimelineConnector'
import TimelineContent from '@material-ui/lab/TimelineContent'
import TimelineDot from '@material-ui/lab/TimelineDot'
import TimelineItem from '@material-ui/lab/TimelineItem'
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent'
import TimelineSeparator from '@material-ui/lab/TimelineSeparator'

import { TimelineEvent } from '../../api/api'
import { Icon } from '../Icon'
import { RichText } from './RichText'

export const Timeline = ({
  description,
  timelineEvents,
}: {
  description: string
  timelineEvents: TimelineEvent[]
}): ReactElement => {
  const styles = useStyles()
  const theme = useTheme()

  const categoryColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.tertiary.main,
    theme.palette.quarternary.main,
    theme.palette.grey[400],
  ].reverse()
  const categories: Array<{
    backgroundColor: string
    color: string
    name: string
  }> = []
  const events = timelineEvents
    .map((event) => ({
      ...event,
      start: parseDate(event.start),
    }))
    .sort((event1, event2) => event1.start.valueOf() - event2.start.valueOf())
    .map((event) => {
      let category = categories.find((cat) => cat.name === event.category)
      if (!category) {
        const categoryColor = categoryColors.pop()
        category = {
          name: event.category,
          backgroundColor: categoryColor,
          color: theme.palette.getContrastText(categoryColor),
        }
        categories.push(category)
      }
      return {
        ...event,
        category,
      }
    })

  let lastYear: number | null = null

  return (
    <>
      <RichText>{description}</RichText>
      <MuiTimeline align="alternate">
        {events.map((event) => (
          <TimelineItem key={event.id}>
            {(() => {
              const thisYear = event.start.getFullYear()
              if (lastYear === null || lastYear !== thisYear) {
                lastYear = thisYear
                return (
                  <TimelineOppositeContent>
                    <Typography variant="h5" component="h3">
                      {thisYear}
                    </Typography>
                  </TimelineOppositeContent>
                )
              }
              return ''
            })()}
            <TimelineSeparator>
              <TimelineDot
                style={{
                  backgroundColor: event.category.backgroundColor,
                  color: event.category.color,
                }}
              >
                {event.icon && <Icon name={event.icon} className={styles.timelineIcon} />}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} className={styles.eventWrapper}>
                <Typography variant="h6" component="h4">
                  {event.title}
                </Typography>
                <Typography>{event.description}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </MuiTimeline>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  eventWrapper: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },

  timelineIcon: {
    //color: theme.palette.primary.main,
  },
}))

function parseDate(dateString: string): Date {
  if (!dateString) return null
  const dateParts = dateString.split('-').map((part) => parseInt(part))
  if (!dateParts.every((part) => !isNaN(part))) {
    console?.warn && console.warn(`Invalid date passed to parseDate: ${dateString}`)
    return null
  }
  return new Date(dateParts[0], dateParts[1], dateParts[2])
}
