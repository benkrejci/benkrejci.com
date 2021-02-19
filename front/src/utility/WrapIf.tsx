import React, { ReactElement } from 'react'

type Children = ReactElement | ReactElement[] | string | string[]

export const WrapIf = (props: {
  if: any
  wrap: (children: Children) => Children
  children: Children
}): ReactElement => <>{props.if ? props.wrap(props.children) : props.children}</>
