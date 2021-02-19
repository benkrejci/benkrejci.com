import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Grid, makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { Global, Page as PageModel } from '../api/api'
import { Navigation } from './Navigation'
import { Social } from './widgets/Social'
import { Widgets } from './widgets/Widgets'

export function Page({
  global,
  pages,
  header,
  footer,
  children,
}: {
  global: Global
  pages: PageModel[]
  header?: ReactElement
  footer?: ReactElement
  children?: ReactElement | ReactElement[] | string
}): ReactElement {
  const router = useRouter()
  const matchingSlug = (router.asPath.charAt(0) === '/' && router.asPath.slice(1)) || 'home'
  const currentPage = pages.find((page) => matchingSlug === page.slug)

  const styles = useStyles()

  return (
    <>
      <Head key="page-head">
        <title>{global.title}</title>
      </Head>

      <Container maxWidth="lg">
        <Box my={2} component="header">
          <Grid container spacing={4} justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h1" className={styles.headerTitle}>
                Casey Georgi
              </Typography>
            </Grid>

            {currentPage?.socialInNav ? (
              <Grid item>
                <Box>
                  <Social socials={global.socials} />
                </Box>
              </Grid>
            ) : (
              ''
            )}

            <Grid item>
              <Box>
                <Navigation pages={pages} />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {header}

        <Grid container className={styles.widgetsContainer} spacing={4}>
          {currentPage?.leftWidgets?.length ? (
            <Grid item xs={12} sm={4} md={3} className={styles.leftWidgets}>
              <Widgets global={global}>{currentPage.leftWidgets}</Widgets>
            </Grid>
          ) : (
            ''
          )}
          <Grid item className={styles.centerWidgets}>
            <Widgets global={global}>{currentPage?.topWidgets}</Widgets>
            {children}
            <Widgets global={global}>{currentPage?.bottomWidgets}</Widgets>
          </Grid>
          {currentPage?.rightWidgets?.length ? (
            <Grid item xs={12} sm={4} md={3} className={styles.rightWidgets}>
              <Widgets global={global}>{currentPage.rightWidgets}</Widgets>
            </Grid>
          ) : (
            ''
          )}
        </Grid>

        {footer}
      </Container>
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  headerTitle: {
    background: theme.extendedPalette.background.groovy,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  widgetsContainer: {
    flexWrap: 'nowrap',

    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap',
    },
  },

  leftWidgets: {
    //order: 0,
  },

  centerWidgets: {
    //order: 2,
    flexGrow: 1,
  },

  rightWidgets: {
    //order: 3,

    [theme.breakpoints.down('xs')]: {
      //order: 1,
    },
  },
}))
