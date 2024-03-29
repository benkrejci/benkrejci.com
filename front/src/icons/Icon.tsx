import { ReactElement } from 'react'

import { SvgIconProps, Icon as MuiIcon, makeStyles } from '@material-ui/core'
import {
  Build, Cake, Code, EmojiEmotions, Favorite, Flare, FlashOn, GitHub, Hearing, Home, Instagram, Language,
  LinkedIn, LocalShipping, MusicNote, Pets, School, Star, Twitter, Work
} from '@material-ui/icons'

import Drum from './Drum'
import Soundcloud from './Soundcloud'
import Thangs from './Thangs'
import Hackaday from './Hackaday'

const iconComponentByName = {
  build: Build,
  linkedin: LinkedIn,
  twitter: Twitter,
  soundcloud: Soundcloud,
  instagram: Instagram,
  github: GitHub,
  birthday: Cake,
  truck: LocalShipping,
  music: MusicNote,
  web: Language,
  star: Star,
  flare: Flare,
  code: Code,
  smile: EmojiEmotions,
  electronic: FlashOn,
  ear: Hearing,
  school: School,
  work: Work,
  drum: Drum,
  pets: Pets,
  heart: Favorite,
  thangs: Thangs,
  home: Home,
  hackaday: Hackaday,
} as const

export type IconName = keyof typeof iconComponentByName

export const Icon = ({ name, ...props }: { name: IconName | string } & SvgIconProps): ReactElement => {
  if (!(name in iconComponentByName)) {
    console?.warn && console.warn(`Unknown icon: ${name}`)
    return null
  }
  const IconComponent = iconComponentByName[name]
  return <IconComponent {...props} />
}