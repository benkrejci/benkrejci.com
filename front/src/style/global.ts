import { makeStyles } from "@material-ui/core";

export const useGlobalStyles = makeStyles(theme => ({
  inlineIcon: {
    fontSize: '1em',
    position: 'relative',
    top: '-0.08em',
    verticalAlign: 'middle',
    '.MuiTypography-h1 &, .MuiTypography-h2 &, .MuiTypography-h3 &': {
      fontSize: '0.75em',
    }
  }
}))