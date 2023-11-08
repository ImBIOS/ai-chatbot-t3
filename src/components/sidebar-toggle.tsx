'use client'

import { useGlobalState } from '~/lib/contexts/global-state-context'

import { Button } from './ui/button'
import { IconSidebar } from './ui/icons'

const SidebarToggle = () => {
  const { setIsSidebarOpen } = useGlobalState()
  const handleToggle = () => setIsSidebarOpen(isSidebarOpen => !isSidebarOpen)
  return (
    <Button
      variant="ghost"
      className="-ml-2 h-9 w-9 p-0"
      onClick={handleToggle}
    >
      <IconSidebar className="h-6 w-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

export default SidebarToggle
