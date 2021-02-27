import MaterialImage from 'material-ui-image'
import React, { ReactElement } from 'react'

import { Grid, useTheme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

import { EXTERNAL_API_SERVER, Image as ImageModel } from '../api/api'

const DIMENSION_MATCHER = /([0-9]*)([^0-9]*)/

export const Image = ({
  image,
  maxWidth,
  maxHeight = '50vh',
  align = 'center',
  className,
  style,
}: {
  image: ImageModel
  maxWidth?: string | number
  maxHeight?: string | number
  align?: 'center' | 'left' | 'right'
  className?: string
  style?: CSSProperties
}): ReactElement => {
  const theme = useTheme()

  const aspectRatio = image.width / image.height
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

  return (
    <Grid
      container
      justify={align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'}
      className={className}
      style={{ backgroundColor: theme.palette.background.paper, ...style }}
    >
      <Grid item xs style={{ maxWidth, maxHeight }}>
        <MaterialImage
          src={`${EXTERNAL_API_SERVER}/${image.url}`}
          aspectRatio={aspectRatio}
          width={image.width}
          height={image.height}
          color={theme.palette.background.default}
        />
      </Grid>
    </Grid>
  )
}
