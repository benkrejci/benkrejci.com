import Markdown from 'markdown-to-jsx'
import React, { ReactElement } from 'react'

import { Link, Typography, withStyles } from '@material-ui/core'

import { EXTERNAL_API_SERVER } from '../../api/api'

export function RichText({
  content,
  children,
  topHeadingLevel = 2,
  topHeadingVariantLevel = 4,
}: {
  content?: string
  children?: string
  topHeadingLevel?: number
  topHeadingVariantLevel?: number
}): ReactElement {
  const options = { ...DEFAULT_OPTIONS }

  // start the heading levels at top and work down to h5
  for (let inLevel = 1; inLevel <= 5; inLevel++) {
    const outLevel = inLevel - 1 + topHeadingLevel
    const outVariantLevel = inLevel - 1 + topHeadingVariantLevel
    options.overrides[`h${inLevel}`].props.component = `h${outLevel}`
    options.overrides[`h${inLevel}`].props.variant = `h${outVariantLevel}`
  }

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

const DEFAULT_OPTIONS = {
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
