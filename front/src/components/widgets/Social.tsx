import React, { ReactElement } from 'react'

import { Grid, Link, makeStyles, SvgIconProps, Typography } from '@material-ui/core'

import { Social as SocialModel } from '../../api/api'
import { ExternalLink } from '../../utility/ExternalLink'
import { Icon } from '../Icon'

const socialTitlesByType: { [type: string]: string } = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  soundcloud: 'SoundCloud',
  instagram: 'Instagram',
  github: 'GitHub',
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
        if (!(social.type in socialTitlesByType)) {
          console?.warn && console.warn(`Unknown social type: ${social.type}`)
          return null
        }
        const title = socialTitlesByType[social.type]
        return (
          <Grid item key={social.type + i} xs={wide ? 12 : undefined}>
            <Link href={social.url} target="_blank" component={ExternalLink}>
              <Grid container justify="flex-start" alignItems="center" spacing={2} wrap="nowrap">
                <Grid item xs={wide ? false : 12}>
                  <Icon
                    name={social.type}
                    aria-label={wide ? '' : title}
                    className={styles.socialIcon}
                    {...iconProps}
                  />
                </Grid>
                {wide ? (
                  <Grid item className={styles.socialLabel}>
                    <Typography color="textPrimary">{title}</Typography>
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
