import { fade, Box, Button, makeStyles } from '@material-ui/core'
import { useRouter } from 'next/router'
import React from 'react'
import { ExternalLink } from '../utility/ExternalLink'

export const PreviewModeBar = () => {
  const styles = useStyles()
  const router = useRouter()

  return (
    <Box className={styles.container} px={2} py={1}>
      You are in preview mode.
      {/* @ts-ignore MUI Button TS bug */}
      <Button
        href={`/api/exit-preview?returnTo=${router.asPath}`}
        component={ExternalLink}
        variant="contained"
        color="primary"
        size="small"
        className={styles.button}
      >
        Exit preview mode.
      </Button>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: fade(theme.palette.primary.main, 0.2),
  },

  button: {
    textTransform: 'none',
  },
}))
