import React, { ReactElement } from 'react'

import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import { OpenInNew } from '@material-ui/icons'

import { Project as ProjectModel } from '../../api/api'
import { ExternalLink } from '../../utility/ExternalLink'
import { WrapIf } from '../../utility/WrapIf'
import { Media } from '../Media'
import { RichText } from './RichText'
import { FragmentLink } from '../../utility/FragmentGenerator'
import { Icon } from '../../icons/Icon'

export const Project = ({ project }: { project: ProjectModel }): ReactElement => {
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
              {project.name} <FragmentLink text={project.name} type="link" />
            </Typography>

            <List className={styles.list}>
              {project.links?.map((link) => (
                <ListItem
                  key={link.url}
                  button
                  href={link.url}
                  component={ExternalLink}
                  target="_blank"
                  className={styles.listItem}
                >
                  <ListItemIcon>
                    <Icon name={link.icon} />
                  </ListItemIcon>
                  <ListItemText primaryTypographyProps={{ variant: 'h5' }}>
                    {link.label} <OpenInNew fontSize="small" />
                  </ListItemText>
                </ListItem>
              ))}
            </List>
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
  list: {
    margin: `${theme.spacing(2)}px 0`,
  },

  listItem: {
    width: 'auto',
    '&, .MuiSvgIcon-root': {
      color: theme.palette.primary.main,
    }
  },

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
