import { ReactElement } from 'react'

import { fade, Link, makeStyles, Paper, Typography } from '@material-ui/core'

import { Icon } from '../icons/Icon'
import { useAnimationQueue } from '../utility/AnimationQueue'
import { ExternalLink } from '../utility/ExternalLink'
import { ParallaxShow } from '../utility/ParallaxShow'
import { WrapIf } from '../utility/WrapIf'
import { RichText } from './widgets/RichText'

export interface TimelineCategory {
  name: string
  color: string
  contrastColor: string
}

export interface TimelineEvent {
  start: Date
  title: string
  url: string
  description: string
  category: TimelineCategory
  icon: string
}

export const Timeline = ({
  categories,
  events,
}: {
  categories: TimelineCategory[]
  events: TimelineEvent[]
}): ReactElement => {
  const styles = useStyles()
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
          <div
            className={styles.verticalLineCell}
            style={{ gridRowStart: lastRow + 1, gridRowEnd: rowIndex++ + 1 }}
            key={`yearLine-${currentYear}`}
          >
            <ParallaxShow
              transition="fade"
              className={styles.verticalLineContainer}
              animationQueue={yearAnimationQueue}
            >
              <div className={styles.verticalLine} />
            </ParallaxShow>
          </div>,
        )
      }

      lastRow = rowIndex
      lastYear = currentYear
      // year label
      cells.push(
        <div
          className={styles.dateCell}
          style={{ gridRowStart: rowIndex++ }}
          key={`yearLabel-${rowIndex}`}
        >
          <ParallaxShow transition="slide" direction="right" animationQueue={yearAnimationQueue}>
            <Typography>{currentYear}</Typography>
          </ParallaxShow>
        </div>,
      )
    }

    // event
    if (event) {
      const categoryIndex = categories.indexOf(event.category)
      cells.push(
        <div
          className={styles.eventCell}
          style={{
            gridRowStart: rowStartIndex,
            gridRowEnd: rowIndex++,
            gridColumnStart: 2 + categoryIndex,
          }}
          key={`event-${rowIndex}`}
        >
          <WrapIf
            if={event.url}
            wrapper={
              <Link href={event.url} target="_blank" component={ExternalLink}>
                {' '}
              </Link>
            }
          >
            <ParallaxShow animationQueue={eventAnimationQueue}>
              <Paper elevation={2}>
                <Icon name={event.icon} className={styles.eventIcon} />
                <Typography variant="h5" component="h3">
                  {event.title}
                </Typography>
                <RichText>{event.description}</RichText>
              </Paper>
            </ParallaxShow>
          </WrapIf>
        </div>,
      )
    }
  }
  // future year line
  cells.push(
    <div
      className={styles.verticalLineCell}
      style={{ gridRowStart: lastRow + 1, gridRowEnd: rowIndex++ + 1 }}
      key="futureYearLine"
    >
      <div className={`${styles.verticalLine} ${styles.futureLine}`} />
    </div>,
  )

  categories.forEach((category, categoryIndex) => {
    const gridColumnStart = 2 + categoryIndex

    // category header
    cells.push(
      <div
        className={styles.categoryCell}
        style={{
          gridColumnStart,
          gridRowStart: 1,
          color: category.color,
        }}
        key={`categoryHeader-${category.name}`}
      >
        <Typography variant="h5" component="h2">
          {category.name}
        </Typography>
      </div>,
    )

    // category line
    const lineColor = fade(category.color, 0.5)
    cells.push(
      <div
        className={`${styles.verticalLineCell} ${styles.categoryLineCell}`}
        style={{
          gridColumnStart,
          gridRowStart: 2,
          gridRowEnd: rowIndex,
        }}
        key={`categoryLine-${category.name}`}
      >
        <div
          className={`${styles.verticalLine} ${styles.verticalLineCap}`}
          style={{
            background: `linear-gradient(180deg, transparent 0%, ${lineColor} 100%)`,
          }}
        />
        <div className={styles.verticalLine} style={{ backgroundColor: lineColor }} />
        <div
          className={`${styles.verticalLine} ${styles.verticalLineCap}`}
          style={{
            background: `linear-gradient(180deg, ${lineColor} 0%, transparent 100%)`,
          }}
        />
      </div>,
    )
  })

  return <div className={styles.container}>{cells}</div>
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    columnGap: theme.spacing(1),
  },

  topBufferCell: {
    gridColumnStart: 1,
    gridRowStart: 2,
    gridRowEnd: 3,
    minHeight: '20px',
  },

  dateCell: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 1',
    gridRowEnd: 'span 1',
    textAlign: 'center',
    alignSelf: 'end',
    margin: `${theme.spacing(1)}px`,
  },

  verticalLineCell: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 1',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },

  verticalLineContainer: {
    flexGrow: 1,
  },

  verticalLine: {
    height: '100%',
    width: '2px',
    backgroundColor: fade(theme.palette.text.primary, 0.6),
  },

  categoryLineCell: {
    gridColumnEnd: 'span 3',
  },

  futureLine: {
    minHeight: '20px',
    background: `linear-gradient(180deg, ${fade(
      theme.palette.text.primary,
      0.6,
    )} 0%, transparent 100%)`,
  },

  verticalLineCap: {
    height: '40px',
    flexGrow: 0,
  },

  categoryCell: {
    gridColumnEnd: 'span 3',
    gridRowEnd: 'span 1',
    textAlign: 'center',
  },

  eventCell: {
    gridColumnEnd: 'span 3',
    gridRowEnd: 'span 1',
    textAlign: 'center',
    zIndex: 10,
    padding: `${theme.spacing(1) / 2}px`,
    '& .MuiPaper-root': {
      display: 'inline-block',
      padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
      position: 'relative',
      overflow: 'visible',
    },
    '& .MuiLink-root .MuiPaper-root, & .MuiLink-root .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    },
  },

  eventIcon: {
    position: 'absolute',
    left: '-30px',
    top: '50%',
    marginTop: '-12px',
    color: fade(theme.palette.text.primary, 0.7),
  },
}))
