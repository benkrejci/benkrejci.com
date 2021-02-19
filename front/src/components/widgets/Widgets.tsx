import React, { ReactElement } from 'react'

import { Box, Grid, Paper } from '@material-ui/core'

import { Global, Widget } from '../../api/api'
import { WrapIf } from '../../utility/WrapIf'
import { Image } from '../Image'
import { PortfolioGrid } from './PortfolioGrid'
import { RichText } from './RichText'
import { Social } from './Social'

export function Widgets({
  global,
  children,
}: {
  global: Global
  children?: Widget[]
}): ReactElement {
  return (
    <Grid container spacing={2}>
      {children?.map((widget) => (
        <Grid item xs={12} key={widget.id}>
          <WrapIf
            if={'paper' in widget && widget.paper}
            wrap={(children) => (
              <Paper elevation={0}>
                <Box p={2}>{children}</Box>
              </Paper>
            )}
          >
            {(() => {
              switch (widget.__component) {
                case 'widget.project-grid':
                  return <PortfolioGrid {...widget} />

                case 'widget.rich-text':
                  return <RichText {...widget} />

                case 'widget.social':
                  return <Social socials={global.socials} wide />

                case 'widget.image':
                  return <Image image={widget.image} align={widget.align} />
              }
            })()}
          </WrapIf>
        </Grid>
      ))}
    </Grid>
  )
}
