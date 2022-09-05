import { ReactElement, useState, useRef, useEffect } from 'react'

import { alpha, Box, Button, Grow, Link } from '@material-ui/core'
import { ArrowDownward, ArrowUpward } from '@material-ui/icons'

import { isInView } from '../../utility/isInView'
import { ParallaxQueue, useParallaxQueue } from '../../utility/ParallaxQueue'
import { CategoryHeader } from './CategoryHeader'
import { CategoryLine } from './CategoryLine'
import { Event } from './Event'
import { CATEGORY_LINE_ANIMATION_DURATION_MS, useTimelineStyles } from './styles'
import { TimelineCategory, TimelineEvent } from './types'
import { YearLabel } from './YearLabel'
import { YearLine } from './YearLine'
import { useRect } from '../../utility/useRect'
import { StickyHeader } from './StickyHeader'

interface CellDefinition {
  type: 'yearLine' | 'yearLabel' | 'event'
  event?: TimelineEvent
  year?: number
  rowStart: number
  rowEnd: number
  columnStart?: number
}

function renderCell(
  cell: CellDefinition,
  isFlipping: boolean,
  yearParallaxQueue: ParallaxQueue,
  eventParallaxQueue: ParallaxQueue,
) {
  switch (cell.type) {
    case 'yearLine':
      return (
        <YearLine
          style={{ gridRowStart: cell.rowStart, gridRowEnd: cell.rowEnd }}
          parallaxQueue={yearParallaxQueue}
          key={`yearLine-${cell.year}`}
        />
      )

    case 'yearLabel':
      return (
        <YearLabel
          year={cell.year}
          style={{ gridRowStart: cell.rowStart }}
          parallaxQueue={yearParallaxQueue}
          key={`yearLabel-${cell.year}`}
        />
      )

    case 'event':
      return (
        <Event
          event={cell.event}
          style={{
            gridRowStart: cell.rowStart,
            gridRowEnd: cell.rowEnd,
            gridColumnStart: cell.columnStart,
          }}
          parallaxQueue={eventParallaxQueue}
          key={`event-${cell.rowStart}`}
        />
      )
  }
}

export const Timeline = ({
  categories,
  events,
}: {
  categories: TimelineCategory[]
  events: TimelineEvent[]
}): ReactElement => {
  const [sortIsDesc, setSortIsDesc] = useState(true)
  const [sortIsFlipping, setSortIsFlipping] = useState(false)
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

  useEffect(() => {
    if (sortIsFlipping) {
      (async () => {
        yearParallaxQueue.setEasingEnabled(false)
        eventParallaxQueue.setEasingEnabled(false)
        await Promise.all([
          new Promise<void>((resolve) => yearParallaxQueue.forceHideAll(resolve)),
          new Promise<void>((resolve) => eventParallaxQueue.forceHideAll(resolve)),
        ])
        yearParallaxQueue.setEasingEnabled(true)
        eventParallaxQueue.setEasingEnabled(true)
        setSortIsFlipping(false)
        setSortIsDesc(!sortIsDesc)
        yearParallaxQueue.reInitObserver()
        eventParallaxQueue.reInitObserver()
      })()
    }
  }, [sortIsFlipping, sortIsDesc])

  const cells: ReactElement[] = []

  // future year line
  cells.push(
    <YearLine
      fadeIn
      enabled={!sortIsDesc}
      parallaxQueue={yearParallaxQueue}
      style={{ gridRowStart: 3, gridRowEnd: 4 }}
      key="yearLine-asc-future"
    />,
  )

  // space between category headers and events
  cells.push(<div className={styles.topBufferCell} key="topBuffer" />)

  const startRow = 3
  let rowIndex = startRow
  let lastRow: number | null = null

  const eventCells: Array<CellDefinition> = (() => {
    const eventCells = []
    let lastYear: number | null = null
    for (let eventIndex = 0; eventIndex <= events.length; eventIndex++) {
      const event = events[eventIndex]
      const rowStartIndex = rowIndex

      const currentYear = event ? event.start.getFullYear() : new Date().getFullYear()
      if (lastYear !== currentYear) {
        if (lastRow !== null) {
          // year line
          eventCells.push({
            type: 'yearLine',
            year: currentYear,
            rowStart: lastRow + 1,
            rowEnd: rowIndex + 1,
          })
        }
        rowIndex++

        lastRow = rowIndex
        lastYear = currentYear
        // year label
        eventCells.push({
          type: 'yearLabel',
          year: currentYear,
          rowStart: rowIndex++,
          rowEnd: rowIndex,
        })
      }

      // event
      if (event) {
        const categoryIndex = categories.indexOf(event.category)
        eventCells.push({
          type: 'event',
          event,
          rowStart: rowStartIndex,
          rowEnd: rowIndex++,
          columnStart: 2 + categoryIndex,
        })
      }
    }
    return eventCells
  })()

  // future year line
  cells.push(
    <YearLine
      fadeOut
      enabled={sortIsDesc}
      parallaxQueue={yearParallaxQueue}
      style={{ gridRowStart: lastRow + 1, gridRowEnd: rowIndex++ + 1 }}
      key="yearLine-desc-future"
    />,
  )

  // render cells
  if (sortIsDesc) {
    eventCells.forEach((cell) =>
      cells.push(renderCell(cell, !sortIsFlipping, yearParallaxQueue, eventParallaxQueue)),
    )
  } else {
    for (let cellIndex = eventCells.length - 1; cellIndex >= 0; cellIndex--) {
      const cellDefinition = eventCells[cellIndex]
      const rowStart = rowIndex - cellDefinition.rowEnd + startRow
      cellDefinition.rowEnd = rowIndex - cellDefinition.rowStart + startRow
      cellDefinition.rowStart = rowStart
      cells.push(renderCell(cellDefinition, !sortIsFlipping, yearParallaxQueue, eventParallaxQueue))
    }
  }

  const [timelineInView, timelineRef] = isInView({ threshold: 0 })

  // sort button
  cells.push(
    <StickyHeader
      className={styles.sortCell}
      stickyHeaderEnabled={timelineInView}
      key="sort-button"
    >
      {() => (
        <Button onClick={() => setSortIsFlipping(true)}>
          {sortIsDesc !== sortIsFlipping ? <ArrowDownward /> : <ArrowUpward />}
        </Button>
      )}
    </StickyHeader>,
  )

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
    <div className={styles.container} ref={timelineRef}>
      {cells}
    </div>
  )
}
