// contexts/ServicesSidebarContext.tsx
import React, { createContext, useContext, useState } from 'react'

interface ServicesSidebarContextType {
  isOpen: boolean
  toggle: () => void
  open: () => void
  close: () => void
}

const ServicesSidebarContext = createContext<ServicesSidebarContextType | undefined>(undefined)

export const ServicesSidebarProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <ServicesSidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </ServicesSidebarContext.Provider>
  )
}

export const useServicesSidebar = () => {
  const context = useContext(ServicesSidebarContext)
  if (context === undefined) {
    throw new Error('useServicesSidebar must be used within a ServicesSidebarProvider')
  }
  return context
}