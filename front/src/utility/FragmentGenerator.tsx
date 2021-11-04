import React from 'react'
import { Assignment as AssignmentIcon, Link as LinkIcon } from '@material-ui/icons'
import { Link, Tooltip } from '@material-ui/core'
import { staticAssertNever } from './utilityTypes'

const FragmentGeneratorContext =
  React.createContext<
    (instanceRef: React.RefObject<HTMLElement>, text: string) => string | undefined
  >(undefined)

const getFragment = (
  refByFragment: Map<string, React.RefObject<HTMLElement>>,
  fragmentByRef: Map<React.RefObject<HTMLElement>, string>,
  ref: React.RefObject<HTMLElement>,
  text: string,
): string => {
  const originalFragment = encodeURIComponent(String(text).replace(/(\s+)/g, '-'))
  if (fragmentByRef.has(ref)) {
    return fragmentByRef.get(ref)
  }
  let fragment = originalFragment
  let index = 0
  while (true) {
    let ref = refByFragment.get(fragment)
    // If this fragment exists but the element has been unmounted, ok to reassign
    if (ref && ref.current === undefined) {
      fragmentByRef.delete(ref)
      ref = undefined
    }
    if (ref === undefined) {
      refByFragment.set(fragment, ref)
      fragmentByRef.set(ref, fragment)
      break
    }
    // If fragment with this name exists, increment index and try again
    fragment = `${originalFragment}-${index++}`
  }
  return fragment
}

/**
 * Context provider required for `useFragment`
 */
export const FragmentGeneratorProvider = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  const [instanceRefByFragment] = React.useState<
    Map<string, React.RefObject<HTMLElement>>
  >(() => new Map())
  const [fragmentByInstanceRef] = React.useState<
    Map<React.RefObject<HTMLElement>, string>
  >(() => new Map())
  return (
    <FragmentGeneratorContext.Provider
      value={(instanceRef, text) =>
        getFragment(instanceRefByFragment, fragmentByInstanceRef, instanceRef, text)
      }
    >
      {children}
    </FragmentGeneratorContext.Provider>
  )
}

/**
 * Generates URI fragment from text string which is unique to page. If a collision
 * is found, `-N` is appended to fragment.
 *
 * Returns a [fragment, ref] where ref should be applied to the associated
 * HTML component.
 */
export const useFragment = (text: string): [string, React.RefObject<HTMLElement>] => {
  const getFragment = React.useContext(FragmentGeneratorContext)
  const ref = React.useRef<HTMLElement>()
  if (getFragment === undefined) {
    throw Error('useFragment must be used within a FragmentProvider')
  }

  // Clear ref on unmount
  React.useEffect(() => () => (ref.current = undefined), [])

  return [getFragment(ref, text), ref]
}

/**
 * Fragment link component.
 */
export const FragmentLink = ({
  text,
  type = 'link',
}: {
  text: string
  type?: 'clipboard' | 'hidden' | 'link'
}) => {
  const [fragment, fragmentRef] = useFragment(text)
  const [showTooltip, setShowTooltip] = React.useState(false)
  const [hideTooltipTimeout, setHideTooltipTimeout] = React.useState<NodeJS.Timeout>()
  const [uri, setUri] = React.useState(`#${fragment}`)

  React.useEffect(
    () => setUri(`${window.location.toString().replace(/#.*$/, '')}#${fragment}`),
    [],
  )

  switch (type) {
    case 'link':
    case 'hidden':
      return (
        <Link id={fragment} href={uri} ref={fragmentRef}>
          {type === 'hidden' ? '' : <LinkIcon />}
        </Link>
      )
    case 'clipboard':
      return (
        <Tooltip open={showTooltip} title="Copied!" arrow>
          <Link
            id={fragment}
            href={uri}
            onClick={async (e) => {
              e.preventDefault()
              await navigator.clipboard.writeText(uri)
              if (hideTooltipTimeout === undefined) {
                setShowTooltip(true)
              } else {
                clearTimeout(hideTooltipTimeout)
              }
              setHideTooltipTimeout(
                setTimeout(() => {
                  setHideTooltipTimeout(undefined)
                  setShowTooltip(false)
                }, 1000),
              )
            }}
            ref={fragmentRef}
          >
            <AssignmentIcon />
          </Link>
        </Tooltip>
      )

    default:
      staticAssertNever(type)
      return null
  }
}
