// app/(profile)/index.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
} from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useAuth } from '../../providers'
import { MarketingScreen } from '../../components'
import NavigationHeader from '../../components/common/NavigationHeader'
import { Colors, Spacing, Typography } from '../../constants'

const Profile = () => {
  const { user, isAuthenticated, signOut, getUserInitials } = useAuth()
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [biometricLogin, setBiometricLogin] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  // Marketing data for non-authenticated users (unchanged)
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

  // If user is not authenticated, show marketing screen with theme colors
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
        
        {/* Close/Back Button */}
        <View style={styles.marketingHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.push('/(main)/')}
            activeOpacity={0.7}
          >
            <FontAwesome name='times' size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.marketingContent}>
          <MarketingScreen
            title='Join Our Family'
            subtitle='Unlock exclusive benefits and start your shopping journey'
            data={marketingData}
            primaryButtonText='Login'
            secondaryButtonText='Create Account'
            onPrimaryPress={() => router.push('/auth')}
            onSecondaryPress={() => router.push('/auth?mode=register')}
            backgroundColor={Colors.background.primary}
            showRegisterOption={true}
          />
        </View>
      </View>
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

    // 🔥 new cases
    case 'followers':
      router.push('/(profile)/followers')
      break
    case 'following':
      router.push('/(profile)/following')
      break

    case 'logout':
      handleLogout()
      break
    default:
      Alert.alert('Coming Soon', 'This feature is coming soon!')
  }
}

  const handleViewPublicProfile = () => {
    // later we'll pass real userId/username here
    const id = user?.id || 'me'
    router.push(`/(profile)/${id}`)
  }

  return (
    <View style={styles.container}>
      <NavigationHeader 
        title="Profile"
        backgroundColor={Colors.background.primary}
        textColor={Colors.text.primary}
        statusBarStyle="light-content"
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
          {/* PROFILE HEADER */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                {user ? (
                  <Text style={styles.avatarText}>{getUserInitials()}</Text>
                ) : (
                  <FontAwesome name='user' size={40} color={Colors.primary[500]} />
                )}
              </View>
              <TouchableOpacity
                style={styles.editAvatarBtn}
                onPress={() => handleMenuPress('edit-profile')}
              >
                <FontAwesome name='camera' size={12} color={Colors.background.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.username}>
              {user?.profile?.full_name ||
                user?.email?.split('@')[0] ||
                'Guest User'}
            </Text>
            <Text style={styles.email}>
              {user?.email || 'No email available'}
            </Text>

            <View style={styles.membershipBadge}>
              <FontAwesome name='star' size={12} color={Colors.primary[500]} />
              <Text style={styles.membershipText}>
                {isAuthenticated ? 'Member' : 'Guest'}
              </Text>
            </View>

            {/* View public profile button */}
            <TouchableOpacity
              style={styles.publicProfileBtn}
              onPress={handleViewPublicProfile}
            >
              <FontAwesome name='user-circle' size={16} color={Colors.background.primary} />
              <Text style={styles.publicProfileText}>View public profile</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => handleMenuPress('orders')}
            >
              <Text style={styles.statNumber}>{userStats.orders}</Text>
              <Text style={styles.statLabel}>
                Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => handleMenuPress('wishlist')}
            >
              <Text style={styles.statNumber}>{userStats.wishlist}</Text>
              <Text style={styles.statLabel}>
                Wishlist
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.reviews}</Text>
              <Text style={styles.statLabel}>
                Reviews
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.loyaltyPoints}</Text>
              <Text style={styles.statLabel}>
                Points
              </Text>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleMenuPress('orders')}
              >
                <FontAwesome name='truck' size={24} color={Colors.primary[500]} />
                <Text style={styles.quickActionText}>
                  Track Order
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleMenuPress('wishlist')}
              >
                <FontAwesome name='heart' size={24} color={Colors.primary[500]} />
                <Text style={styles.quickActionText}>
                  Wishlist
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleMenuPress('help')}
              >
                <FontAwesome name='headphones' size={24} color={Colors.primary[500]} />
                <Text style={styles.quickActionText}>
                  Support
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => router.push('/(shop)/shop')}
              >
                <FontAwesome name='shopping-bag' size={24} color={Colors.primary[500]} />
                <Text style={styles.quickActionText}>
                  Shop
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleMenuPress('debug-tools')}
              >
                <FontAwesome name='wrench' size={24} color={Colors.status.error} />
                <Text style={styles.quickActionText}>
                  Debug Tools
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionItem}
                onPress={() => handleMenuPress('about')}
              >
                <FontAwesome name='info-circle' size={24} color={Colors.primary[500]} />
                <Text style={styles.quickActionText}>
                  App Info
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Account
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('edit-profile')}
            >
              <FontAwesome name='edit' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Edit Profile
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('orders')}
            >
              <FontAwesome name='list-alt' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                My Orders
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
    style={styles.menuItem}
    onPress={() => handleMenuPress('followers')}
  >
    <FontAwesome name='users' size={20} color={Colors.primary[500]} />
    <Text style={styles.menuText}>
      Followers
    </Text>
    <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => handleMenuPress('following')}
  >
    <FontAwesome name='user-plus' size={20} color={Colors.primary[500]} />
    <Text style={styles.menuText}>
      Following
    </Text>
    <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
  </TouchableOpacity>


            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('addresses')}
            >
              <FontAwesome name='map-marker' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Addresses
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('payment')}
            >
              <FontAwesome name='credit-card' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Payment Methods
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('debug-tools')}
            >
              <FontAwesome name='wrench' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Debug & Tools
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              App Settings
            </Text>

            <View style={styles.menuItem}>
              <FontAwesome name='bell' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Push Notifications
              </Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.text.disabled, true: Colors.primary[500] }}
                thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.menuItem}>
              <FontAwesome name='moon-o' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Dark Mode
              </Text>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: Colors.text.disabled, true: Colors.primary[500] }}
                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              />
            </View>

            <View style={styles.menuItem}>
              <FontAwesome name='lock' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Biometric Login
              </Text>
              <Switch
                value={biometricLogin}
                onValueChange={setBiometricLogin}
                trackColor={{ false: Colors.text.disabled, true: Colors.primary[500] }}
                thumbColor={biometricLogin ? '#fff' : '#f4f3f4'}
              />
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('privacy')}
            >
              <FontAwesome name='shield' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Privacy & Security
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Support
            </Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('help')}
            >
              <FontAwesome name='question-circle' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Help & FAQ
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('contact')}
            >
              <FontAwesome name='envelope' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                Contact Us
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress('about')}
            >
              <FontAwesome name='info-circle' size={20} color={Colors.primary[500]} />
              <Text style={styles.menuText}>
                About
              </Text>
              <FontAwesome name='chevron-right' size={16} color={Colors.text.muted} />
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

  

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing[5], // 20px
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: Spacing[8], // 32px
    paddingVertical: Spacing[5], // 20px
    backgroundColor: Colors.background.secondary,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing[4], // 16px
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  avatarText: {
    fontSize: Typography.sizes.xl,
    fontWeight: 'bold',
    color: Colors.primary[500],
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  username: {
    fontSize: Typography.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing[1], // 4px
  },
  email: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing[3], // 12px
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing[3], // 12px
    paddingVertical: Spacing[2], // 8px
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary[500],
    marginBottom: Spacing[3], // 12px
  },
  membershipText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: Spacing[1], // 4px
  },
  publicProfileBtn: {
    marginTop: Spacing[2], // 8px
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing[4], // 16px
    paddingVertical: Spacing[2], // 8px
    borderRadius: 20,
  },
  publicProfileText: {
    marginLeft: Spacing[2], // 8px
    fontSize: Typography.sizes.xs,
    fontWeight: '600',
    color: Colors.background.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4], // 16px
    marginBottom: Spacing[6], // 24px
    borderWidth: 1,
    borderColor: Colors.border.primary,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.primary[500],
    marginBottom: Spacing[1], // 4px
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing[6], // 24px
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: Spacing[3], // 12px
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '31%',
    backgroundColor: Colors.background.secondary,
    padding: Spacing[4], // 16px
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: Spacing[3], // 12px
  },
  quickActionText: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: Spacing[2], // 8px
    textAlign: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingVertical: Spacing[4], // 16px
    paddingHorizontal: Spacing[4], // 16px
    borderRadius: 12,
    marginBottom: Spacing[2], // 8px
  },
  menuText: {
    flex: 1,
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginLeft: Spacing[4], // 16px
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.status.error,
    paddingVertical: Spacing[4], // 16px
    borderRadius: 12,
    marginTop: Spacing[5], // 20px
    marginBottom: Spacing[10], // 40px
  },
  logoutButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.6,
  },
  logoutText: {
    fontSize: Typography.sizes.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: Spacing[3], // 12px
  },
  marketingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: Spacing[12], // Status bar height + padding
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[3],
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.overlay.dark30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketingContent: {
    flex: 1,
    paddingTop: Spacing[16], // Extra space to avoid status bar overlap
  },

})

export default Profile