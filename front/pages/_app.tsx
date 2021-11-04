import Head from 'next/head'
import { useEffect } from 'react'

import { CssBaseline, ThemeProvider } from '@material-ui/core'

import { theme } from '../src/style/theme'
import { FragmentGeneratorProvider } from '../src/utility/FragmentGenerator'

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <>
      <Head key="app-head">
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <FragmentGeneratorProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </FragmentGeneratorProvider>
      </ThemeProvider>
    </>
  )
}
