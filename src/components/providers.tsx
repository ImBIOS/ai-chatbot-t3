'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

import { GlobalStateProvider } from '~/lib/contexts/global-state-context'
import { TooltipProvider } from '~/components/ui/tooltip'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <GlobalStateProvider>{children}</GlobalStateProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
