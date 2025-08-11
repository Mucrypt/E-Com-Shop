# Providers Documentation

This document explains the provider system used in the e-commerce app for managing application state and sessions.

## Overview

The app uses React Context providers to manage different aspects of the application state:

1. **AppStateProvider** - Application-level state and utilities
2. **AuthProvider** - Authentication and user management
3. **SessionProvider** - Session tracking and management
4. **ProductProvider** - Product data and operations

## Provider Architecture

```text
AppProviders
├── AppStateProvider (app state, network, first launch)
└── AuthProvider (authentication, user data)
    └── SessionProvider (session tracking, auto-logout)
        └── ProductProvider (products, categories, search)
```

## Usage

### Setup

Wrap your root component with `AppProviders`:

```tsx
import { AppProviders } from './src/providers'

export default function App() {
  return (
    <AppProviders>
      <YourAppContent />
    </AppProviders>
  )
}
```

### Using Providers in Components

```tsx
import { useAuth, useSession, useProducts, useAppState } from './src/providers'

function MyComponent() {
  const { user, signIn, signOut, isAdmin, isSuperAdmin } = useAuth()
  const { sessionData, extendSession } = useSession()
  const { products, fetchProducts } = useProducts()
  const { isOnline, appVersion } = useAppState()

  // Your component logic
}
```

## Role-Based Access Control

The app now includes a comprehensive role system with three user types:

- **USER** (default): Regular customers with basic permissions
- **ADMIN**: Can manage products, categories, and view all orders
- **SUPERADMIN**: Full access including user management and admin controls

### Using Roles in Components

```tsx
import { useAuth } from '../providers'
import { getRolePermissions, canAccessAdminFeatures } from '../lib/roles'

function Dashboard() {
  const { user, isAdmin, isSuperAdmin, getUserRole, hasRole } = useAuth()
  const userRole = getUserRole()
  const permissions = getRolePermissions(userRole)

  // Conditional rendering based on roles
  if (isSuperAdmin()) {
    return <SuperAdminDashboard />
  }

  if (isAdmin()) {
    return <AdminDashboard />
  }

  return <UserDashboard />
}

function ProductManagement() {
  const { isAdmin } = useAuth()

  // Protect admin-only features
  if (!isAdmin()) {
    return <AccessDenied />
  }

  return <ProductAdminPanel />
}
```

### Role-Based Navigation

```tsx
import { useAuth } from '../providers'
import { canAccessAdminFeatures } from '../lib/roles'

function AppNavigation() {
  const { isAuthenticated, getUserRole } = useAuth()
  const userRole = getUserRole()

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Shop' component={ShopScreen} />

        {isAuthenticated && (
          <Tab.Screen name='Profile' component={ProfileScreen} />
        )}

        {canAccessAdminFeatures(userRole) && (
          <Tab.Screen
            name='Admin'
            component={AdminScreen}
            options={{ title: 'Admin Panel' }}
          />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}
```

## Provider Details

### 1. AuthProvider

Manages user authentication using Supabase Auth.

#### AuthProvider Features

- User sign in/up/out
- Password reset
- Email confirmation
- Profile management
- Real-time auth state updates

#### AuthProvider Key Methods

```tsx
const {
  user, // Current user object with role information
  session, // Current session
  isAuthenticated, // Boolean auth status
  signIn, // (email, password) => Promise
  signUp, // (email, password, fullName?) => Promise
  signOut, // () => Promise
  resetPassword, // (email) => Promise
  updateProfile, // (updates) => Promise
  getUserInitials, // () => string
  isEmailConfirmed, // () => boolean

  // Role-based methods
  isAdmin, // () => boolean - checks if user is ADMIN or SUPERADMIN
  isSuperAdmin, // () => boolean - checks if user is SUPERADMIN
  hasRole, // (role) => boolean - checks specific role
  getUserRole, // () => 'USER' | 'ADMIN' | 'SUPERADMIN'
} = useAuth()
```

#### User Object Structure

```typescript
interface AuthUser extends User {
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
```

### 2. SessionProvider

Manages user sessions with advanced features like auto-logout and session tracking.

#### SessionProvider Features

- Session duration tracking
- Auto-logout after inactivity
- Login count tracking
- Session preferences
- Session extension

#### SessionProvider Key Methods

```tsx
const {
  sessionData, // Session information object
  isSessionActive, // Boolean session status
  timeUntilAutoLogout, // Minutes until auto-logout
  startSession, // () => Promise
  endSession, // () => Promise
  extendSession, // () => void
  updatePreferences, // (preferences) => Promise
  getSessionDuration, // () => string
  resetAutoLogoutTimer, // () => void
} = useSession()
```

#### Session Data Structure

```typescript
interface SessionData {
  lastLoginTime: Date | null
  sessionDuration: number
  loginCount: number
  preferences: {
    rememberMe: boolean
    biometricEnabled: boolean
    autoLogout: boolean
    autoLogoutMinutes: number
  }
}
```

