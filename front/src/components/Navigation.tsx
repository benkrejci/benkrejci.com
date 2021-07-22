import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'

import { Page } from '../api/api'
import { InternalLink } from '../utility/InternalLink'

export function Navigation({ pages }: { pages: Page[] }): ReactElement {
  const router = useRouter()
  const matchingSlug = (router.asPath.charAt(0) === '/' && router.asPath.slice(1)) || 'home'
  const matchingPage = pages.find((page) => matchingSlug.startsWith(page.slug))
  const matchingPageIndex = pages.indexOf(matchingPage)
  const styles = useStyles()

  return (
    <Box className={styles.navWrapper}>
      {pages.map((page, pageIndex) => {
        const classes = [styles.navButton]
        if (pageIndex === matchingPageIndex) {
          classes.push(styles.activeButton)
        } else {
          classes.push(styles.inactiveButton)
          classes.push(pageIndex < matchingPageIndex ? styles.beforeButton : styles.afterButton)
        }
        return (
          <Box key={page.id}>
            {/* @ts-ignore MUI Button TS bug */}
            <Button
              href={`/${page.slug === 'home' ? '' : encodeURIComponent(page.slug)}`}
              variant={page === matchingPage ? 'contained' : 'text'}
              size="large"
              className={classes.join(' ')}
              disableElevation
              component={InternalLink}
            >
              {page.title}
            </Button>
          </Box>
        )
      })}
    </Box>
  )
}

const useStyles = makeStyles((theme) => {
  // I like it when the space between each edge is always the same.
  // Since an active button's edge is the actual border, while an inactive button's
  // edge, visually, is the text itself, make the inactive buttons overlap
  // to keep everything evenly spaced.
  const yPadding = 8
  const xPadding = 18
  const xSpaceBetween = 26
  const ySpaceBetween = 4
  return {
    navWrapper: {
      display: 'flex',
      flexWrap: 'wrap',
      margin: `${-ySpaceBetween}px ${-xSpaceBetween / 2}px`,
      padding: 0,
    },

    navButton: {},

    inactiveButton: {
      padding: `${yPadding}px ${xPadding}px`,
      // Distance from edge of text to next button edge (halfway between the two)
      // should be xSpaceBetween / 2. Subtract distance already travelled via
      // padding. This will end up being negative (inactive buttons will overlap)
      margin: `${ySpaceBetween}px ${xSpaceBetween / 2 - xPadding}px`,
    },

    beforeButton: {
      color: theme.palette.primary.main,
    },

    afterButton: {
      color: theme.palette.secondary.main,
    },

    activeButton: {
      // Distance from border to next button edge (halfway between the two)
      // should be xSpaceBetween / 2.
      margin: `${ySpaceBetween}px ${xSpaceBetween / 2}px`,
      padding: `${yPadding}px ${xPadding}px`,
      background: theme.gradient.groovy,
      color: theme.palette.getContrastText(theme.palette.primary.main),
    },
  }
})
