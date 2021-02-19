import Image from 'material-ui-image'
import { useRouter } from 'next/router'
import React, { ReactElement } from 'react'

import { Box, Grid, Link } from '@material-ui/core'

import { EXTERNAL_API_SERVER, getProjectUri, Project } from '../../api/api'
import { InternalLink } from '../../utility/InternalLink'

export function PortfolioGrid({ projects, ...props }: { projects: Project[] }): ReactElement {
  const router = useRouter()

  return (
    <Box my={4}>
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item key={project.id} xs={6} sm={4} md={3}>
            <Link href={getProjectUri(project)} component={InternalLink}>
              <Image src={`${EXTERNAL_API_SERVER}${project.cover.url}`} />
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
