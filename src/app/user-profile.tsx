import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../constants'

const { width, height } = Dimensions.get('window')

interface UserPost {
  id: string
  type: 'text' | 'image' | 'video' | 'achievement' | 'trade'
  content: string
  timestamp: string
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  category: string
  media?: string
}

interface UserProfile {
  id: string
  name: string
  username: string
  avatar: string
  verified: boolean
  category: string
  bio: string
  location: string
  joinDate: string
  stats: {
    followers: string
    following: string
    posts: string
  }
  isOnline: boolean
  coverImage: string
  badges: string[]
  recentActivity: string
  mutualConnections: number
  posts: UserPost[]
  achievements: {
    title: string
    description: string
    date: string
    icon: string
  }[]
}

// Mock user data - in real app this would come from API based on user ID
const mockUserProfile: UserProfile = {
  id: '1',
  name: 'Alex Rodriguez',
  username: '@alexcrypto',
  avatar: '👨‍💼',
  verified: true,
  category: 'Crypto Trader',
  bio: 'Professional crypto trader sharing daily insights and market analysis. Building wealth through DeFi and sharing knowledge with the community.',
  location: 'Miami, FL',
  joinDate: 'Joined March 2023',
  stats: {
    followers: '45.2K',
    following: '1.2K',
    posts: '2.1K',
  },
  isOnline: true,
  coverImage: '🌅',
  badges: ['Top Trader', 'Verified Pro', 'Community Leader'],
  recentActivity: 'Posted 2h ago',
  mutualConnections: 12,
  posts: [
    {
      id: '1',
      type: 'trade',
      content: 'Just closed a massive BTC position! 📈 The technical analysis was spot on. Sharing my strategy in the comments below for anyone interested in learning.',
      timestamp: '2h ago',
      engagement: { likes: 342, comments: 28, shares: 15 },
      category: 'Crypto Trading',
      media: '📊',
    },
    {
      id: '2',
      type: 'text',
      content: 'Market update: Seeing strong bullish signals across DeFi tokens. DYOR but the momentum is building. What are your thoughts on the current market conditions?',
      timestamp: '5h ago',
      engagement: { likes: 189, comments: 45, shares: 8 },
      category: 'Market Analysis',
    },
    {
      id: '3',
      type: 'achievement',
      content: 'Excited to announce I\'ve reached 45K followers! Thank you all for the support. Here\'s to building wealth together in the crypto space! 🚀',
      timestamp: '1d ago',
      engagement: { likes: 892, comments: 156, shares: 67 },
      category: 'Milestone',
      media: '🎉',
    },
    {
      id: '4',
      type: 'image',
      content: 'Setup tour! My trading desk where the magic happens. Clean setup leads to clear thinking. What does your workspace look like?',
      timestamp: '2d ago',
      engagement: { likes: 234, comments: 67, shares: 23 },
      category: 'Lifestyle',
      media: '🖥️',
    },
    {
      id: '5',
      type: 'text',
      content: 'Pro tip: Always set stop losses, even in a bull market. Risk management is what separates successful traders from gamblers. Protect your capital!',
      timestamp: '3d ago',
      engagement: { likes: 456, comments: 89, shares: 34 },
      category: 'Trading Tips',
    },
  ],
  achievements: [
    {
      title: 'Top Trader 2024',
      description: 'Ranked in top 1% of traders on Mukulah Crypto Hub',
      date: 'Nov 2024',
      icon: '🏆',
    },
    {
      title: 'Million Dollar Club',
      description: 'Achieved $1M+ in total trading volume',
      date: 'Oct 2024',
      icon: '💎',
    },
    {
      title: 'Community Leader',
      description: 'Recognized for outstanding community contributions',
      date: 'Sep 2024',
      icon: '👑',
    },
  ],
}

