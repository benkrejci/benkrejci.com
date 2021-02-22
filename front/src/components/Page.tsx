import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { Grid, Link, makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { Global } from '../api/api'
import { InternalLink } from '../utility/InternalLink'
import { Navigation } from './Navigation'
import { Social } from './widgets/Social'
import { Widgets } from './widgets/Widgets'

export function Page({
  global,
  title,
  description,
  header,
  footer,
  children,
}: {
  global: Global
  title?: string
  description?: string
  header?: ReactElement
  footer?: ReactElement
  children?: ReactElement | ReactElement[] | string
}): ReactElement {
  const router = useRouter()
  const matchingSlug = (router.asPath.charAt(0) === '/' && router.asPath.slice(1)) || 'home'
  const currentPage = global.topNav.find((page) => matchingSlug === page.slug)

  title = title || currentPage?.title || ''
  description = description || currentPage?.description || ''

  const styles = useStyles()

  return (
    <>
      <Head key="page-head">
        <title>
          {title ? title + ' - ' : ''}
          {global.title}
        </title>
        {description ? <meta name="description" content={description} /> : ''}
      </Head>

      <Container maxWidth="lg" className={styles.container}>
        <Box my={3} component="header">
          <Grid container spacing={4} justify="space-between" alignItems="center">
            <Grid item>
              <Link href="/" component={InternalLink} style={{ textDecoration: 'none' }}>
                <Typography variant="h1" className={styles.headerTitle}>
                  {global.title}
                </Typography>
              </Link>
            </Grid>

            {!currentPage || currentPage.socialInNav ? (
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
                <Navigation pages={global.topNav} />
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
  container: {
    // Setting overflow to force inner margin not to collapse outside the container.
    // Otherwise margin will end up between <html> and container elements
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    minHeight: '100vh',
    boxShadow: `0 0 ${theme.spacing(3)}px rgb(0 0 0 / 24%)`,
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.spacing(2)}px`,
    },
    [theme.breakpoints.up('sm')]: {
      padding: `0 ${theme.spacing(3)}px`,
    },
    [theme.breakpoints.up('md')]: {
      padding: `0 ${theme.spacing(4)}px`,
    },
    [theme.breakpoints.up('lg')]: {
      padding: `0 ${theme.spacing(6)}px`,
    },
  },

  headerTitle: {
    background: theme.extendedPalette.background.subdued,
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
    flexShrink: 0,
    //order: 0,
  },

  centerWidgets: {
    //order: 2,
    flexGrow: 1,
  },

  rightWidgets: {
    flexShrink: 0,
    //order: 3,

    [theme.breakpoints.down('xs')]: {
      //order: 1,
    },
  },
}))
