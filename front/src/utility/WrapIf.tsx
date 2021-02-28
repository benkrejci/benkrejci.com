import React, { cloneElement, ForwardedRef, forwardRef, HTMLProps, ReactElement } from 'react'

export const WrapIf = forwardRef(
  (
    {
      children,
      wrap,
      wrapper,
      ...props
    }: {
      if: any
      wrapper:
        | ((
            children: ReactElement,
            props: any,
            ref: ForwardedRef<any>,
          ) => ReactElement<any, any> | string)
        | ReactElement<any, any>
      children: ReactElement
    } & HTMLProps<HTMLElement>,
    ref,
  ): ReactElement => {
    if (props.if) {
      if (typeof wrapper === 'function') {
        return <>{wrapper(children, props, ref)}</>
      } else if (wrapper) {
        return cloneElement(wrapper, { children, ref, ...props })
      }
    } else {
      return cloneElement(children, { ref, ...props })
    }
  },
)
