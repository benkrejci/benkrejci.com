import React, { ReactElement } from 'react'

import { Box, Link, makeStyles, Paper, Typography } from '@material-ui/core'
import { OpenInNew } from '@material-ui/icons'

import { Project as ProjectModel } from '../../api/api'
import { useGlobalStyles } from '../../style/global'
import { ExternalLink } from '../../utility/ExternalLink'
import { WrapIf } from '../../utility/WrapIf'
import { Media } from '../Media'
import { RichText } from './RichText'

export const Project = ({ project }: { project: ProjectModel }): ReactElement => {
  const globalStyles = useGlobalStyles()
  const styles = useStyles()

  return (
    <Box mb={4}>
      <Paper elevation={1}>
        <Box p={4} className={styles.container}>
          {project.cover ? (
            <div className={styles.cover}>
              <Paper elevation={1}>
                <WrapIf
                  if={project.url && project.cover?.mime?.startsWith('image/')}
                  wrapper={
                    <Link href={project.url} target="_blank" component={ExternalLink}>
                      {' '}
                    </Link>
                  }
                >
                  <Media
                    file={project.cover}
                    maxHeight="60vh"
                    style={{ backgroundColor: 'transparent' }}
                  />
                </WrapIf>
              </Paper>
            </div>
          ) : (
            ''
          )}

          <div className={styles.title}>
            <Typography variant="h3" gutterBottom>
              <WrapIf
                if={project.url}
                wrapper={(children, props) => (
                  <Link href={project.url} target="_blank" component={ExternalLink} {...props}>
                    {children} <OpenInNew className={globalStyles.inlineIcon} />
                  </Link>
                )}
              >
                <>{project.name}</>
              </WrapIf>
            </Typography>
          </div>

          <div className={styles.description}>
            <RichText>{project.description}</RichText>
          </div>
        </Box>
      </Paper>
    </Box>
  )
}

const useStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('xs')]: {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    title: {
      order: 0,
      width: '100%',
    },
    cover: {
      order: 1,
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    description: {
      order: 2,
      width: '100%',
    },
  },

  [theme.breakpoints.up('sm')]: {
    title: {
      overflowWrap: 'anywhere',
    },
    cover: {
      float: 'right',
      width: '500px',
      maxWidth: '50%',
      marginLeft: theme.spacing(2),
    },
  },
}))
