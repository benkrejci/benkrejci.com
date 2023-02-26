import Image from 'material-ui-image'
import React, { ReactElement } from 'react'

import { Box, Grid, Link, Paper } from '@material-ui/core'

import { EXTERNAL_API_SERVER, getProjectUri, ApiProject } from '../../api/api'
import { InternalLink } from '../../utility/InternalLink'

export function PortfolioGrid({ projects, ...props }: { projects: ApiProject[] }): ReactElement {
  return (
    <Box my={4}>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={6} sm={4} md={3}>
            <Paper>
              <Link href={getProjectUri(project)} component={InternalLink}>
                <Image src={`${EXTERNAL_API_SERVER}${project.cover.url}`} />
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
