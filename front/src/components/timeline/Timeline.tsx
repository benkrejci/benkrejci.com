import { ReactElement } from 'react'

import { fade } from '@material-ui/core'

import { useGlobalStyles } from '../../style/global'
import { useAnimationQueue } from '../../utility/AnimationQueue'
import { isInView } from '../../utility/isInView'
import { CategoryHeader } from './CategoryHeader'
import { CategoryLine } from './CategoryLine'
import { Event } from './Event'
import { useTimelineStyles } from './styles'
import { TimelineCategory, TimelineEvent } from './types'
import { YearLabel } from './YearLabel'
import { YearLine } from './YearLine'

export const Timeline = ({
  categories,
  events,
}: {
  categories: TimelineCategory[]
  events: TimelineEvent[]
}): ReactElement => {
  const globalStyles = useGlobalStyles()
  const styles = useTimelineStyles()
  const yearAnimationQueue = useAnimationQueue()
  const eventAnimationQueue = useAnimationQueue()

  const cells: ReactElement[] = []

  let lastRow: number | null = null
  let lastYear: number | null = null
  let rowIndex = 2

  // space between category headers and events
  cells.push(<div className={styles.topBufferCell} key="topBuffer" />)
  rowIndex++

  for (let eventIndex = 0; eventIndex <= events.length; eventIndex++) {
    const event = events[eventIndex]
    const rowStartIndex = rowIndex

    const currentYear = event ? event.start.getFullYear() : new Date().getFullYear()
    if (lastYear !== currentYear) {
      if (lastRow !== null) {
        // year line
        cells.push(
          <YearLine
            style={{ gridRowStart: lastRow + 1, gridRowEnd: rowIndex++ + 1 }}
            animationQueue={yearAnimationQueue}
            key={`yearLine-${currentYear}`}
          />,
        )
      }

      lastRow = rowIndex
      lastYear = currentYear
      // year label
      cells.push(
        <YearLabel
          year={currentYear}
          style={{ gridRowStart: rowIndex++ }}
          animationQueue={yearAnimationQueue}
          key={`yearLabel-${rowIndex}`}
        />,
      )
    }

    // event
    if (event) {
      const categoryIndex = categories.indexOf(event.category)
      cells.push(
        <Event
          event={event}
          style={{
            gridRowStart: rowStartIndex,
            gridRowEnd: rowIndex++,
            gridColumnStart: 2 + categoryIndex,
          }}
          animationQueue={eventAnimationQueue}
          key={`event-${rowIndex}`}
        />,
      )
    }
  }

  // future year line
  cells.push(
    <YearLine
      fadeOut
      style={{ gridRowStart: lastRow + 1, gridRowEnd: rowIndex++ + 1 }}
      key="yearLine-future"
    />,
  )

  const stickyHeaders: ReactElement[] = []
  const [timelineInView, timelineRef] = isInView({ threshold: 0 })

  categories.forEach((category, categoryIndex) => {
    const gridColumnStart = 2 + categoryIndex

    // category header
    cells.push(
      <CategoryHeader
        category={category}
        stickyHeaderEnabled={timelineInView}
        style={{
          gridColumnStart,
          gridRowStart: 1,
        }}
        key={`categoryHeader-${category.name}`}
      />,
    )

    // category line
    cells.push(
      <CategoryLine
        color={fade(category.color, 0.5)}
        style={{
          gridColumnStart,
          gridRowStart: 2,
          gridRowEnd: rowIndex,
        }}
        key={`categoryLine-${category.name}`}
      />,
    )
  })

  return (
    <>
      {stickyHeaders}
      <div className={styles.container} ref={timelineRef}>
        {cells}
      </div>
    </>
  )
}
