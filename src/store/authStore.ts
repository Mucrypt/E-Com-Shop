import { create } from 'zustand'
import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { router } from 'expo-router'

export interface User {
  id: string
  name: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  memberSince?: Date
  isEmailVerified?: boolean
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  preferences?: {
    notifications: boolean
    darkMode: boolean
    language: string
  }
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authError: string | null

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  forgotPassword: (email: string) => Promise<boolean>
  resetPassword: (token: string, newPassword: string) => Promise<boolean>
  updateUser: (updates: Partial<User>) => void
  clearError: () => void

  // Navigation helpers
  navigateToAuth: (mode?: 'login' | 'register') => void
  navigateToForgotPassword: () => void
  navigateToResetPassword: (token?: string) => void

  // Utility functions
  getGreeting: () => string
  getUserInitials: () => string
  isEmailVerified: () => boolean
  getMembershipDuration: () => string
}

// Mock API functions (replace with real API calls)
const mockApiCall = (delay: number = 1500) =>
  new Promise((resolve) => setTimeout(resolve, delay))

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const useAuthStore = create<AuthState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      authError: null,

      login: async (email: string, password: string) => {
        if (!validateEmail(email)) {
          set({ authError: 'Please enter a valid email address' })
          return false
        }

        if (!validatePassword(password)) {
          set({ authError: 'Password must be at least 6 characters long' })
          return false
        }

        set({ isLoading: true, authError: null })

        try {
          await mockApiCall()

          // Mock successful login
          const mockUser: User = {
            id: '1',
            name: 'John Doe',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            memberSince: new Date('2023-01-15'),
            isEmailVerified: true,
            phone: '+1 (555) 123-4567',
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA',
            },
            preferences: {
              notifications: true,
              darkMode: false,
              language: 'en',
            },
          }

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            authError: null,
          })

          return true
        } catch (error) {
          set({
            authError: 'Login failed. Please check your credentials.',
            isLoading: false,
          })
          return false
        }
      },

      register: async (name: string, email: string, password: string) => {
        if (!name.trim()) {
          set({ authError: 'Please enter your full name' })
          return false
        }

        if (!validateEmail(email)) {
          set({ authError: 'Please enter a valid email address' })
          return false
        }

        if (!validatePassword(password)) {
          set({ authError: 'Password must be at least 6 characters long' })
          return false
        }

        set({ isLoading: true, authError: null })

        try {
          await mockApiCall()

          const [firstName, ...lastNameParts] = name.split(' ')
          const lastName = lastNameParts.join(' ')

          const mockUser: User = {
            id: '2',
            name: name,
            email: email,
            firstName: firstName,
            lastName: lastName || '',
            memberSince: new Date(),
            isEmailVerified: false,
            preferences: {
              notifications: true,
              darkMode: false,
              language: 'en',
            },
          }

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            authError: null,
          })

          return true
        } catch (error) {
          set({
            authError: 'Registration failed. Please try again.',
            isLoading: false,
          })
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          authError: null,
        })
        router.replace('/(shop)')
      },

      forgotPassword: async (email: string) => {
        if (!validateEmail(email)) {
          set({ authError: 'Please enter a valid email address' })
          return false
        }

        set({ isLoading: true, authError: null })

        try {
          await mockApiCall(1000)
          set({ isLoading: false })
          return true
        } catch (error) {
          set({
            authError: 'Failed to send reset email. Please try again.',
            isLoading: false,
          })
          return false
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        if (!token) {
          set({ authError: 'Invalid reset token' })
          return false
        }

        if (!validatePassword(newPassword)) {
          set({ authError: 'Password must be at least 6 characters long' })
          return false
        }

        set({ isLoading: true, authError: null })

        try {
          await mockApiCall(1000)
          set({ isLoading: false })
          return true
        } catch (error) {
          set({
            authError: 'Failed to reset password. Please try again.',
            isLoading: false,
          })
          return false
        }
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      clearError: () => {
        set({ authError: null })
      },

      // Navigation helpers
      navigateToAuth: (mode = 'login') => {
        router.push('/auth')
      },

      navigateToForgotPassword: () => {
        router.push('/forgot-password')
      },

      navigateToResetPassword: (token) => {
        const url = token ? `/reset-password?token=${token}` : '/reset-password'
        router.push(url)
      },

      // Utility functions
      getGreeting: () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 17) return 'Good Afternoon'
        return 'Good Evening'
      },

      getUserInitials: () => {
        const user = get().user
        if (!user) return 'G'

        const firstInitial = user.firstName?.charAt(0)?.toUpperCase() || ''
        const lastInitial = user.lastName?.charAt(0)?.toUpperCase() || ''

        return (
          firstInitial + lastInitial ||
          user.name?.charAt(0)?.toUpperCase() ||
          'U'
        )
      },

      isEmailVerified: () => {
        return get().user?.isEmailVerified || false
      },

      getMembershipDuration: () => {
        const user = get().user
        if (!user?.memberSince) return 'New member'

        const now = new Date()
        const memberSince = new Date(user.memberSince)
        const diffTime = Math.abs(now.getTime() - memberSince.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const diffMonths = Math.floor(diffDays / 30)
        const diffYears = Math.floor(diffMonths / 12)

        if (diffYears > 0) {
          return `${diffYears} year${diffYears > 1 ? 's' : ''}`
        } else if (diffMonths > 0) {
          return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`
        } else {
          return `${diffDays} day${diffDays > 1 ? 's' : ''}`
        }
      },
    })),
    {
      name: 'auth-store',
    }
  )
)

// Initialize auth state on app load
export const initializeAuth = async () => {
  try {
    // In a real app, check AsyncStorage or SecureStore for stored tokens
    // const token = await AsyncStorage.getItem('authToken')
    // if (token) {
    //   // Validate token and restore user session
    // }

    // For demo, we'll start with no authenticated user
    useAuthStore.setState({ isLoading: false })
  } catch (error) {
    console.error('Auth initialization failed:', error)
    useAuthStore.setState({ isLoading: false })
  }
}
