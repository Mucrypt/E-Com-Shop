import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { router } from 'expo-router'
import { clearAllSessionData } from '../lib/session-utils'

export interface AuthUser extends User {
  // Extend Supabase User with custom fields from users table
  profile?: {
    full_name?: string
    avatar_url?: string
    phone?: string
    address?: any
    preferences?: any
    membership_tier?: string
    role?: 'USER' | 'ADMIN' | 'SUPERADMIN'
    loyalty_points?: number
    email_verified?: boolean
    phone_verified?: boolean
    created_at?: string
    updated_at?: string
  }
}

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean

  // Auth methods
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>
  signUp: (
    email: string,
    password: string,
    fullName?: string
  ) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>

  // Profile methods
  updateProfile: (
    updates: Partial<AuthUser['profile']>
  ) => Promise<{ error: any }>
  refreshUser: () => Promise<void>

  // Utility methods
  getGreeting: () => string
  getUserInitials: () => string
  isEmailConfirmed: () => boolean

  // Role checking methods
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  hasRole: (role: 'USER' | 'ADMIN' | 'SUPERADMIN') => boolean
  getUserRole: () => 'USER' | 'ADMIN' | 'SUPERADMIN'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!session && !!user

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          if (session?.user) {
            await fetchUserProfile(session.user)
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)

      setSession(session)

      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }

      // Handle navigation based on auth state with a small delay to avoid useInsertionEffect warnings
      if (event === 'SIGNED_IN') {
        // Navigate to protected area after sign in
        setTimeout(() => {
          router.replace('/(shop)')
        }, 100)
      } else if (event === 'SIGNED_OUT') {
        // Navigate to start screen when signed out or session expires
        setTimeout(() => {
          router.replace('/start')
        }, 100)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error)
      }

      // Map nulls to undefined for type compatibility
      const safeProfile = profile
        ? Object.fromEntries(
            Object.entries(profile).map(([key, value]) => [
              key,
              value === null ? undefined : value,
            ])
          )
        : {}

      const enhancedUser: AuthUser = {
        ...authUser,
        profile: safeProfile,
      }

      setUser(enhancedUser)
    } catch (error) {
      console.error('Profile fetch error:', error)
      setUser(authUser as AuthUser)
    }
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      // If sign up successful, upsert profile info
      if (!error && data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          username: fullName,
          avatar_url: 'https://randomuser.me/api/portraits/lego/1.jpg', // default avatar
          updated_at: new Date().toISOString(),
        })
      }

      // If user needs to confirm email
      if (!error && data.user && !data.user.email_confirmed_at) {
        console.log('Please check your email for confirmation link')
      }

      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      // Use the comprehensive session clearing utility
      await clearAllSessionData()

      // Reset local state
      setUser(null)
      setSession(null)

      console.log('✅ Successfully signed out and cleared all session data')
    } catch (error) {
      console.error('❌ Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
      }
    )
    return { error }
  }

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    })
    return { error }
  }

  const updateProfile = async (updates: Partial<AuthUser['profile']>) => {
    if (!user) {
      return { error: new Error('No authenticated user') }
    }

    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      })

      if (!error) {
        // Update local user state
        setUser((prev) =>
          prev
            ? {
                ...prev,
                profile: { ...prev.profile, ...updates },
              }
            : null
        )
      }

      return { error }
    } catch (error) {
      return { error }
    }
  }

  const refreshUser = async () => {
    if (user) {
      await fetchUserProfile(user)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const getUserInitials = () => {
    if (!user) return 'G'

    const fullName = user.profile?.full_name || user.email || ''
    const names = fullName.split(' ')

    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }

    return fullName.slice(0, 2).toUpperCase()
  }

  const isEmailConfirmed = () => {
    return !!user?.email_confirmed_at
  }

  // Role checking methods
  const getUserRole = (): 'USER' | 'ADMIN' | 'SUPERADMIN' => {
    return user?.profile?.role || 'USER'
  }

  const hasRole = (role: 'USER' | 'ADMIN' | 'SUPERADMIN'): boolean => {
    return getUserRole() === role
  }

  const isAdmin = (): boolean => {
    const userRole = getUserRole()
    return userRole === 'ADMIN' || userRole === 'SUPERADMIN'
  }

  const isSuperAdmin = (): boolean => {
    return getUserRole() === 'SUPERADMIN'
  }

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    updateProfile,
    refreshUser,
    getGreeting,
    getUserInitials,
    isEmailConfirmed,
    isAdmin,
    isSuperAdmin,
    hasRole,
    getUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
