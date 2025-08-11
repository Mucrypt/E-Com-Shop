import React, { createContext, useContext, useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'

interface DarkModeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
  colors: {
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    primary: string
    card: string
    shadow: string
    statusBar: 'light' | 'dark'
  }
}

const lightColors = {
  background: '#f8f9fa',
  surface: '#fff',
  text: '#333',
  textSecondary: '#666',
  border: '#e0e0e0',
  primary: '#2E8C83',
  card: '#fff',
  shadow: '#000',
  statusBar: 'dark' as const,
}

const darkColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  border: '#333333',
  primary: '#2E8C83',
  card: '#2d2d2d',
  shadow: '#000',
  statusBar: 'light' as const,
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
)

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const colors = isDarkMode ? darkColors : lightColors

  return (
    <DarkModeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colors,
      }}
    >
      <StatusBar style={colors.statusBar} />
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}
