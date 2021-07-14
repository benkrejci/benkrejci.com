import { createTheme, alpha, responsiveFontSizes } from '@material-ui/core'

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    tertiary: PaletteColor
    quarternary: PaletteColor
  }

  interface PaletteOptions {
    tertiary?: PaletteColorOptions
    quarternary?: PaletteColorOptions
  }
}

declare module '@material-ui/core/styles/createTheme' {
  interface TypeGradient {
    groovy: string
    subdued: string
    darkRadial: string
  }

  interface Theme {
    gradient: TypeGradient
  }

  interface ThemeOptions {
    gradient?: Partial<TypeGradient>
  }
}

const PRIMARY = '#89beff'
const SECONDARY = '#c9ce78'
const TERTIARY = '#e5a67f'
const QUARTERNARY = '#86ccb5'
const BACKGROUND_DARK = 'rgba(1, 6, 18, 1)'
const BACKGROUND_LIGHT = 'rgba(32, 21, 42, 1)'
const BACKGROUND_PAPER = 'rgba(28, 31, 49, 0.76)'

export const theme = responsiveFontSizes(
  createTheme({
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

    palette: {
      type: 'dark',
      primary: {
        main: PRIMARY,
      },
      secondary: {
        main: SECONDARY,
      },
      tertiary: {
        main: TERTIARY,
      },
      quarternary: {
        main: QUARTERNARY,
      },
      text: {},
      background: {
        default: BACKGROUND_DARK,
        paper: BACKGROUND_PAPER,
      },
      tonalOffset: 0.2,
    },

    gradient: {
      groovy: `linear-gradient(50deg, ${PRIMARY} 0%, ${SECONDARY} 100%)`,
      subdued: `linear-gradient(130deg, ${SECONDARY} 0%, ${PRIMARY} 100%)`,
      darkRadial: `radial-gradient(${alpha(BACKGROUND_DARK, 0.85)} 50%, transparent 100%)`,
    },

    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            background: `linear-gradient(0deg, ${BACKGROUND_LIGHT} 0%, rgb(1 11 34) 22%, ${BACKGROUND_DARK} 100%)`,
            backgroundAttachment: 'fixed',
          },
        },
      },
      MuiPaper: {
        elevation1: {
          boxShadow: '0 0 4px 0 rgb(0 0 0 / 60%)',
        },
        elevation2: {
          boxShadow: '0 0 6px 0 rgb(0 0 0 / 70%)',
        },
        elevation3: {
          boxShadow: '0 0 10px 0 rgb(0 0 0 / 85%)',
        },
        elevation4: {
          boxShadow: '0 0 14px 0 rgb(0 0 0 / 100%)',
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

      MuiOutlinedInput: {
        root: {
          backgroundColor: BACKGROUND_PAPER,
        },
      },

      MuiInputLabel: {
        outlined: {
          backgroundColor: BACKGROUND_PAPER,
        },
      },
    },
  }),
)
