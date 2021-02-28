import React, { ReactElement } from 'react'

import { Box, useTheme } from '@material-ui/core'

import { TimelineEvent } from '../../api/api'
import { Timeline } from '../Timeline'
import { RichText } from './RichText'

export const TimelineWidget = ({
  description,
  timelineEvents,
}: {
  description: string
  timelineEvents: TimelineEvent[]
}): ReactElement => {
  const theme = useTheme()

  const categoryColors = [
    //theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.tertiary.main,
    theme.palette.quarternary.main,
    theme.palette.grey[400],
  ].reverse()
  const categories: Array<{
    color: string
    contrastColor: string
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
          color: categoryColor,
          contrastColor: theme.palette.getContrastText(categoryColor),
        }
        categories.push(category)
      }
      return {
        ...event,
        category,
      }
    })

  return (
    <Box m={2}>
      <RichText>{description}</RichText>
      <Timeline events={events} categories={categories} />
    </Box>
  )
}

function parseDate(dateString: string): Date {
  if (!dateString) return null
  const dateParts = dateString.split('-').map((part) => parseInt(part))
  if (!dateParts.every((part) => !isNaN(part))) {
    console?.warn && console.warn(`Invalid date passed to parseDate: ${dateString}`)
    return null
  }
  return new Date(dateParts[0], dateParts[1], dateParts[2])
}
