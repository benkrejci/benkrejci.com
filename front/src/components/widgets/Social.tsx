import React, { ReactElement } from 'react'

import { Grid, Link, makeStyles, SvgIcon, SvgIconProps, Typography } from '@material-ui/core'
import { GitHub, Instagram, LinkedIn, Twitter } from '@material-ui/icons'

import { Social as SocialModel } from '../../api/api'
import SoundcloudIcon from '../../icons/Soundcloud'
import { ExternalLink } from '../../utility/ExternalLink'

interface SocialDefinition {
  Icon: typeof SvgIcon
  title: string
}

const socialDefinitionsByType: { [type: string]: SocialDefinition } = {
  linkedin: {
    Icon: LinkedIn,
    title: 'LinkedIn',
  },
  twitter: {
    Icon: Twitter,
    title: 'Twitter',
  },
  soundcloud: {
    Icon: SoundcloudIcon,
    title: 'SoundCloud',
  },
  instagram: {
    Icon: Instagram,
    title: 'Instagram',
  },
  github: {
    Icon: GitHub,
    title: 'GitHub',
  },
}

export function Social({
  socials,
  wide,
  size = 'large',
}: {
  socials: SocialModel[]
  wide?: boolean
  size?: 'inherit' | 'default' | 'small' | 'large'
}): ReactElement {
  const iconProps: SvgIconProps = { fontSize: size }
  const styles = useStyles()

  return (
    <Grid container spacing={1}>
      {socials.map((social, i) => {
        if (!(social.type in socialDefinitionsByType)) {
          console?.warn && console.warn(`Unknown social type: ${social.type}`)
          return null
        }
        const definition = socialDefinitionsByType[social.type]
        return (
          <Grid item key={social.type + i} xs={wide ? 12 : undefined}>
            <Link href={social.url} target="_blank" component={ExternalLink}>
              <Grid container justify="flex-start" alignItems="center" spacing={2} wrap="nowrap">
                <Grid item xs={wide ? false : 12}>
                  {React.createElement(definition.Icon, {
                    'aria-label': wide ? '' : definition.title,
                    className: styles.socialIcon,
                    ...iconProps,
                  })}
                </Grid>
                {wide ? (
                  <Grid item className={styles.socialLabel}>
                    <Typography color="textPrimary">{definition.title}</Typography>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
            </Link>
          </Grid>
        )
      })}
    </Grid>
  )
}

const useStyles = makeStyles((theme) => ({
  socialIcon: {
    display: 'block',
    color: theme.palette.primary.main,
  },
  socialLabel: {
    '& .MuiTypography-root': {
      fontWeight: 500,
      color: theme.palette.primary.main,
    },
  },
}))
