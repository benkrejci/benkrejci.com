import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    extendedPalette: {
      background: {
        groovy: string
        subdued: string
      }
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    extendedPalette?: {
      background?: {
        groovy?: string
        subdued?: string
      }
    }
  }
}

const primary = '#b789ff'
const secondary = '#78ce9b'

export const theme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      h1: {
        fontSize: '4rem',
        textTransform: 'uppercase',
        fontWeight: 500,
        letterSpacing: '0.2em',
      },
      subtitle1: {
        fontSize: '1.3rem',
      },
      subtitle2: {
        fontSize: '1.15rem',
      },
    },

    extendedPalette: {
      background: {
        groovy: `linear-gradient(50deg, ${primary} 0%, ${secondary} 100%)`,
        subdued: `linear-gradient(130deg, ${secondary} 0%, ${primary} 100%)`,
      },
    },

    palette: {
      type: 'dark',
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      text: {},
      background: {
        default: 'rgb(24, 24, 24)',
        paper: 'rgb(32, 32, 32)',
      },
      tonalOffset: 0.2,
    },

    overrides: {
      MuiPaper: {
        elevation1: {
          boxShadow: '0 0 4px 0 rgb(0 0 0 / 30%)',
        },
        elevation2: {
          boxShadow: '0 0 6px 0 rgb(0 0 0 / 40%)',
        },
        elevation3: {
          boxShadow: '0 0 10px 0 rgb(0 0 0 / 55%)',
        },
        elevation4: {
          boxShadow: '0 0 14px 0 rgb(0 0 0 / 68%)',
        },
      },
      MuiTypography: {
        // h2: {
        //   color: secondary,
        // },
        // h4: {
        //   color: secondary,
        // },
        // subtitle1: {
        //   color: secondary,
        // },
      },
    },
  }),
)
