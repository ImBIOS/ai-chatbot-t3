'use client'

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'

type GlobalStateContextType = {
  isSidebarOpen: boolean
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
)

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext)
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider')
  }
  return context
}

export const GlobalStateProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  // NOTE: Default should be `false` to prevent hydration mismatch
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  return (
    <GlobalStateContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </GlobalStateContext.Provider>
  )
}
