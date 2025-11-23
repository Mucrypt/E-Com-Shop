import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { StatusBar } from 'react-native'

interface NavigationHeaderConfig {
  statusBarStyle?: 'light-content' | 'dark-content'
  statusBarBackgroundColor?: string
}

export const useNavigationHeader = (config: NavigationHeaderConfig = {}) => {
  const {
    statusBarStyle = 'light-content',
    statusBarBackgroundColor = '#0B0B0B'
  } = config

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(statusBarStyle, true)
      if (statusBarBackgroundColor) {
        StatusBar.setBackgroundColor(statusBarBackgroundColor, true)
      }
      
      return () => {
        // Cleanup if needed
      }
    }, [statusBarStyle, statusBarBackgroundColor])
  )

  return {
    statusBarStyle,
    statusBarBackgroundColor
  }
}