import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native'
import React, { useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useAuth } from '../../providers'
import { MarketingScreen } from '../../components'

const Profile = () => {
  const { isDarkMode, toggleDarkMode, colors } = useDarkMode()
  const { user, isAuthenticated, signOut, getUserInitials } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [biometricLogin, setBiometricLogin] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Marketing data for non-authenticated users
  const marketingData = [
    {
      id: '1',
      title: 'Member Exclusive Deals',
      subtitle: 'Up to 50% Off',
      description:
        'Get access to exclusive member-only discounts and special offers',
      icon: 'star',
      color: '#FF6B6B',
      type: 'benefit' as const,
      value: '50% OFF',
    },
    {
      id: '2',
      title: 'Loyalty Rewards Program',
      subtitle: 'Earn Points on Every Purchase',
      description:
        'Collect points with every purchase and redeem for amazing rewards',
      icon: 'gift',
      color: '#4ECDC4',
      type: 'reward' as const,
      value: '1250 pts',
    },
    {
      id: '3',
      title: 'Priority Customer Support',
      subtitle: '24/7 Premium Support',
      description: 'Get priority access to our customer support team',
      icon: 'headphones',
      color: '#45B7D1',
      type: 'feature' as const,
    },
    {
      id: '4',
      title: 'Early Access to Sales',
      subtitle: 'Shop Before Everyone Else',
      description: 'Get early access to sales and new product launches',
      icon: 'clock-o',
      color: '#FFA726',
      type: 'exclusive' as const,
    },
    {
      id: '5',
      title: 'Personalized Recommendations',
      subtitle: 'Curated Just for You',
      description:
        'Receive personalized product recommendations based on your preferences',
      icon: 'heart',
      color: '#AB47BC',
      type: 'feature' as const,
    },
  ]

  // If user is not authenticated, show marketing screen
  if (!isAuthenticated) {
    return (
      <MarketingScreen
        title='Join Our Family'
        subtitle='Unlock exclusive benefits and start your shopping journey'
        data={marketingData}
        primaryButtonText='Login'
        secondaryButtonText='Create Account'
        onPrimaryPress={() => router.push('/auth')}
        onSecondaryPress={() => router.push('/auth?mode=register')}
        backgroundColor='#2E8C83'
        showRegisterOption={true}
      />
    )
  }

  const userStats = {
    orders: 12,
    wishlist: 8,
    reviews: 15,
    loyaltyPoints: 1250,
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          try {
            setIsLoggingOut(true)
            await signOut()
            router.replace('/auth')
          } catch (error) {
            console.error('Logout error:', error)
            Alert.alert('Error', 'Failed to sign out. Please try again.')
          } finally {
            setIsLoggingOut(false)
          }
        },
      },
    ])
  }

  const handleMenuPress = (item: string) => {
    switch (item) {
      case 'edit-profile':
        Alert.alert('Edit Profile', 'This would open the edit profile screen.')
        break
      case 'orders':
        router.push('/orders')
        break
      case 'addresses':
        Alert.alert(
          'Addresses',
          'This would open the addresses management screen.'
        )
        break
      case 'payment':
        Alert.alert(
          'Payment Methods',
          'This would open the payment methods screen.'
        )
        break
      case 'wishlist':
        Alert.alert('Wishlist', 'This would open your wishlist.')
        break
      case 'notifications':
        Alert.alert('Notifications', 'This would open notification settings.')
        break
      case 'privacy':
        Alert.alert('Privacy', 'This would open privacy settings.')
        break
      case 'help':
        Alert.alert('Help & Support', 'This would open help and support.')
        break
      case 'about':
        Alert.alert(
          'About',
          'E-Commerce App v1.0.0\nBuilt with React Native & Expo'
        )
        break
      case 'debug-tools':
        router.push('/debug')
        break
      case 'logout':
        handleLogout()
        break
      default:
        Alert.alert('Coming Soon', 'This feature is coming soon!')
    }
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/**notification dot */}

        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {user ? (
                <Text style={styles.avatarText}>{getUserInitials()}</Text>
              ) : (
                <FontAwesome name='user' size={40} color='#2E8C83' />
              )}
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => handleMenuPress('edit-profile')}
            >
              <FontAwesome name='camera' size={12} color='#fff' />
            </TouchableOpacity>
          </View>
          <Text style={[styles.username, { color: colors.text }]}>
            {user?.profile?.full_name ||
              user?.email?.split('@')[0] ||
              'Guest User'}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email || 'No email available'}
          </Text>
          <View style={styles.membershipBadge}>
            <FontAwesome name='star' size={12} color='#FFD700' />
            <Text style={styles.membershipText}>
              {isAuthenticated ? 'Member' : 'Guest'}
            </Text>
          </View>
        </View>

        {/* Stats Section */}
        <View
          style={[styles.statsContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => handleMenuPress('orders')}
          >
            <Text style={styles.statNumber}>{userStats.orders}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => handleMenuPress('wishlist')}
          >
            <Text style={styles.statNumber}>{userStats.wishlist}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Wishlist
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.reviews}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Reviews
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <Text style={styles.statNumber}>{userStats.loyaltyPoints}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Points
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => handleMenuPress('orders')}
            >
              <FontAwesome name='truck' size={24} color='#2E8C83' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Track Order
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => handleMenuPress('wishlist')}
            >
              <FontAwesome name='heart' size={24} color='#2E8C83' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Wishlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => handleMenuPress('help')}
            >
              <FontAwesome name='headphones' size={24} color='#2E8C83' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Support
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => router.push('/(shop)/shop')}
            >
              <FontAwesome name='shopping-bag' size={24} color='#2E8C83' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Shop
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => handleMenuPress('debug-tools')}
            >
              <FontAwesome name='wrench' size={24} color='#FF6B6B' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                Debug Tools
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickActionItem,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => handleMenuPress('about')}
            >
              <FontAwesome name='info-circle' size={24} color='#2E8C83' />
              <Text
                style={[
                  styles.quickActionText,
                  { color: colors.textSecondary },
                ]}
              >
                App Info
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('edit-profile')}
          >
            <FontAwesome name='edit' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Edit Profile
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('orders')}
          >
            <FontAwesome name='list-alt' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              My Orders
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('addresses')}
          >
            <FontAwesome name='map-marker' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Addresses
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('payment')}
          >
            <FontAwesome name='credit-card' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Payment Methods
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('debug-tools')}
          >
            <FontAwesome name='wrench' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Debug & Tools
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Settings
          </Text>

          <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <FontAwesome name='bell' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Push Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <FontAwesome name='moon-o' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
            <FontAwesome name='lock' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Biometric Login
            </Text>
            <Switch
              value={biometricLogin}
              onValueChange={setBiometricLogin}
              trackColor={{ false: '#e0e0e0', true: '#2E8C83' }}
              thumbColor={biometricLogin ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('privacy')}
          >
            <FontAwesome name='shield' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Privacy & Security
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('help')}
          >
            <FontAwesome name='question-circle' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Help & FAQ
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('contact')}
          >
            <FontAwesome name='envelope' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Contact Us
            </Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
            onPress={() => handleMenuPress('about')}
          >
            <FontAwesome name='info-circle' size={20} color='#2E8C83' />
            <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
            <FontAwesome name='chevron-right' size={16} color='#ccc' />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        {isAuthenticated && (
          <TouchableOpacity
            style={[
              styles.logoutButton,
              isLoggingOut && styles.logoutButtonDisabled,
            ]}
            onPress={() => handleMenuPress('logout')}
            disabled={isLoggingOut}
          >
            <FontAwesome
              name={isLoggingOut ? 'spinner' : 'sign-out'}
              size={20}
              color='#fff'
            />
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        )}

        <StatusBar style='auto' />

        {/* Link to Media Screen */}
        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 16,
            backgroundColor: '#2E8C83',
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => router.push('/(media)')}
        >
          <FontAwesome name='image' size={20} color='#fff' />
          <Text style={{ color: '#fff', fontWeight: 'bold', marginTop: 6 }}>
            Go to Media
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e8f5f3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E8C83',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E8C83',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  membershipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#856404',
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '31%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
})

export default Profile
