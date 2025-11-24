import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

const { width } = Dimensions.get('window')

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar: string
  verified: boolean
  category: string
  mutualConnections: number
  location?: string
  bio: string
  stats: {
    followers: string
    following: string
    posts: string
  }
  connectionType: 'follow' | 'friend_request'
  isOnline: boolean
  badges: string[]
  recentActivity: string
}

const mockUsers: SuggestedUser[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    username: '@alexcrypto',
    avatar: '👨‍💼',
    verified: true,
    category: 'Crypto Trader',
    mutualConnections: 12,
    location: 'Miami, FL',
    bio: 'Professional crypto trader sharing daily insights and market analysis',
    stats: {
      followers: '45.2K',
      following: '1.2K',
      posts: '2.1K',
    },
    connectionType: 'follow',
    isOnline: true,
    badges: ['Top Trader', 'Verified Pro'],
    recentActivity: 'Posted 2h ago',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: '@sarahtravel',
    avatar: '👩‍🦳',
    verified: false,
    category: 'Travel Creator',
    mutualConnections: 8,
    location: 'Tokyo, Japan',
    bio: 'Digital nomad documenting adventures across Asia',
    stats: {
      followers: '23.8K',
      following: '892',
      posts: '1.5K',
    },
    connectionType: 'friend_request',
    isOnline: false,
    badges: ['Explorer', 'Content Creator'],
    recentActivity: 'Active 1h ago',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    username: '@marcusjobs',
    avatar: '👨‍💻',
    verified: true,
    category: 'Tech Recruiter',
    mutualConnections: 25,
    location: 'San Francisco, CA',
    bio: 'Connecting top talent with amazing opportunities in tech',
    stats: {
      followers: '67.1K',
      following: '3.4K',
      posts: '892',
    },
    connectionType: 'follow',
    isOnline: true,
    badges: ['Top Recruiter', 'Industry Expert'],
    recentActivity: 'Live now',
  },
  {
    id: '4',
    name: 'Emma Thompson',
    username: '@emmashop',
    avatar: '👩‍🎨',
    verified: true,
    category: 'Fashion Influencer',
    mutualConnections: 15,
    location: 'London, UK',
    bio: 'Curating the latest fashion trends and sustainable brands',
    stats: {
      followers: '128K',
      following: '2.1K',
      posts: '3.2K',
    },
    connectionType: 'friend_request',
    isOnline: false,
    badges: ['Style Icon', 'Sustainable Fashion'],
    recentActivity: 'Posted 30m ago',
  },
  {
    id: '5',
    name: 'David Kim',
    username: '@davidmedia',
    avatar: '🎬',
    verified: true,
    category: 'Content Creator',
    mutualConnections: 7,
    location: 'Los Angeles, CA',
    bio: 'Creating viral content and helping brands tell their stories',
    stats: {
      followers: '89.3K',
      following: '1.8K',
      posts: '2.7K',
    },
    connectionType: 'follow',
    isOnline: true,
    badges: ['Viral Creator', 'Brand Partner'],
    recentActivity: 'Streaming live',
  },
]

