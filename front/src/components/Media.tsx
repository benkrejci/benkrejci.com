import { Image } from './Image'
import React, { CSSProperties, ReactElement } from 'react'

import { Box, Grid, makeStyles, useTheme } from '@material-ui/core'

import { EXTERNAL_API_SERVER, ApiFile } from '../api/api'

const DIMENSION_MATCHER = /([0-9]*)([^0-9]*)/

export const Media = ({
  file,
  width,
  height,
  maxWidth = '100%',
  maxHeight = '40vh',
  align = 'center',
  className,
  style,
}: {
  file: ApiFile
  width?: number
  height?: number
  maxWidth?: string | number
  maxHeight?: string | number
  align?: 'center' | 'left' | 'right'
  className?: string
  style?: CSSProperties
}): ReactElement => {
  const theme = useTheme()
  const styles = useStyles()

  const src = `${EXTERNAL_API_SERVER}/${file.url}`
  const type = file.mime.match(/^[^/]*/)[0]

  width = width ?? file.width
  height = height ?? file.height
  let aspectRatio: number
  if (width != null && height != null) {
    aspectRatio = width / height
    if (maxWidth && !maxHeight) {
      if (typeof maxWidth === 'number') {
        maxHeight = maxWidth / aspectRatio
      } else {
        const match = maxWidth.match(DIMENSION_MATCHER)
        maxHeight = String(parseInt(match[1]) / aspectRatio) + (match[2] || '')
      }
    } else if (maxHeight && !maxWidth) {
      if (typeof maxHeight === 'number') {
        maxWidth = maxHeight * aspectRatio
      } else {
        const match = maxHeight.match(DIMENSION_MATCHER)
        maxWidth = String(parseInt(match[1]) * aspectRatio) + (match[2] || '')
      }
    }
  }

  return (
    <Grid
      container
      justifyContent={
        align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
      }
      className={className}
      style={{ backgroundColor: theme.palette.background.paper, ...style }}
    >
        <>
          {type === 'image' ? (
            <Image src={src} alt={file.alternativeText} className={styles.image} style={{ aspectRatio, maxWidth, maxHeight }} />
          ) : type === 'video' ? (
            <video controls loop style={{ aspectRatio, width, height, maxWidth, maxHeight }}>
              <source src={src} type={file.mime} />
            </video>
          ) : (
            () => {
              throw Error(`Unknown media type ${type} for file ${src}`)
            }
          )}
        </>
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  image: {
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}))
