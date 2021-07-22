import { ReactElement, useRef } from 'react'

import { alpha, Grow } from '@material-ui/core'

import { isInView } from '../../utility/isInView'
import { useParallaxQueue } from '../../utility/ParallaxQueue'
import { CategoryHeader } from './CategoryHeader'
import { CategoryLine } from './CategoryLine'
import { Event } from './Event'
import { CATEGORY_LINE_ANIMATION_DURATION_MS, useTimelineStyles } from './styles'
import { TimelineCategory, TimelineEvent } from './types'
import { YearLabel } from './YearLabel'
import { YearLine } from './YearLine'
import { useBoundingclientrect } from 'rooks'
import { useRect } from '../../utility/useRect'

export const Timeline = ({
  categories,
  events,
}: {
  categories: TimelineCategory[]
  events: TimelineEvent[]
}): ReactElement => {
  const styles = useTimelineStyles()
  const yearParallaxQueue = useParallaxQueue()
  const headerRef = useRef()
  const headerRect = useRect(headerRef)
  const eventParallaxQueue = useParallaxQueue({
    autoStart: false,
    observerProps: {
      threshold: 1,
      // allow room for header
      rootMargin: `-${headerRect?.height || 0}px 0px 0px 0px`,
    },
  })

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
            parallaxQueue={yearParallaxQueue}
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
          parallaxQueue={yearParallaxQueue}
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
          parallaxQueue={eventParallaxQueue}
          key={`event-${rowIndex}`}
        />,
      )
    }
  }

  // future year line
  cells.push(
    <YearLine
      fadeOut
      parallaxQueue={yearParallaxQueue}
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
        ref={headerRef}
        key={`categoryHeader-${category.name}`}
      />,
    )

    // category line
    cells.push(
      <Grow
        in={timelineInView}
        onEntered={() => eventParallaxQueue.resume()}
        timeout={CATEGORY_LINE_ANIMATION_DURATION_MS}
        key={`categoryLine-${category.name}`}
      >
        <CategoryLine
          color={alpha(category.color, 0.5)}
          style={{
            gridColumnStart,
            gridRowStart: 2,
            gridRowEnd: rowIndex,
          }}
        />
      </Grow>,
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