### 3. ProductProvider

Manages product data and operations with Supabase integration.

#### ProductProvider Features

- Product fetching with filters
- Category management
- Product search
- Featured/discounted/new product lists
- Real-time product updates

#### ProductProvider Key Methods

```tsx
const {
  products, // Array of products
  categories, // Array of categories
  isLoading, // Loading state
  error, // Error message
  fetchProducts, // (filters?) => Promise
  fetchProduct, // (id) => Promise<Product>
  searchProducts, // (query) => Promise<Product[]>
  getFeaturedProducts, // () => Product[]
  getDiscountedProducts, // () => Product[]
  getNewProducts, // () => Product[]
} = useProducts()
```

#### Product Structure

```typescript
interface Product {
  id: string
  name: string
  description?: string
  price: number
  original_price?: number
  category?: string
  image_url?: string
  in_stock: boolean
  rating?: number
  review_count?: number
  created_at?: string
  updated_at?: string
}
```

### 4. AppStateProvider

Manages application-level state and utilities.

#### AppStateProvider Features

- Network connectivity status
- App version tracking
- First launch detection
- App activity monitoring
- Uptime calculation

#### AppStateProvider Key Methods

```tsx
const {
  isOnline, // Network connectivity status
  appVersion, // App version string
  isFirstLaunch, // Boolean first launch flag
  lastActiveTime, // Last activity timestamp
  setOffline, // () => void
  setOnline, // () => void
  updateLastActiveTime, // () => void
  getAppUptime, // () => string
  isAppActive, // () => boolean
} = useAppState()
```

## Integration Examples

### Authentication Flow with Roles

```tsx
function LoginScreen() {
  const { signIn, isLoading, error, getUserRole } = useAuth()
  const { startSession } = useSession()

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (!error) {
      await startSession()

      // Navigate based on user role
      const role = getUserRole()
      if (role === 'SUPERADMIN') {
        router.replace('/admin/super-dashboard')
      } else if (role === 'ADMIN') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/(shop)/home')
      }
    }
  }
}
```

### Role-Based UI Components

```tsx
import { useAuth } from '../providers'
import {
  getRolePermissions,
  getRoleDisplayName,
  getRoleColor,
} from '../lib/roles'

function UserProfile() {
  const { user, isAdmin, getUserRole } = useAuth()
  const role = getUserRole()
  const permissions = getRolePermissions(role)

  return (
    <View>
      <Text>Welcome, {user?.profile?.full_name}</Text>

      {/* Role Badge */}
      <View style={[styles.roleBadge, { backgroundColor: getRoleColor(role) }]}>
        <Text style={styles.roleText}>{getRoleDisplayName(role)}</Text>
      </View>

      {/* Admin Features */}
      {isAdmin() && (
        <View>
          <Text>Admin Features</Text>
          {permissions.canManageProducts && (
            <Button title='Manage Products' onPress={() => {}} />
          )}
          {permissions.canViewAnalytics && (
            <Button title='View Analytics' onPress={() => {}} />
          )}
        </View>
      )}
    </View>
  )
}
```

### Protected Admin Screens

```tsx
import { useAuth } from '../providers'
import { canAccessAdminFeatures } from '../lib/roles'

function AdminScreen() {
  const { isAuthenticated, getUserRole, isAdmin } = useAuth()

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.replace('/auth')
    return null
  }

  // Redirect if not admin
  if (!isAdmin()) {
    router.replace('/(shop)/home')
    return <Text>Access Denied</Text>
  }

  return <AdminDashboard />
}

function SuperAdminOnly() {
  const { isSuperAdmin } = useAuth()

  if (!isSuperAdmin()) {
    return <Text>Super Admin Access Required</Text>
  }

  return (
    <View>
      <Text>Super Admin Panel</Text>
      <Button title='Manage Admins' onPress={() => {}} />
      <Button title='System Settings' onPress={() => {}} />
    </View>
  )
}
```

### Product Display

```tsx
function ProductList() {
  const { products, fetchProducts, isLoading } = useProducts()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchProducts({
      inStockOnly: true,
      sortBy: 'rating',
    })
  }, [isAuthenticated])

  if (isLoading) return <LoadingSpinner />

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  )
}
```

### Session Management with Roles

```tsx
function UserProfile() {
  const { user, getUserRole, isAdmin } = useAuth()
  const { sessionData, updatePreferences } = useSession()
  const role = getUserRole()

  const toggleAutoLogout = async () => {
    await updatePreferences({
      autoLogout: !sessionData.preferences.autoLogout,
    })
  }

  return (
    <View>
      <Text>Welcome, {user?.profile?.full_name}</Text>
      <Text>Role: {role}</Text>
      <Text>Login Count: {sessionData.loginCount}</Text>

      {/* Admin gets extended session options */}
      {isAdmin() && <Text>Extended session available for admin users</Text>}

      <Switch
        value={sessionData.preferences.autoLogout}
        onValueChange={toggleAutoLogout}
      />
    </View>
  )
}
```

