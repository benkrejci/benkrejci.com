import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode } from 'react'

import { Grid, Hidden, Link, makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

import { Global } from '../api/api'
import { InternalLink } from '../utility/InternalLink'
import { Navigation } from './Navigation'
import { Social } from './widgets/Social'
import { Widgets } from './widgets/Widgets'
import { PreviewModeBar } from './PreviewModeBar'

export function Page({
  global,
  preview,
  title,
  description,
  header,
  footer,
  children,
}: {
  global: Global
  preview: boolean
  title?: string
  description?: string
  header?: ReactElement
  footer?: ReactElement
  children?: ReactNode
}): ReactElement {
  const router = useRouter()
  const matchingSlug = (router.pathname.charAt(0) === '/' && router.query.pageName) || 'home'
  const currentPage = global.topNav.find((page) => matchingSlug === page.slug)

  title = title || currentPage?.title || ''
  description = description || currentPage?.description || ''

  const styles = useStyles()

  const socialHiddenProps = {}
  if (currentPage?.hideSocialDown) socialHiddenProps[currentPage.hideSocialDown + 'Down'] = true
  if (currentPage?.hideSocialUp) socialHiddenProps[currentPage.hideSocialUp + 'Up'] = true

  return (
    <>
      <Head key="page-head">
        <title>
          {title ? title + ' - ' : ''}
          {global.title}
        </title>
        {description ? <meta name="description" content={description} /> : ''}
      </Head>

      {preview ? <PreviewModeBar /> : null}

      <Container maxWidth="lg" className={styles.container}>
        <Box my={3} component="header">
          <Grid container spacing={4} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Link href="/" component={InternalLink} style={{ textDecoration: 'none' }}>
                <Typography variant="h1" className={styles.headerTitle}>
                  {global.title}
                </Typography>
              </Link>
            </Grid>

            <Hidden implementation="css" {...socialHiddenProps}>
              <Grid item>
                <Box padding={2}>
                  <Social socials={global.socials} />
                </Box>
              </Grid>
            </Hidden>

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
    //backgroundColor: theme.palette.background.paper,
    minHeight: '100vh',
    //boxShadow: `0 0 ${theme.spacing(3)}px rgb(0 0 0 / 24%)`,
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
  },

  headerTitle: {
    background: theme.gradient.subdued,
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
