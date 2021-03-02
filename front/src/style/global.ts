import { makeStyles } from '@material-ui/core'

export const useGlobalStyles = makeStyles((theme) => ({
  inlineIcon: {
    fontSize: '1em',
    position: 'relative',
    top: '-0.08em',
    verticalAlign: 'middle',
    '.MuiTypography-h1 &, .MuiTypography-h2 &, .MuiTypography-h3 &': {
      fontSize: '0.75em',
    },
  },
  // TODO: this is in @material-ui/utils v5.0 so get rid of it when we upgrade
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  },
}))