const UserProfileScreen: React.FC = () => {
  const params = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState<'posts' | 'about' | 'achievements'>('posts')
  const [connectionStatus, setConnectionStatus] = useState<'follow' | 'following' | 'pending' | null>(null)
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = useRef(new Animated.Value(0)).current

  // In real app, you'd fetch user data based on params.userId
  const userProfile = mockUserProfile

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Trading': return Colors.status.warning
      case 'Market Analysis': return Colors.status.info
      case 'Trading Tips': return Colors.status.success
      case 'Milestone': return Colors.primary[500]
      case 'Lifestyle': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'trade': return 'line-chart'
      case 'achievement': return 'trophy'
      case 'image': return 'camera'
      case 'video': return 'play'
      default: return 'comment'
    }
  }

  const handleConnection = () => {
    if (connectionStatus === 'following') {
      setConnectionStatus('follow')
    } else if (connectionStatus === 'follow') {
      setConnectionStatus('following')
    } else {
      setConnectionStatus('pending')
    }
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y
        if (offsetY > 200) {
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start()
        } else {
          Animated.timing(headerOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
      },
    }
  )

  const renderPost = (post: UserPost) => (
    <View key={post.id} style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postAuthor}>
          <Text style={styles.postAvatar}>{userProfile.avatar}</Text>
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthorName}>{userProfile.name}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.postTimestamp}>{post.timestamp}</Text>
              <FontAwesome name="circle" size={3} color={Colors.text.muted} style={{ marginHorizontal: 6 }} />
              <FontAwesome name={getPostIcon(post.type)} size={12} color={getCategoryColor(post.category)} />
              <Text style={[styles.postCategory, { color: getCategoryColor(post.category) }]}>
                {post.category}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.postMenu}>
          <FontAwesome name="ellipsis-h" size={16} color={Colors.text.muted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.postContent}>{post.content}</Text>

      {post.media && (
        <View style={styles.postMedia}>
          <Text style={styles.postMediaEmoji}>{post.media}</Text>
        </View>
      )}

      <View style={styles.postEngagement}>
        <TouchableOpacity style={styles.engagementButton}>
          <FontAwesome name="heart-o" size={18} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{post.engagement.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementButton}>
          <FontAwesome name="comment-o" size={18} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{post.engagement.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.engagementButton}>
          <FontAwesome name="share" size={18} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{post.engagement.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderAbout = () => (
    <View style={styles.aboutContainer}>
      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Bio</Text>
        <Text style={styles.aboutText}>{userProfile.bio}</Text>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Details</Text>
        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{userProfile.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome name="calendar" size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{userProfile.joinDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome name="users" size={16} color={Colors.text.secondary} />
          <Text style={styles.detailText}>{userProfile.mutualConnections} mutual connections</Text>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>Badges</Text>
        <View style={styles.badgesGrid}>
          {userProfile.badges.map((badge, index) => (
            <View key={index} style={styles.badgeItem}>
              <FontAwesome name="trophy" size={14} color={Colors.primary[500]} />
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )

  const renderAchievements = () => (
    <View style={styles.achievementsContainer}>
      {userProfile.achievements.map((achievement, index) => (
        <View key={index} style={styles.achievementCard}>
          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <Text style={styles.achievementDescription}>{achievement.description}</Text>
            <Text style={styles.achievementDate}>{achievement.date}</Text>
          </View>
        </View>
      ))}
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      
      {/* Sticky Header */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.stickyHeaderTitle}>{userProfile.name}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Text style={styles.coverEmoji}>{userProfile.coverImage}</Text>
          <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
            <FontAwesome name="arrow-left" size={18} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileContainer}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{userProfile.avatar}</Text>
              {userProfile.verified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome name="check" size={12} color={Colors.background.primary} />
                </View>
              )}
              {userProfile.isOnline && <View style={styles.onlineIndicator} />}
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileUsername}>{userProfile.username}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{userProfile.category}</Text>
              <Text style={styles.locationText}>{userProfile.location}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.stats.posts}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.stats.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statValue}>{userProfile.stats.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryAction]}
              onPress={handleConnection}
            >
              <FontAwesome 
                name={connectionStatus === 'following' ? "check" : "user-plus"} 
                size={16} 
                color={Colors.background.primary} 
              />
              <Text style={styles.primaryActionText}>
                {connectionStatus === 'following' ? 'Following' : 
                 connectionStatus === 'pending' ? 'Pending' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryAction]}>
              <FontAwesome name="comment" size={16} color={Colors.primary[500]} />
              <Text style={styles.secondaryActionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>Achievements</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'posts' && userProfile.posts.map(renderPost)}
          {activeTab === 'about' && renderAbout()}
          {activeTab === 'achievements' && renderAchievements()}
        </View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: Colors.background.primary,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    zIndex: 1000,
    ...Shadows.md,
  },
  stickyHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  backButton: {
    padding: Spacing[2],
  },
  moreButton: {
    padding: Spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  coverEmoji: {
    fontSize: 80,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 50,
    left: Spacing[4],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.overlay.dark50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileContainer: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[6],
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: Spacing[4],
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    fontSize: 64,
    backgroundColor: Colors.background.secondary,
    borderRadius: 40,
    width: 80,
    height: 80,
    textAlign: 'center',
    lineHeight: 80,
    borderWidth: 4,
    borderColor: Colors.background.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: Colors.primary[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.status.success,
    borderWidth: 3,
    borderColor: Colors.background.primary,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  profileUsername: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: Spacing[2],
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  locationText: {
    fontSize: 14,
    color: Colors.text.muted,
    marginLeft: Spacing[2],
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    paddingVertical: Spacing[4],
    marginBottom: Spacing[4],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing[3],
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
  primaryAction: {
    backgroundColor: Colors.primary[500],
  },
  secondaryAction: {
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.background.primary,
    marginLeft: Spacing[2],
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary[500],
    marginLeft: Spacing[2],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing[4],
    borderRadius: 12,
    padding: Spacing[1],
    marginBottom: Spacing[4],
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing[2],
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.background.primary,
  },
  tabContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  postCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  postAvatar: {
    fontSize: 32,
    marginRight: Spacing[3],
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postTimestamp: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  postCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  postMenu: {
    padding: Spacing[2],
  },
  postContent: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: Spacing[3],
  },
  postMedia: {
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: Spacing[6],
    marginBottom: Spacing[3],
  },
  postMediaEmoji: {
    fontSize: 48,
  },
  postEngagement: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[2],
  },
  engagementText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: Spacing[2],
    fontWeight: '600',
  },
  aboutContainer: {
    gap: Spacing[5],
  },
  aboutSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[3],
  },
  aboutText: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  detailText: {
    fontSize: 15,
    color: Colors.text.secondary,
    marginLeft: Spacing[2],
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary[500]}20`,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: Spacing[1],
  },
  achievementsContainer: {
    gap: Spacing[3],
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: Spacing[4],
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  achievementDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: Spacing[1],
  },
  achievementDate: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
})

export default UserProfileScreen