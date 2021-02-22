import { GetStaticPaths, GetStaticProps } from 'next'

import { Box, Breadcrumbs, Grid, Link, List, ListItem, Paper, Typography } from '@material-ui/core'
import { OpenInNew } from '@material-ui/icons'

import {
  fromSlug, getProject, getProjects, getProjectUri, Project as ProjectModel
} from '../../src/api/api'
import { Image } from '../../src/components/Image'
import { Page } from '../../src/components/Page'
import { RichText } from '../../src/components/widgets/RichText'
import { useGlobalStyles } from '../../src/style/global'
import { ExternalLink } from '../../src/utility/ExternalLink'
import { InternalLink } from '../../src/utility/InternalLink'
import { getPageProps, PageProps } from '../../src/utility/staticProps'
import { WrapIf } from '../../src/utility/WrapIf'

export default function Project({ project, ...props }: { project: ProjectModel } & PageProps) {
  const globalStyles = useGlobalStyles()

  return (
    <Page
      {...props}
      title={project.name}
      description={project.description}
      header={
        <Box my={4}>
          <Breadcrumbs>
            <Link href="/portfolio" component={InternalLink}>
              Portfolio
            </Link>
            <Typography color="textPrimary">{project.name}</Typography>
          </Breadcrumbs>
        </Box>
      }
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={5} md={4}>
          <Paper>
            <WrapIf
              if={project.url}
              wrap={(children) => (
                <Link href={project.url} target="_blank" component={ExternalLink}>
                  {children}
                </Link>
              )}
            >
              <Image image={project.cover} maxHeight="40vh" />
            </WrapIf>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={7} md={8}>
          <Box>
            <Typography variant="h2">
              <WrapIf
                if={project.url}
                wrap={(children) => (
                  <>
                    <Link
                      href={project.url}
                      target="_blank"
                      component={ExternalLink}
                      color="textPrimary"
                    >
                      {children}{' '}
                      <OpenInNew
                        titleAccess="opens in new window"
                        className={globalStyles.inlineIcon}
                      />
                    </Link>
                  </>
                )}
              >
                {project.name}
              </WrapIf>
            </Typography>
            <Typography variant="subtitle1">{project.company}</Typography>
            <RichText>{project.description}</RichText>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" component="h3" gutterBottom>
              Notable Contributions
            </Typography>
            <Paper>
              <List disablePadding>
                {project.project_items.map((projectItem, projectIndex) => (
                  <ListItem
                    key={projectItem.id}
                    divider={projectIndex < project.project_items.length - 1}
                  >
                    <Link
                      href={projectItem.url}
                      target="_blank"
                      color="inherit"
                      style={{ display: 'block', width: '100%' }}
                    >
                      <Box p={1}>
                        <Grid container spacing={3} alignItems="center">
                          <Grid item xs style={{ flexGrow: 1 }}>
                            <Typography variant="h5" component="h4">
                              {projectItem.name}
                            </Typography>
                            <RichText>{projectItem.description}</RichText>
                          </Grid>
                          <Grid item xs style={{ flexGrow: 0 }}>
                            <OpenInNew />
                          </Grid>
                        </Grid>
                      </Box>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Page>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const pageProps = await getPageProps(context)

  const projectName = fromSlug(context.params.name as string)
  const projectResponse = await getProject({ name: projectName })
  if (projectResponse.error) throw projectResponse.error

  return {
    props: {
      ...pageProps,
      project: projectResponse.data,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projectsResponse = await getProjects()
  if (projectsResponse.error) throw projectsResponse.error

  return {
    paths: projectsResponse.data?.map(getProjectUri),
    fallback: false,
  }
}
