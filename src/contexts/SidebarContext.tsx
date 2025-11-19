// contexts/SidebarContext.tsx
import React, { createContext, useContext, useState } from 'react'

const SidebarContext = createContext({
  open: false,
  toggle: () => {},
  close: () => {},
})

export const SidebarProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen((prev) => !prev)
  const close = () => setOpen(false)

  return (
    <SidebarContext.Provider value={{ open, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
