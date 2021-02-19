import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    extendedPalette: {
      background: {
        groovy: string
        reverseGroovy: string
      }
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    extendedPalette?: {
      background?: {
        groovy?: string
        reverseGroovy?: string
      }
    }
  }
}

const primary = '#d82626'
const secondary = '#ec7800'

export const theme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      subtitle1: {
        fontSize: '1.3rem',
      },
      subtitle2: {
        fontSize: '1.15rem',
      },
    },
    extendedPalette: {
      background: {
        groovy: `linear-gradient(125deg, ${primary} 0%, ${secondary} 100%)`,
        reverseGroovy: `linear-gradient(65deg, ${secondary} 0%, ${primary} 100%)`,
      },
    },

    palette: {
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      tonalOffset: 0.05,
    },

    overrides: {
      MuiTypography: {
        h2: {
          color: secondary,
        },
        h4: {
          color: secondary,
        },
        subtitle1: {
          color: secondary,
        },
      },
    },
  }),
)
