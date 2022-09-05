import { fade, makeStyles } from '@material-ui/core'

export const YEAR_LABEL_ANIMATION_DURATION_MS = 600
export const YEAR_LINE_ANIMATION_DURATION_MS = 1400
export const EVENT_ANIMATION_DURATION_MS = 400
export const CATEGORY_LINE_ANIMATION_DURATION_MS = 400

export const EVENT_INTERSECTION_MARGIN = '-72px 0px 0px 0px'

export const useTimelineStyles = makeStyles((theme) => ({
  container: {
    display: 'grid',
    //columnGap: theme.spacing(1),
  },

  sortCell: {
    gridRowStart: 1,
    gridRowEnd: 'span 3',
    gridColumnStart: 1,
    gridColumnEnd: 'span 1',
    justifySelf: 'center',
    alignSelf: 'center',
  },

  topBufferCell: {
    gridColumnStart: 2,
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
    margin: `${theme.spacing(1 / 2)}px`,
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
    minHeight: '2px',
    width: '2px',
    backgroundColor: fade(theme.palette.text.primary, 0.6),
  },

  categoryLineCell: {
    gridColumnEnd: 'span 3',
  },

  fadeOutLine: {
    minHeight: '20px',
    background: `linear-gradient(180deg, ${fade(
      theme.palette.text.primary,
      0.6,
    )} 0%, transparent 100%)`,
  },

  fadeInLine: {
    minHeight: '20px',
    background: `linear-gradient(180deg, transparent 0%, ${fade(
      theme.palette.text.primary,
      0.6,
    )} 100%)`,
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

  stickyHeader: {
    position: 'fixed',
    top: 0,
    zIndex: 20,
    '& .MuiTypography-root': {
      display: 'inline-block',
      marginTop: -theme.spacing(1),
      paddingTop: theme.spacing(1),
      backgroundColor: fade(theme.palette.background.default, 0.85),
      boxShadow: `0 0 18px 18px ${fade(theme.palette.background.default, 0.85)}`,
    },
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
