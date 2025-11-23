import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCartStore } from '../store'
import { useAuth } from '../providers'

interface HeaderProps {
  showProfile?: boolean
  showNotifications?: boolean
  showCart?: boolean
  onNotificationPress?: () => void
  title?: string
  backgroundColor?: string
}

const Header: React.FC<HeaderProps> = ({
  showProfile = true,
  showNotifications = true,
  showCart = true,
  onNotificationPress,
  title,
  backgroundColor = '#fff',
}) => {
  const cartCount = useCartStore((state) => state.getCartCount())
  const { user, isAuthenticated, getGreeting, getUserInitials } = useAuth()

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress()
    } else {
      console.log('Notifications pressed')
    }
  }

  const handleProfilePress = () => {
    if (isAuthenticated) {
      router.push('/(profile)') // Navigate to profile route group
    } else {
      router.push('/auth')
    }
  }

  const renderProfileSection = () => {
    if (!showProfile) return null

    if (isAuthenticated && user) {
      // Show user info when authenticated
      return (
        <TouchableOpacity
          style={styles.authenticatedProfileSection}
          onPress={handleProfilePress}
        >
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{getUserInitials()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user.profile?.full_name || user.email?.split('@')[0] || 'User'}
            </Text>
          </View>
        </TouchableOpacity>
      )
    } else {
      // Show profile icon when not authenticated
      return (
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={handleProfilePress}
        >
          <FontAwesome name='user-circle' size={20} color='#666' />
        </TouchableOpacity>
      )
    }
  }

  return (
    <View style={[styles.header, { backgroundColor }]}>
      {/* Left side */}
      <View style={styles.leftSection}>
        {renderProfileSection()}
        {title && <Text style={styles.headerTitle}>{title}</Text>}
      </View>

      {/* Right side actions */}
      <View style={styles.headerActions}>
        {showNotifications && (
          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={handleNotificationPress}
          >
            <FontAwesome name='bell' size={20} color='#666' />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        )}

        {showCart && (
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={() => router.push('/cart')}
          >
            <FontAwesome name='shopping-cart' size={20} color='#666' />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // Allow left section to take available space but not overflow
    marginRight: 10, // Add margin to separate from right actions
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0, // Prevent right actions from shrinking
  },
  profileBtn: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBtn: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
    borderWidth: 1,
    borderColor: '#fff',
  },
  cartBtn: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  authenticatedProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    flex: 1, // Take available space in left section
    maxWidth: '70%', // Limit maximum width to prevent overflow
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    flexShrink: 0, // Prevent avatar from shrinking
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    minWidth: 0, // Allow text to truncate properly
  },
  greeting: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
})

export default Header