### Role-Based Product Management

```tsx
function ProductCard({ product }) {
  const { isAdmin, hasRole } = useAuth()

  return (
    <View style={styles.card}>
      <Text>{product.name}</Text>
      <Text>${product.price}</Text>

      {/* Admin controls */}
      {isAdmin() && (
        <View style={styles.adminControls}>
          <Button title='Edit' onPress={() => editProduct(product.id)} />
          {hasRole('SUPERADMIN') && (
            <Button
              title='Delete'
              onPress={() => deleteProduct(product.id)}
              color='red'
            />
          )}
        </View>
      )}
    </View>
  )
}
```

## Database Requirements

The providers expect these Supabase tables:

### users table (updated with roles)

```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address JSONB,
  preferences JSONB DEFAULT '{
    "notifications": true,
    "dark_mode": false,
    "language": "en",
    "currency": "USD"
  }'::jsonb,
  membership_tier TEXT DEFAULT 'basic' CHECK (membership_tier IN ('basic', 'premium', 'vip')),
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'SUPERADMIN')),
  loyalty_points INTEGER DEFAULT 0,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  auth.uid() IN (SELECT id FROM users WHERE role IN ('ADMIN', 'SUPERADMIN'))
);
```

### products table (updated with category_id)

```sql
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  category_id UUID REFERENCES categories(id),
  brand TEXT,
  sku TEXT UNIQUE,
  image_url TEXT,
  images JSONB,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### categories table (enhanced)

```sql
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### orders and order_items tables

```sql
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Error Handling

All providers include comprehensive error handling:

```tsx
function MyComponent() {
  const { error: authError } = useAuth()
  const { error: productError, clearError } = useProducts()

  useEffect(() => {
    if (authError) {
      Alert.alert('Authentication Error', authError.message)
    }
    if (productError) {
      Alert.alert('Product Error', productError)
      clearError() // Clear error after displaying
    }
  }, [authError, productError])
}
```

## Performance Considerations

1. **Memoization**: Providers use React's built-in optimizations
2. **Selective Updates**: Context values are structured to minimize re-renders
3. **Lazy Loading**: Products are fetched on-demand with filters
4. **Caching**: Session data is persisted in AsyncStorage

## Security Features

1. **Secure Storage**: Session data uses secure storage mechanisms
2. **Auto-logout**: Configurable inactivity timeout
3. **Token Management**: Automatic token refresh through Supabase
4. **Input Validation**: Email and password validation
5. **Error Sanitization**: Sensitive errors are not exposed to UI

## Testing

Each provider can be tested in isolation:

```tsx
import { render } from '@testing-library/react-native'
import { AuthProvider } from '../providers'

const TestWrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

// Your test code
```

## Best Practices

1. **Use providers at the appropriate level** - don't over-wrap components
2. **Handle loading states** - always check `isLoading` before rendering data
3. **Handle errors gracefully** - show user-friendly error messages
4. **Extend sessions on user activity** - call `extendSession()` on important actions
5. **Clear sensitive data** - call `signOut()` or `endSession()` when appropriate
6. **Validate user permissions** - check `isAuthenticated` before protected operations
7. **Use role-based access control** - check user roles before showing admin features
8. **Implement graceful role failures** - show access denied messages instead of errors
9. **Cache role permissions** - use `getRolePermissions()` to avoid repeated calculations
10. **Secure admin routes** - always verify roles on both client and server side

## Role Management Examples

### Making First User SuperAdmin

After your first user registers, run this in Supabase SQL Editor:

```sql
-- Promote first user to SUPERADMIN
SELECT promote_first_user_to_superadmin();
```

### Promoting Users to Admin

```tsx
// Only SuperAdmins can promote users
function UserManagement() {
  const { isSuperAdmin } = useAuth()

  const promoteToAdmin = async (userId: string) => {
    if (!isSuperAdmin()) return

    const { error } = await supabase
      .from('users')
      .update({ role: 'ADMIN' })
      .eq('id', userId)

    if (error) {
      console.error('Failed to promote user:', error)
    }
  }

  return (
    <View>
      {isSuperAdmin() ? (
        <UserList onPromote={promoteToAdmin} />
      ) : (
        <Text>Super Admin access required</Text>
      )}
    </View>
  )
}
```

### Role-Based Conditional Rendering

```tsx
function AppHeader() {
  const { user, isAdmin, getUserRole } = useAuth()
  const role = getUserRole()

  return (
    <Header>
      <Text>Welcome, {user?.profile?.full_name}</Text>

      {/* Show different UI based on role */}
      {role === 'USER' && <UserMenu />}
      {role === 'ADMIN' && <AdminMenu />}
      {role === 'SUPERADMIN' && <SuperAdminMenu />}

      {/* Or use permission-based rendering */}
      {isAdmin() && <AdminNotifications />}
    </Header>
  )
}
```
