# Provider Integration Example

This example shows how to integrate all providers into your main app layout.

## App Integration

Update your main app layout to use the providers:

### 1. Update App.tsx or \_layout.tsx

```tsx
// App.tsx or src/app/_layout.tsx
import React from 'react'
import { AppProviders } from './src/providers'
import { ToastProvider } from 'react-native-toast-notifications'
import { DarkModeProvider } from './src/contexts/DarkModeContext'

export default function App() {
  return (
    <AppProviders>
      <DarkModeProvider>
        <ToastProvider>
          <RootLayout />
        </ToastProvider>
      </DarkModeProvider>
    </AppProviders>
  )
}

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  const { isFirstLaunch } = useAppState()

  if (isLoading) {
    return <SplashScreen />
  }

  if (isFirstLaunch) {
    return <OnboardingScreen />
  }

  return (
    <Stack>
      <Stack.Screen name='(shop)' options={{ headerShown: false }} />
      <Stack.Screen name='auth' options={{ headerShown: false }} />
    </Stack>
  )
}
```

### 2. Home Screen Integration

```tsx
// src/app/(shop)/home.tsx
import React, { useEffect } from 'react'
import { useAuth, useProducts, useSession } from '../../providers'
import { Header } from '../../components'

export default function Home() {
  const { user, getGreeting } = useAuth()
  const {
    products,
    getFeaturedProducts,
    getDiscountedProducts,
    fetchProducts,
  } = useProducts()
  const { extendSession, sessionData } = useSession()

  // Extend session on home screen activity
  useEffect(() => {
    extendSession()
  }, [])

  // Fetch initial products
  useEffect(() => {
    fetchProducts({ limit: 20, inStockOnly: true })
  }, [])

  const featuredProducts = getFeaturedProducts()
  const discountedProducts = getDiscountedProducts()

  return (
    <ScrollView>
      <Header />

      {/* Personalized greeting */}
      {user && (
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            {getGreeting()}, {user.profile?.full_name || 'there'}!
          </Text>
          <Text style={styles.sessionInfo}>
            Session: {sessionData.loginCount} logins
          </Text>
        </View>
      )}

      {/* Featured Products */}
      <ProductSection title='Featured Products' products={featuredProducts} />

      {/* Discounted Products */}
      <ProductSection title='Special Offers' products={discountedProducts} />
    </ScrollView>
  )
}
```

### 3. Authentication Screen Integration

```tsx
// src/app/auth.tsx
import React, { useState } from 'react'
import { useAuth, useSession } from '../providers'

export default function AuthScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn, signUp, isLoading, error } = useAuth()
  const { startSession } = useSession()

  const handleSignIn = async () => {
    const { error } = await signIn(email, password)
    if (!error) {
      await startSession()
      // Navigation handled automatically
    }
  }

  const handleSignUp = async () => {
    const { error } = await signUp(email, password)
    if (!error) {
      Alert.alert('Success', 'Please check your email for confirmation')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='Email'
        autoCapitalize='none'
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder='Password'
        secureTextEntry
      />

      <Button
        title={isLoading ? 'Loading...' : 'Sign In'}
        onPress={handleSignIn}
        disabled={isLoading}
      />

      <Button title='Sign Up' onPress={handleSignUp} disabled={isLoading} />

      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  )
}
```

### 4. Product Screen Integration

```tsx
// src/app/(shop)/shop.tsx
import React, { useState, useEffect } from 'react'
import { useProducts, useSession } from '../../providers'

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})

  const {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    searchProducts,
    clearError,
  } = useProducts()

  const { extendSession } = useSession()

  // Extend session on shop activity
  useEffect(() => {
    extendSession()
  }, [searchQuery, filters])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      await searchProducts(query)
    } else {
      await fetchProducts(filters)
    }
  }

  const handleFilterChange = async (newFilters: any) => {
    setFilters(newFilters)
    await fetchProducts(newFilters)
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error)
      clearError()
    }
  }, [error])

  return (
    <View style={styles.container}>
      <Header title='Shop' showProfile={false} />

      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder='Search products...'
      />

      <FilterBar
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? <LoadingSpinner /> : <ProductGrid products={products} />}
    </View>
  )
}
```

### 5. Profile Screen Integration

```tsx
// src/app/(shop)/profile.tsx
import React from 'react'
import { useAuth, useSession, useAppState } from '../../providers'

export default function ProfileScreen() {
  const { user, signOut, updateProfile, getGreeting, getUserInitials } =
    useAuth()

  const {
    sessionData,
    updatePreferences,
    getSessionDuration,
    timeUntilAutoLogout,
  } = useSession()

  const { appVersion, getAppUptime } = useAppState()

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', onPress: signOut },
    ])
  }

  const toggleAutoLogout = async () => {
    await updatePreferences({
      autoLogout: !sessionData.preferences.autoLogout,
    })
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userSection}>
        <Avatar initials={getUserInitials()} />
        <Text style={styles.userName}>
          {user?.profile?.full_name || user?.email}
        </Text>
        <Text style={styles.greeting}>{getGreeting()}</Text>
      </View>

      {/* Session Info */}
      <View style={styles.sessionSection}>
        <Text>Current Session: {getSessionDuration()}</Text>
        <Text>Total Logins: {sessionData.loginCount}</Text>
        {timeUntilAutoLogout && (
          <Text>Auto-logout in: {timeUntilAutoLogout} minutes</Text>
        )}
      </View>

      {/* Settings */}
      <View style={styles.settingsSection}>
        <SettingRow
          title='Auto Logout'
          value={sessionData.preferences.autoLogout}
          onToggle={toggleAutoLogout}
        />
      </View>

      {/* App Info */}
      <View style={styles.appSection}>
        <Text>App Version: {appVersion}</Text>
        <Text>App Uptime: {getAppUptime()}</Text>
      </View>

      <Button title='Sign Out' onPress={handleSignOut} />
    </ScrollView>
  )
}
```

## Global Error Handling

Create an error boundary that works with providers:

```tsx
// src/components/ErrorBoundary.tsx
import React from 'react'
import { useAuth, useAppState } from '../providers'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorScreen({ error }) {
  const { signOut } = useAuth()
  const { appVersion } = useAppState()

  const handleReset = () => {
    // Reset app state
    signOut()
    // Restart app
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error?.message}</Text>
      <Text style={styles.appVersion}>App Version: {appVersion}</Text>
      <Button title='Reset App' onPress={handleReset} />
    </View>
  )
}
```

## Usage Tips

1. **Always extend sessions on user activity**
2. **Handle loading states in UI**
3. **Clear errors after displaying them**
4. **Use proper TypeScript types**
5. **Test provider isolation**
6. **Monitor session data for analytics**

This integration pattern ensures your app has robust state management with authentication, session tracking, and product data management all working together seamlessly!
