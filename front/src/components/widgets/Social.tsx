import React, { ReactElement } from 'react'

import { Grid, Link, makeStyles, SvgIcon, SvgIconProps, Typography } from '@material-ui/core'
import LinkedInIcon from '@material-ui/icons/LinkedIn'
import TwitterIcon from '@material-ui/icons/Twitter'

import { Social as SocialModel } from '../../api/api'
import SoundcloudIcon from '../../icons/Soundcloud'
import { ExternalLink } from '../../utility/ExternalLink'

interface SocialDefinition {
  Icon: typeof SvgIcon
  title: string
}

const socialDefinitionsByType: { [type: string]: SocialDefinition } = {
  linkedin: {
    Icon: LinkedInIcon,
    title: 'LinkedIn',
  },
  twitter: {
    Icon: TwitterIcon,
    title: 'Twitter',
  },
  soundcloud: {
    Icon: SoundcloudIcon,
    title: 'SoundCloud',
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
        const definition = socialDefinitionsByType[social.type]
        return (
          <Grid item key={social.type + i} xs={wide ? 12 : undefined}>
            <Link href={social.url} target="_blank" component={ExternalLink}>
              <Grid container justify="flex-start" alignItems="center" spacing={2}>
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
    color: theme.palette.text.secondary,
    //color: theme.palette.primary.dark,
  },
  socialLabel: {
    '& .MuiTypography-root': {
      fontWeight: 500,
      color: theme.palette.text.secondary,
      //color: theme.palette.primary.dark,
    },
  },
}))
