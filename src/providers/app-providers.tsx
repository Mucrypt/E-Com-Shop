import React from 'react'
import { ToastProvider } from 'react-native-toast-notifications'
import AuthProvider from './auth-provider'
import AppStateProvider from './app-state-provider'
import ProductProvider from './product-provider'
import CartSyncProvider from './cart-sync-provider'
import SessionProvider from './session-provider'
import { DarkModeProvider } from '../contexts/DarkModeContext'

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * AppProviders component that wraps the entire app with all necessary providers
 * Order matters:
 * 1. ToastProvider - toast notifications (must be at the top level)
 * 2. DarkModeProvider - theme state (app-level)
 * 3. AppStateProvider - app-level state
 * 4. AuthProvider - authentication state
 * 5. SessionProvider - session management (depends on auth)
 * 6. ProductProvider - product data (can depend on auth for personalization)
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider
      placement='top'
      duration={4000}
      animationType='slide-in'
      animationDuration={250}
      successColor='#4CAF50'
      dangerColor='#F44336'
      warningColor='#FF9800'
      normalColor='#2196F3'
      swipeEnabled={true}
      offsetTop={50}
    >
      <DarkModeProvider>
        <AppStateProvider>
          <AuthProvider>
            <SessionProvider>
              <ProductProvider>
                <CartSyncProvider>{children}</CartSyncProvider>
              </ProductProvider>
            </SessionProvider>
          </AuthProvider>
        </AppStateProvider>
      </DarkModeProvider>
    </ToastProvider>
  )
}
