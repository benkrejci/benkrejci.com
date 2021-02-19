import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { Box, Button, makeStyles } from '@material-ui/core'

import { Page } from '../api/api'
import { InternalLink } from '../utility/InternalLink'

export function Navigation({ pages }: { pages: Page[] }): ReactElement {
  const router = useRouter()
  const matchingSlug = (router.asPath.charAt(0) === '/' && router.asPath.slice(1)) || 'home'
  const matchingPage = pages.find((page) => matchingSlug.startsWith(page.slug))
  const styles = useStyles()

  return (
    <>
      {pages.map((page) => (
        <Box mx={page === matchingPage ? 0 : 1} key={page.id} display="inline-block">
          {/* @ts-ignore MUI Button TS bug */}
          <Button
            href={`/${page.slug === 'home' ? '' : encodeURIComponent(page.slug)}`}
            variant={page === matchingPage ? 'contained' : 'text'}
            size="large"
            className={page === matchingPage ? styles.activeButton : ''}
            disableElevation
            component={InternalLink}
          >
            {page.title}
          </Button>
        </Box>
      ))}
    </>
  )
}

const useStyles = makeStyles((theme) => ({
  activeButton: {
    background: theme.extendedPalette.background.reverseGroovy,
    color: theme.palette.common.white,
  },
}))
