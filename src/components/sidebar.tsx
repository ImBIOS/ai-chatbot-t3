'use client'

import { useEffect } from 'react'

import { useGlobalState } from '~/lib/contexts/global-state-context'
import { useMediaQuery } from '~/lib/hooks/use-media-query'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '~/components/ui/sheet'

export interface SidebarProps {
  children?: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [isMobile] = useMediaQuery('(max-width: 1024px)')
  const { isSidebarOpen, setIsSidebarOpen } = useGlobalState()
  const handleTrigger = () => setIsSidebarOpen(val => !val)

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true)
    }
  }, [isMobile, setIsSidebarOpen])

  return isMobile ? (
    <Sheet open={isSidebarOpen} onOpenChange={handleTrigger}>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  ) : (
    <section
      data-state={isSidebarOpen ? 'open' : 'closed'}
      className="peer absolute inset-y-0 z-50 h-full -translate-x-full flex-col border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 dark:bg-zinc-950 lg:flex lg:w-[250px] xl:w-[300px]"
    >
      <div className="flex items-center justify-between space-y-2 border-b border-muted/40 px-4 py-2">
        <h2 className="text-sm font-semibold text-foreground">Chat History</h2>
      </div>
      {children}
    </section>
  )
}
