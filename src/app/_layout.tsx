// app/_layout.tsx
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { AppProviders } from '../providers'
import QueryProvider from '../providers/tanstack-api/query-providers'
import { AuthProvider } from '../contexts/AuthContext'
import { useCartStore } from '../store'
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext'

const MukulahHeader: React.FC = () => {
  const router = useRouter()
  const cartCount = useCartStore((state) => state.cartItems.length)
  const { toggle } = useSidebar()

  const goToCart = () => {
    router.push('/(shop)/cart')
  }

  const goToProfile = () => {
    router.push('/(shop)/profile')
  }

  const goToFavorites = () => {
    router.push('/(shop)/favorites')
  }

  const goToShop = () => {
    router.push('/(shop)/shop')
  }

  return (
    <View style={styles.headerContainer}>
      {/* Left: SHEIN-style menu button */}
      <TouchableOpacity style={styles.leftIconButton} onPress={toggle}>
        <FontAwesome name='bars' size={20} color='#111' />
      </TouchableOpacity>

      {/* Center logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>MUKULAH</Text>
      </View>

      {/* Right icons: search, heart, cart */}
      <View style={styles.rightIcons}>
        {/* Replace search with profile icon */}
        <TouchableOpacity style={styles.iconButton} onPress={goToProfile}>
          <FontAwesome name='user' size={20} color='#111' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={goToFavorites}>
          <FontAwesome name='heart-o' size={20} color='#111' />
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
          <FontAwesome name='shopping-cart' size={20} color='#111' />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cartCount > 99 ? '99+' : cartCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function RootLayout() {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppProviders>
          <AuthProvider>
            <Stack>
              <Stack.Screen name='splash' options={{ headerShown: false }} />
              <Stack.Screen name='start' options={{ headerShown: false }} />
              <Stack.Screen
                name='language-country'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='privacy-policy'
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name='inspiration'
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name='(shop)'
                options={{
                    headerShown: true,
                    headerTitle: () => <MukulahHeader />,
                    headerStyle: { backgroundColor: '#ffffff' },
                    headerTitleAlign: 'center',
                    headerShadowVisible: true,
                    headerBackVisible: false,
                    headerLeft: () => null,
                }}
              />

              <Stack.Screen
                name='(media)'
                options={{ headerShown: false, presentation: 'modal' }}
              />

              <Stack.Screen
                name='auth'
                options={{ title: 'Authentication', headerShown: true }}
              />
              <Stack.Screen
                name='categories'
                options={{ title: 'Categories', headerShown: false }}
              />
              <Stack.Screen
                name='product'
                options={{ title: 'Product Details', headerShown: false }}
              />
              <Stack.Screen
                name='+not-found'
                options={{
                  title: 'Not Found',
                  headerShown: true,
                  headerStyle: { backgroundColor: '#2E8C83' },
                  headerTintColor: '#fff',
                  headerTitleStyle: { fontWeight: 'bold' },
                }}
              />
            </Stack>
          </AuthProvider>
        </AppProviders>
      </SidebarProvider>
    </QueryProvider>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  leftIconButton: {
    padding: 6,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#111111',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cartButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#bf0e40ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
})
