import React, { ReactElement } from 'react'

import { Box, Grid, Paper } from '@material-ui/core'

import { Global, Widget } from '../../api/api'
import { WrapIf } from '../../utility/WrapIf'
import { Media } from '../Media'
import { ContactForm } from './ContactForm'
import { PortfolioGrid } from './PortfolioGrid'
import { ProjectList } from './ProjectList'
import { RichText } from './RichText'
import { Social } from './Social'
import { TimelineWidget } from './TimelineWidget'

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
            wrapper={(children, props, ref) => (
              <Paper elevation={1} {...props} ref={ref}>
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
                  return <Media image={widget.image} align={widget.align} />

                case 'widget.timeline':
                  return <TimelineWidget {...widget} />

                case 'widget.contact-form':
                  return <ContactForm />

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
