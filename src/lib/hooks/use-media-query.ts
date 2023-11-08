'use client'

import { useEffect, useState } from 'react'

type MediaQueryList = {
  matches: boolean
  addListener: (listener: () => void) => void
  removeListener: (listener: () => void) => void
}

export function useMediaQuery(queries: string[] | string): boolean[] {
  const [matches, setMatches] = useState<boolean[]>(
    Array(queries.length).fill(false)
  )

  useEffect(() => {
    const mediaQueryLists: MediaQueryList[] =
      typeof queries === 'string'
        ? [window.matchMedia(queries)]
        : queries.map(query => window.matchMedia(query))

    const handleMediaQueryChange = () => {
      const updatedMatches = mediaQueryLists.map(
        mediaQuery => mediaQuery.matches
      )
      setMatches(updatedMatches)
    }

    mediaQueryLists.forEach(mediaQuery => {
      mediaQuery.addListener(handleMediaQueryChange)
    })

    handleMediaQueryChange()

    return () => {
      mediaQueryLists.forEach(mediaQuery => {
        mediaQuery.removeListener(handleMediaQueryChange)
      })
    }
  }, [queries])

  return matches
}
