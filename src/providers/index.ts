// Export all providers
export { default as AuthProvider, useAuth } from './auth-provider'
/**
 * Exports the default AppStateProvider component and the useAppState hook from the 'app-state-provider' module.
 * 
 * @remarks
 * - `AppStateProvider` is typically used to wrap the application and provide global state management.
 * - `useAppState` is a custom hook for accessing and manipulating the app state within components.
 *
 * @module
 */
export { default as AppStateProvider, useAppState } from './app-state-provider'
export { default as ProductProvider, useProducts } from './product-provider'
export { default as SessionProvider, useSession } from './session-provider'
export { default as AppProviders } from './app-providers'

// Export types
export type { AuthUser } from './auth-provider'
export type { Product, Category } from './product-provider'
