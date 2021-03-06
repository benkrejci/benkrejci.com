import Markdown from 'markdown-to-jsx'
import React, { ReactElement } from 'react'

import { Link, Typography, withStyles } from '@material-ui/core'

import { EXTERNAL_API_SERVER } from '../../api/api'

export function RichText({
  content,
  children,
}: {
  content?: string
  children?: string
}): ReactElement {
  return (
    <Typography variant="body1" component="div">
      <Markdown options={options}>{children || content || ''}</Markdown>
    </Typography>
  )
}

const styles = (theme) => ({
  listItem: {
    marginTop: theme.spacing(1),
  },
})

const options = {
  overrides: {
    h1: { component: Typography, props: { component: 'h1', variant: 'h3', gutterBottom: true } },
    h2: { component: Typography, props: { component: 'h2', variant: 'h4', gutterBottom: true } },
    h3: { component: Typography, props: { component: 'h3', variant: 'h5' } },
    h4: {
      component: Typography,
      props: { component: 'h4', variant: 'subtitle1', paragraph: true },
    },
    h5: {
      component: Typography,
      props: { component: 'h5', variant: 'subtitle2', paragraph: true },
    },
    p: { component: Typography, props: { paragraph: true } },
    a: { component: Link, props: { target: '_blank' } },
    img: {
      component: ({ src, ...props }) => (
        <img
          src={`${EXTERNAL_API_SERVER}/${src}`}
          {...props}
          style={{ width: '100%', maxHeight: '360px', maxWidth: '360px' }}
        />
      ),
    },
    li: {
      // @ts-ignore MUI TS bug
      component: withStyles(styles)(({ classes, ...props }) => (
        <li className={classes.listItem}>
          <Typography component="span" {...props} />
        </li>
      )),
    },
  },
}
