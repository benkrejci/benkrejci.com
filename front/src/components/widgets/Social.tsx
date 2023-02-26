import React, { ReactElement } from 'react'

import { Grid, Link, makeStyles, SvgIconProps, Typography, useMediaQuery, useTheme } from '@material-ui/core'

import { ApiSocial as SocialModel } from '../../api/api'
import { Icon, IconName } from '../../icons/Icon'
import { ExternalLink } from '../../utility/ExternalLink'

const socialTitlesByType: { [type: string]: string } = {
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
  soundcloud: 'SoundCloud',
  instagram: 'Instagram',
  github: 'GitHub',
  thangs: 'Thangs'
}

export function Social({
  socials,
  wide,
  size = 'responsive',
}: {
  socials: SocialModel[]
  wide?: boolean
  size?: 'inherit' | 'default' | 'small' | 'large' | 'responsive'
}): ReactElement {
  const theme = useTheme()
  const mediaUpSmall = useMediaQuery(theme.breakpoints.up('sm'))
  const iconSize = size === 'responsive' ? (mediaUpSmall ? 'large' : 'small') : size
  const iconProps: SvgIconProps = { fontSize: iconSize }
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
              <Grid container justifyContent="flex-start" alignItems="center" spacing={2} wrap="nowrap">
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
