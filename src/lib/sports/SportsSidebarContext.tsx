// app/sports-live/SportsSidebarContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

type SportsSidebarContextType = {
  isOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
}

const SportsSidebarContext =
  createContext<SportsSidebarContextType | undefined>(undefined)

export const SportsSidebarProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const openSidebar = useCallback(() => setIsOpen(true), [])
  const closeSidebar = useCallback(() => setIsOpen(false), [])
  const toggleSidebar = useCallback(
    () => setIsOpen((prev) => !prev),
    [],
  )

  return (
    <SportsSidebarContext.Provider
      value={{ isOpen, openSidebar, closeSidebar, toggleSidebar }}
    >
      {children}
    </SportsSidebarContext.Provider>
  )
}

export const useSportsSidebar = () => {
  const ctx = useContext(SportsSidebarContext)
  if (!ctx) {
    throw new Error(
      'useSportsSidebar must be used inside SportsSidebarProvider',
    )
  }
  return ctx
}
