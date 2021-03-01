import React, { useCallback, useState } from 'react'
import { useIntersectionObserverRef } from 'rooks'

/**
 * Hook to track when ref element is visible in viewport or not
 * @returns [isVisible, triggerRef] - where isVisible is true if element is visible
 *          and triggerRef should be passed as "ref" to element you want to watch for
 *          visibility
 */
export const isInView = (props: IntersectionObserverInit): [boolean, (Element) => void] => {
  const [isVisible, setVisible] = useState(false)
  const callback = useCallback(([entry]) => setVisible(entry?.isIntersecting), [])
  const [triggerRef] = useIntersectionObserverRef(callback, props)

  return [isVisible, triggerRef]
}
