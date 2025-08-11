import React, { createContext, useContext, useEffect, useState } from 'react'

interface AppStateContextType {
  isOnline: boolean
  appVersion: string
  isFirstLaunch: boolean
  lastActiveTime: Date | null

  // App state methods
  setOffline: () => void
  setOnline: () => void
  updateLastActiveTime: () => void
  markAsNotFirstLaunch: () => void

  // Utility methods
  getAppUptime: () => string
  isAppActive: () => boolean
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined
)

export function useAppState() {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}

interface AppStateProviderProps {
  children: React.ReactNode
}

export default function AppStateProvider({ children }: AppStateProviderProps) {
  const [isOnline, setIsOnlineState] = useState(true)
  const [appVersion] = useState('1.0.0') // Could be fetched from app.json
  const [isFirstLaunch, setIsFirstLaunch] = useState(true)
  const [lastActiveTime, setLastActiveTime] = useState<Date | null>(new Date())
  const [appStartTime] = useState(new Date())

  useEffect(() => {
    // Check if this is the first launch
    const checkFirstLaunch = async () => {
      try {
        // In a real app, check AsyncStorage
        // const hasLaunchedBefore = await AsyncStorage.getItem('hasLaunchedBefore')
        // if (hasLaunchedBefore) {
        //   setIsFirstLaunch(false)
        // }

        // For now, simulate that it's not the first launch after 1 second
        setTimeout(() => {
          setIsFirstLaunch(false)
        }, 1000)
      } catch (error) {
        console.error('Error checking first launch:', error)
      }
    }

    checkFirstLaunch()

    // Set up network state monitoring
    // In a real app, use NetInfo
    // const unsubscribe = NetInfo.addEventListener(state => {
    //   setIsOnlineState(state.isConnected ?? false)
    // })

    // Set up app state monitoring
    // In a real app, use AppState
    // const handleAppStateChange = (nextAppState: AppStateStatus) => {
    //   if (nextAppState === 'active') {
    //     updateLastActiveTime()
    //   }
    // }
    // AppState.addEventListener('change', handleAppStateChange)

    return () => {
      // unsubscribe()
      // AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  const setOffline = () => {
    setIsOnlineState(false)
  }

  const setOnline = () => {
    setIsOnlineState(true)
  }

  const updateLastActiveTime = () => {
    setLastActiveTime(new Date())
  }

  const markAsNotFirstLaunch = async () => {
    try {
      // await AsyncStorage.setItem('hasLaunchedBefore', 'true')
      setIsFirstLaunch(false)
    } catch (error) {
      console.error('Error marking first launch:', error)
    }
  }

  const getAppUptime = () => {
    const now = new Date()
    const diffMs = now.getTime() - appStartTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)

    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m`
    } else {
      return `${diffMins}m`
    }
  }

  const isAppActive = () => {
    if (!lastActiveTime) return false

    const now = new Date()
    const diffMs = now.getTime() - lastActiveTime.getTime()
    const diffMins = diffMs / 60000

    // Consider app active if last activity was within 5 minutes
    return diffMins < 5
  }

  const value: AppStateContextType = {
    isOnline,
    appVersion,
    isFirstLaunch,
    lastActiveTime,
    setOffline,
    setOnline,
    updateLastActiveTime,
    markAsNotFirstLaunch,
    getAppUptime,
    isAppActive,
  }

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}
