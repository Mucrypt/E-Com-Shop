import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from './auth-provider'
import { useAppState } from './app-state-provider'

interface SessionData {
  lastLoginTime: Date | null
  sessionDuration: number // in minutes
  loginCount: number
  deviceInfo?: {
    platform: string
    version: string
    model?: string
  }
  preferences: {
    rememberMe: boolean
    biometricEnabled: boolean
    autoLogout: boolean
    autoLogoutMinutes: number
  }
}

interface SessionContextType {
  sessionData: SessionData
  isSessionActive: boolean
  timeUntilAutoLogout: number | null

  // Session methods
  startSession: () => Promise<void>
  endSession: () => Promise<void>
  extendSession: () => void
  updatePreferences: (
    preferences: Partial<SessionData['preferences']>
  ) => Promise<void>

  // Utility methods
  getSessionDuration: () => string
  shouldAutoLogout: () => boolean
  resetAutoLogoutTimer: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

interface SessionProviderProps {
  children: React.ReactNode
}

const STORAGE_KEYS = {
  SESSION_DATA: 'session_data',
  LOGIN_COUNT: 'login_count',
  LAST_LOGIN: 'last_login',
}

const DEFAULT_SESSION_DATA: SessionData = {
  lastLoginTime: null,
  sessionDuration: 0,
  loginCount: 0,
  preferences: {
    rememberMe: false,
    biometricEnabled: false,
    autoLogout: true,
    autoLogoutMinutes: 30,
  },
}

/**
 * Provides session management for the application, including authentication state,
 * session timing, auto-logout functionality, and user preferences.
 *
 * - Loads and saves session data from persistent storage.
 * - Tracks session start time, duration, and login count.
 * - Handles auto-logout based on user preferences and app activity.
 * - Exposes session context to child components.
 *
 * @param {SessionProviderProps} props - The props for the SessionProvider component.
 * @returns {JSX.Element} The session context provider wrapping child components.
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  const [sessionData, setSessionData] =
    useState<SessionData>(DEFAULT_SESSION_DATA)
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [timeUntilAutoLogout, setTimeUntilAutoLogout] = useState<number | null>(
    null
  )
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [autoLogoutTimer, setAutoLogoutTimer] = useState<NodeJS.Timeout | null>(
    null
  )

  const { isAuthenticated, signOut } = useAuth()
  const { updateLastActiveTime, isAppActive } = useAppState()

  useEffect(() => {
    // Load session data on mount
    loadSessionData()
  }, [])

  useEffect(() => {
    // Handle authentication state changes
    if (isAuthenticated) {
      startSession()
    } else {
      endSession()
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Set up auto-logout timer
    if (isSessionActive && sessionData.preferences.autoLogout) {
      setupAutoLogoutTimer()
    } else {
      clearAutoLogoutTimer()
    }

    return () => clearAutoLogoutTimer()
  }, [
    isSessionActive,
    sessionData.preferences.autoLogout,
    sessionData.preferences.autoLogoutMinutes,
  ])

  const loadSessionData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_DATA)
      if (stored) {
        const parsedData = JSON.parse(stored)
        setSessionData({
          ...DEFAULT_SESSION_DATA,
          ...parsedData,
          lastLoginTime: parsedData.lastLoginTime
            ? new Date(parsedData.lastLoginTime)
            : null,
        })
      }
    } catch (error) {
      console.error('Error loading session data:', error)
    }
  }

  const saveSessionData = async (data: SessionData) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSION_DATA,
        JSON.stringify(data)
      )
      setSessionData(data)
    } catch (error) {
      console.error('Error saving session data:', error)
    }
  }

  const startSession = async () => {
    if (!isAuthenticated) return

    const now = new Date()
    setSessionStartTime(now)
    setIsSessionActive(true)

    const newSessionData: SessionData = {
      ...sessionData,
      lastLoginTime: now,
      loginCount: sessionData.loginCount + 1,
    }

    await saveSessionData(newSessionData)
    updateLastActiveTime()
  }

  const endSession = async () => {
    if (sessionStartTime) {
      const sessionDuration = Math.floor(
        (Date.now() - sessionStartTime.getTime()) / 60000
      )

      const updatedData: SessionData = {
        ...sessionData,
        sessionDuration: sessionData.sessionDuration + sessionDuration,
      }

      await saveSessionData(updatedData)
    }

    setIsSessionActive(false)
    setSessionStartTime(null)
    clearAutoLogoutTimer()
  }

  const extendSession = () => {
    updateLastActiveTime()
    if (sessionData.preferences.autoLogout) {
      setupAutoLogoutTimer()
    }
  }

  const updatePreferences = async (
    preferences: Partial<SessionData['preferences']>
  ) => {
    const newSessionData: SessionData = {
      ...sessionData,
      preferences: {
        ...sessionData.preferences,
        ...preferences,
      },
    }

    await saveSessionData(newSessionData)
  }

  const setupAutoLogoutTimer = () => {
    clearAutoLogoutTimer()

    const timeoutMs = sessionData.preferences.autoLogoutMinutes * 60 * 1000

    const timer = setTimeout(() => {
      if (isAuthenticated && !isAppActive()) {
        signOut()
      }
    }, timeoutMs)

    setAutoLogoutTimer(timer)

    // Update countdown timer
    const countdownInterval = setInterval(() => {
      const remaining = Math.max(0, timeoutMs - (Date.now() - Date.now()))
      setTimeUntilAutoLogout(Math.floor(remaining / 60000))

      if (remaining <= 0) {
        clearInterval(countdownInterval)
        setTimeUntilAutoLogout(null)
      }
    }, 60000)
  }

  const clearAutoLogoutTimer = () => {
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer)
      setAutoLogoutTimer(null)
    }
    setTimeUntilAutoLogout(null)
  }

  const resetAutoLogoutTimer = () => {
    if (sessionData.preferences.autoLogout && isSessionActive) {
      setupAutoLogoutTimer()
    }
  }

  const getSessionDuration = () => {
    if (!sessionStartTime) return '0m'

    const duration = Math.floor(
      (Date.now() - sessionStartTime.getTime()) / 60000
    )
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const shouldAutoLogout = () => {
    return sessionData.preferences.autoLogout && !isAppActive()
  }

  const value: SessionContextType = {
    sessionData,
    isSessionActive,
    timeUntilAutoLogout,
    startSession,
    endSession,
    extendSession,
    updatePreferences,
    getSessionDuration,
    shouldAutoLogout,
    resetAutoLogoutTimer,
  }

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}
