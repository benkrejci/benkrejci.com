import React, { ReactElement } from 'react'

import { Link, makeStyles, Paper, Typography } from '@material-ui/core'
import { OpenInNew } from '@material-ui/icons'

import { Project as ProjectModel } from '../../api/api'
import { useGlobalStyles } from '../../style/global'
import { ExternalLink } from '../../utility/ExternalLink'
import { WrapIf } from '../../utility/WrapIf'
import { Image } from '../Image'
import { RichText } from './RichText'

export const Project = ({ project }: { project: ProjectModel }): ReactElement => {
  const globalStyles = useGlobalStyles()
  const styles = useStyles()

  return (
    <div className={styles.container}>
      {project.cover ? (
        <div className={styles.cover}>
          <Paper elevation={1}>
            <WrapIf
              if={project.url}
              wrap={(children) => (
                <Link href={project.url} target="_blank" component={ExternalLink}>
                  {children}
                </Link>
              )}
            >
              <Image image={project.cover} maxHeight="36vh" />
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
            wrap={(children) => (
              <Link href={project.url} target="_blank" component={ExternalLink}>
                {children} <OpenInNew className={globalStyles.inlineIcon} />
              </Link>
            )}
          >
            {project.name}
          </WrapIf>
        </Typography>
      </div>

      <div className={styles.description}>
        <RichText>{project.description}</RichText>
      </div>
    </div>
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
    cover: {
      float: 'right',
      width: '33%',
      minWidth: '300px',
    },
  },
  // container: {
  //   display: 'grid',
  //   columnGap: theme.spacing(4),
  //   [theme.breakpoints.down('xs')]: {
  //     gridTemplateColumns: 'auto',
  //     gridTemplateRows: 'repeat(3, auto)',
  //     gridTemplateAreas: `"title" "cover" "description"`,
  //   },
  //   [theme.breakpoints.up('sm')]: {
  //     gridTemplateColumns: 'auto 50%',
  //     gridTemplateRows: 'auto auto',
  //     gridTemplateAreas: `
  //       "title cover"
  //       "description cover"
  //     `,
  //   },
  //   [theme.breakpoints.up('md')]: {
  //     gridTemplateColumns: 'auto 33%',
  //   },
  // },
  // title: {
  //   gridArea: 'title',
  // },
  // cover: {
  //   gridArea: 'cover',
  // },
  // description: {
  //   gridArea: 'description',
  // },
}))