const SocialDiscovery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [connections, setConnections] = useState<{ [key: string]: 'pending' | 'connected' | null }>({})
  const slideAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockUsers.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mockUsers.length) % mockUsers.length)
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        goToPrevious()
      } else if (gestureState.dx < -50) {
        goToNext()
      }
    },
  })

  const handleConnection = (userId: string, type: 'follow' | 'friend_request') => {
    setConnections(prev => ({
      ...prev,
      [userId]: type === 'follow' ? 'connected' : 'pending'
    }))

    // Animation feedback
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Trader': return Colors.status.warning
      case 'Travel Creator': return Colors.status.info
      case 'Tech Recruiter': return Colors.status.success
      case 'Fashion Influencer': return Colors.primary[500]
      case 'Content Creator': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const getActivityStatus = (activity: string, isOnline: boolean) => {
    if (activity === 'Live now' || activity === 'Streaming live') {
      return { color: Colors.status.error, text: activity }
    }
    if (isOnline) {
      return { color: Colors.status.success, text: 'Online' }
    }
    return { color: Colors.text.muted, text: activity }
  }

  const currentUser = mockUsers[currentIndex]
  const connectionStatus = connections[currentUser.id]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="users" size={20} color={Colors.primary[500]} />
          <Text style={styles.title}>Discover People</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.connectionsButton}
            onPress={() => router.push('/screens/connections')}
          >
            <FontAwesome name="group" size={14} color={Colors.primary[500]} />
            <Text style={styles.connectionsText}>Connections</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push('/screens/people-discovery')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <FontAwesome name="chevron-right" size={12} color={Colors.primary[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          onPress={() => router.push(`/user-profile?userId=${currentUser.id}`)}
          activeOpacity={0.95}
        >
          <Animated.View 
            {...panResponder.panHandlers}
            style={[
              styles.userCard,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
          {/* Online Status Indicator */}
          {currentUser.isOnline && (
            <View style={styles.onlineIndicator}>
              <View style={styles.onlineDot} />
            </View>
          )}

          {/* User Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{currentUser.avatar}</Text>
              {currentUser.verified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome name="check" size={10} color={Colors.background.primary} />
                </View>
              )}
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{currentUser.name}</Text>
              <Text style={styles.username}>{currentUser.username}</Text>
              <View style={styles.categoryRow}>
                <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(currentUser.category)}20` }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(currentUser.category) }]}>
                    {currentUser.category}
                  </Text>
                </View>
                {currentUser.location && (
                  <View style={styles.locationContainer}>
                    <FontAwesome name="map-marker" size={10} color={Colors.text.muted} />
                    <Text style={styles.locationText}>{currentUser.location}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <Text style={styles.bio}>{currentUser.bio}</Text>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
          </View>

          {/* Badges Section */}
          <View style={styles.badgesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {currentUser.badges.map((badge, index) => (
                <View key={index} style={styles.badge}>
                  <FontAwesome name="trophy" size={10} color={Colors.primary[500]} />
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Mutual Connections */}
          <View style={styles.mutualContainer}>
            <FontAwesome name="users" size={12} color={Colors.text.secondary} />
            <Text style={styles.mutualText}>
              {currentUser.mutualConnections} mutual connections
            </Text>
          </View>

          {/* Activity Status */}
          <View style={styles.activityContainer}>
            <View style={[styles.activityDot, { backgroundColor: getActivityStatus(currentUser.recentActivity, currentUser.isOnline).color }]} />
            <Text style={[styles.activityText, { color: getActivityStatus(currentUser.recentActivity, currentUser.isOnline).color }]}>
              {getActivityStatus(currentUser.recentActivity, currentUser.isOnline).text}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            {connectionStatus === 'connected' ? (
              <TouchableOpacity style={[styles.actionButton, styles.connectedButton]}>
                <FontAwesome name="check" size={14} color={Colors.status.success} />
                <Text style={[styles.actionButtonText, { color: Colors.status.success }]}>Following</Text>
              </TouchableOpacity>
            ) : connectionStatus === 'pending' ? (
              <TouchableOpacity style={[styles.actionButton, styles.pendingButton]}>
                <FontAwesome name="clock-o" size={14} color={Colors.status.warning} />
                <Text style={[styles.actionButtonText, { color: Colors.status.warning }]}>Pending</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleConnection(currentUser.id, currentUser.connectionType)}
              >
                <FontAwesome 
                  name={currentUser.connectionType === 'follow' ? "user-plus" : "user"} 
                  size={14} 
                  color={Colors.background.primary} 
                />
                <Text style={styles.primaryButtonText}>
                  {currentUser.connectionType === 'follow' ? 'Follow' : 'Add Friend'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <FontAwesome name="comment" size={14} color={Colors.primary[500]} />
              <Text style={[styles.actionButtonText, { color: Colors.primary[500] }]}>Message</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Navigation Indicators */}
      <View style={styles.indicators}>
        {mockUsers.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentIndex ? Colors.primary[500] : Colors.overlay.light10,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
            onPress={() => setCurrentIndex(index)}
          />
        ))}
      </View>
      
      {/* Swipe hint */}
      <View style={styles.swipeHint}>
        <FontAwesome name="hand-o-right" size={12} color={Colors.text.muted} />
        <Text style={styles.swipeHintText}>Swipe or tap to discover more people</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[1],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: Spacing[2],
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginRight: Spacing[1],
  },
  cardContainer: {
    position: 'relative',
  },
  userCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.lg,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[3],
    zIndex: 1,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.status.success,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[4],
  },
  avatarEmoji: {
    fontSize: 48,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: Colors.primary[500],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  username: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing[2],
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    marginRight: Spacing[2],
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: Colors.text.muted,
    marginLeft: Spacing[1],
  },
  bio: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: Spacing[4],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: Spacing[3],
    marginBottom: Spacing[4],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border.primary,
  },
  badgesContainer: {
    marginBottom: Spacing[3],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary[500]}15`,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 6,
    marginRight: Spacing[2],
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: Spacing[1],
  },
  mutualContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  mutualText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: Spacing[1],
  },
  activityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: Spacing[1],
  },
  activityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3],
    borderRadius: 12,
    ...Shadows.sm,
  },
  primaryButton: {
    backgroundColor: Colors.primary[500],
  },
  secondaryButton: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  connectedButton: {
    backgroundColor: `${Colors.status.success}20`,
    borderWidth: 1,
    borderColor: Colors.status.success,
  },
  pendingButton: {
    backgroundColor: `${Colors.status.warning}20`,
    borderWidth: 1,
    borderColor: Colors.status.warning,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: Spacing[2],
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background.primary,
    marginLeft: Spacing[2],
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing[1],
    ...Shadows.sm,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  swipeHintText: {
    fontSize: 11,
    color: Colors.text.muted,
    marginLeft: Spacing[1],
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  connectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 12,
    gap: Spacing[1],
  },
  connectionsText: {
    fontSize: 11,
    color: Colors.primary[500],
    fontWeight: '600',
  },
})

export default SocialDiscovery