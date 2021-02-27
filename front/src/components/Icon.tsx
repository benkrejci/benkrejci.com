import { ReactElement } from 'react'

import { SvgIcon, SvgIconProps } from '@material-ui/core'
import {
  Cake, Code, EmojiEmotions, Flare, FlashOn, GitHub, Hearing, Instagram, Language, LinkedIn,
  LocalShipping, MusicNote, School, Star, Twitter, Work
} from '@material-ui/icons'

import Soundcloud from '../icons/Soundcloud'

const iconComponentByName: { [type: string]: typeof SvgIcon } = {
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
}

export const Icon = ({ name, ...props }: { name: string } & SvgIconProps): ReactElement => {
  if (!(name in iconComponentByName)) {
    console?.warn && console.warn(`Unknown icon: ${name}`)
    return null
  }
  const IconComponent = iconComponentByName[name]
  return <IconComponent {...props} />
}
