'use client'

import { useTransition } from 'react'
import { useTheme } from 'next-themes'

import { Button } from '~/components/ui/button'
import { IconComputer, IconMoon, IconSun } from '~/components/ui/icons'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      disabled={isPending}
      variant="ghost"
      size="icon"
      onClick={() => {
        startTransition(() => {
          switch (theme) {
            case 'dark':
              setTheme('light')
              break
            case 'light':
              setTheme('system')
              break
            default:
              setTheme('dark')
              break
          }
        })
      }}
    >
      {!theme ? null : theme === 'dark' ? (
        <IconMoon className="transition-all" />
      ) : theme === 'light' ? (
        <IconSun className="transition-all" />
      ) : (
        <IconComputer className="transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
