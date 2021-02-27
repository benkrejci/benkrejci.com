import React, { ReactElement } from 'react'

import { Box, Grid, Paper } from '@material-ui/core'

import { Global, Widget } from '../../api/api'
import { WrapIf } from '../../utility/WrapIf'
import { Image } from '../Image'
import { PortfolioGrid } from './PortfolioGrid'
import { ProjectList } from './ProjectList'
import { RichText } from './RichText'
import { Social } from './Social'
import { Timeline } from './Timeline'

export function Widgets({
  global,
  children,
}: {
  global: Global
  children?: Widget[]
}): ReactElement {
  if (!children?.length) return null
  return (
    <Grid container spacing={4}>
      {children?.map((widget, index) => (
        <Grid item xs={12} key={`${widget.id}-${index}`}>
          <WrapIf
            if={'paper' in widget && widget.paper}
            wrap={(children) => (
              <Paper elevation={1}>
                <Box p={4}>{children}</Box>
              </Paper>
            )}
          >
            {(() => {
              switch (widget.__component) {
                case 'widget.project-grid':
                  return <PortfolioGrid {...widget} />

                case 'widget.project-list':
                  return <ProjectList {...widget} />

                case 'widget.rich-text':
                  return <RichText {...widget} />

                case 'widget.social':
                  return <Social socials={global.socials} wide />

                case 'widget.image':
                  return (
                    <Image
                      image={widget.image}
                      align={widget.align}
                      style={{ backgroundColor: 'transparent' }}
                    />
                  )

                case 'widget.timeline':
                  return <Timeline {...widget} />

                default:
                  console?.warn && console.warn(`Unknown widget component:`, widget)
              }
            })()}
          </WrapIf>
        </Grid>
      ))}
    </Grid>
  )
}
