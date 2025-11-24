import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  RefreshControl,
  Image,
  Dimensions,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

const { width } = Dimensions.get('window')

interface Post {
  id: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
    verified: boolean
    isOnline: boolean
  }
  type: 'text' | 'image' | 'video' | 'achievement' | 'trade' | 'poll'
  content: string
  media?: string
  timestamp: string
  engagement: {
    likes: number
    comments: number
    shares: number
    isLiked: boolean
    isBookmarked: boolean
  }
  category: string
  location?: string
  hashtags: string[]
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: '1',
      name: 'Alex Rodriguez',
      username: '@alexcrypto',
      avatar: '👨‍💼',
      verified: true,
      isOnline: true,
    },
    type: 'trade',
    content: 'Just closed a massive BTC position! 📈 The technical analysis was spot on. Market is showing strong bullish signals for the next few weeks. What are your thoughts on the current momentum?',
    media: '📊',
    timestamp: '2h ago',
    engagement: {
      likes: 342,
      comments: 28,
      shares: 15,
      isLiked: false,
      isBookmarked: false,
    },
    category: 'Crypto Trading',
    hashtags: ['#BTC', '#CryptoTrading', '#TechnicalAnalysis'],
  },
  {
    id: '2',
    author: {
      id: '2',
      name: 'Sarah Chen',
      username: '@sarahtravel',
      avatar: '👩‍🦳',
      verified: false,
      isOnline: false,
    },
    type: 'image',
    content: 'Found this hidden gem in Kyoto! 🏯 The autumn colors are absolutely breathtaking. Travel tip: visit early morning to avoid crowds and get the best lighting for photos.',
    media: '🍂',
    timestamp: '4h ago',
    engagement: {
      likes: 856,
      comments: 67,
      shares: 23,
      isLiked: true,
      isBookmarked: true,
    },
    category: 'Travel',
    location: 'Kyoto, Japan',
    hashtags: ['#Kyoto', '#Japan', '#Travel', '#Autumn'],
  },
  {
    id: '3',
    author: {
      id: '3',
      name: 'Marcus Johnson',
      username: '@marcusjobs',
      avatar: '👨‍💻',
      verified: true,
      isOnline: true,
    },
    type: 'text',
    content: 'Remote work opportunities in tech are at an all-time high! 🚀 Just posted 50+ new positions on Mukulah Jobs. Frontend, Backend, DevOps, and AI roles available. DM me for direct referrals!',
    timestamp: '6h ago',
    engagement: {
      likes: 234,
      comments: 45,
      shares: 89,
      isLiked: false,
      isBookmarked: false,
    },
    category: 'Tech Jobs',
    hashtags: ['#RemoteWork', '#TechJobs', '#Hiring'],
  },
  {
    id: '4',
    author: {
      id: '4',
      name: 'Emma Thompson',
      username: '@emmashop',
      avatar: '👩‍🎨',
      verified: true,
      isOnline: false,
    },
    type: 'achievement',
    content: 'Thrilled to announce my sustainable fashion brand just hit 100K followers! 🌱 Thank you all for supporting eco-friendly fashion. Special discount code coming soon!',
    media: '🎉',
    timestamp: '8h ago',
    engagement: {
      likes: 1240,
      comments: 156,
      shares: 78,
      isLiked: true,
      isBookmarked: false,
    },
    category: 'Fashion',
    hashtags: ['#SustainableFashion', '#Milestone', '#EcoFriendly'],
  },
  {
    id: '5',
    author: {
      id: '5',
      name: 'David Kim',
      username: '@davidmedia',
      avatar: '🎬',
      verified: true,
      isOnline: true,
    },
    type: 'video',
    content: 'Behind the scenes of my latest viral video! 🎥 The editing process took 12 hours but totally worth it. Swipe to see the before and after shots.',
    media: '🎞️',
    timestamp: '12h ago',
    engagement: {
      likes: 567,
      comments: 89,
      shares: 34,
      isLiked: false,
      isBookmarked: true,
    },
    category: 'Content Creation',
    hashtags: ['#BehindTheScenes', '#ContentCreator', '#VideoEditing'],
  },
]

const SocialFeedScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'following' | 'trending'>('all')
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = useRef(new Animated.Value(1)).current

  const handleRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }, [])

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            engagement: {
              ...post.engagement,
              isLiked: !post.engagement.isLiked,
              likes: post.engagement.isLiked 
                ? post.engagement.likes - 1 
                : post.engagement.likes + 1,
            },
          }
        }
        return post
      })
    )
  }

  const handleBookmark = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            engagement: {
              ...post.engagement,
              isBookmarked: !post.engagement.isBookmarked,
            },
          }
        }
        return post
      })
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Trading': return Colors.status.warning
      case 'Travel': return Colors.status.info
      case 'Tech Jobs': return Colors.status.success
      case 'Fashion': return Colors.primary[500]
      case 'Content Creation': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'trade': return 'line-chart'
      case 'achievement': return 'trophy'
      case 'image': return 'camera'
      case 'video': return 'play'
      case 'poll': return 'bar-chart'
      default: return 'comment'
    }
  }

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y
        if (offsetY > 100) {
          Animated.timing(headerOpacity, {
            toValue: 0.95,
            duration: 200,
            useNativeDriver: true,
          }).start()
        } else {
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }).start()
        }
      },
    }
  )

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity 
          style={styles.authorSection}
          onPress={() => router.push(`/user-profile?userId=${post.author.id}`)}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{post.author.avatar}</Text>
            {post.author.verified && (
              <View style={styles.verifiedBadge}>
                <FontAwesome name="check" size={8} color={Colors.background.primary} />
              </View>
            )}
            {post.author.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            <View style={styles.postMeta}>
              <Text style={styles.username}>{post.author.username}</Text>
              <Text style={styles.timestamp}> • {post.timestamp}</Text>
              {post.location && (
                <>
                  <Text style={styles.timestamp}> • </Text>
                  <FontAwesome name="map-marker" size={10} color={Colors.text.muted} />
                  <Text style={styles.location}> {post.location}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton}>
          <FontAwesome name="ellipsis-h" size={16} color={Colors.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Category & Type Badge */}
      <View style={styles.categoryRow}>
        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(post.category)}20` }]}>
          <FontAwesome name={getPostIcon(post.type)} size={12} color={getCategoryColor(post.category)} />
          <Text style={[styles.categoryText, { color: getCategoryColor(post.category) }]}>
            {post.category}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <View style={styles.hashtagsContainer}>
          {post.hashtags.map((hashtag, index) => (
            <TouchableOpacity key={index} style={styles.hashtag}>
              <Text style={styles.hashtagText}>{hashtag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Media */}
      {post.media && (
        <View style={styles.mediaContainer}>
          <Text style={styles.mediaEmoji}>{post.media}</Text>
        </View>
      )}

      {/* Engagement Row */}
      <View style={styles.engagementBar}>
        <TouchableOpacity 
          style={styles.engagementButton}
          onPress={() => handleLike(post.id)}
        >
          <FontAwesome 
            name={post.engagement.isLiked ? "heart" : "heart-o"} 
            size={18} 
            color={post.engagement.isLiked ? Colors.status.error : Colors.text.secondary} 
          />
          <Text style={[
            styles.engagementText,
            post.engagement.isLiked && { color: Colors.status.error }
          ]}>
            {post.engagement.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.engagementButton}>
          <FontAwesome name="comment-o" size={18} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{post.engagement.comments}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.engagementButton}>
          <FontAwesome name="share" size={18} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{post.engagement.shares}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleBookmark(post.id)}
        >
          <FontAwesome 
            name={post.engagement.isBookmarked ? "bookmark" : "bookmark-o"} 
            size={18} 
            color={post.engagement.isBookmarked ? Colors.primary[500] : Colors.text.secondary} 
          />
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Social Feed</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/screens/connections')}
          >
            <FontAwesome name="users" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(social)/media')}
          >
            <FontAwesome name="play" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <FontAwesome name="search" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/screens/post-composer')}
          >
            <FontAwesome name="plus" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'following' && styles.activeFilterTab]}
          onPress={() => setFilter('following')}
        >
          <Text style={[styles.filterText, filter === 'following' && styles.activeFilterText]}>
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'trending' && styles.activeFilterTab]}
          onPress={() => setFilter('trending')}
        >
          <Text style={[styles.filterText, filter === 'trending' && styles.activeFilterText]}>
            Trending
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Access Cards */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity 
          style={styles.quickAccessCard}
          onPress={() => router.push('/screens/connections')}
        >
          <View style={styles.quickAccessCardLeft}>
            <FontAwesome name="users" size={18} color={Colors.primary[500]} />
            <View style={styles.quickAccessInfo}>
              <Text style={styles.quickAccessTitle}>People</Text>
              <Text style={styles.quickAccessSubtitle}>Manage connections</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={Colors.text.muted} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickAccessCard}
          onPress={() => router.push('/(social)/media')}
        >
          <View style={styles.quickAccessCardLeft}>
            <FontAwesome name="play" size={18} color={Colors.status.error} />
            <View style={styles.quickAccessInfo}>
              <Text style={styles.quickAccessTitle}>Videos</Text>
              <Text style={styles.quickAccessSubtitle}>Watch trending content</Text>
            </View>
          </View>
          <FontAwesome name="chevron-right" size={14} color={Colors.text.muted} />
        </TouchableOpacity>
      </View>

      {/* Posts Feed */}
      <Animated.FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
        contentContainerStyle={styles.feedContent}
      />

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/screens/post-composer')}
      >
        <FontAwesome name="plus" size={24} color={Colors.background.primary} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: 50,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background.primary,
    ...Shadows.sm,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Spacing[3],
    marginLeft: Spacing[2],
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[4],
    gap: Spacing[2],
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
  },
  activeFilterTab: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  activeFilterText: {
    color: Colors.background.primary,
  },
  feedContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: 100,
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
    alignItems: 'flex-start',
    marginBottom: Spacing[3],
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[3],
  },
  avatar: {
    fontSize: 32,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary[500],
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.status.success,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  username: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  timestamp: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  location: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  moreButton: {
    padding: Spacing[2],
  },
  categoryRow: {
    marginBottom: Spacing[3],
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  postContent: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 24,
    marginBottom: Spacing[3],
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing[3],
  },
  hashtag: {
    marginRight: Spacing[2],
    marginBottom: Spacing[1],
  },
  hashtagText: {
    fontSize: 14,
    color: Colors.primary[500],
    fontWeight: '600',
  },
  mediaContainer: {
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: Spacing[8],
    marginBottom: Spacing[4],
  },
  mediaEmoji: {
    fontSize: 64,
  },
  engagementBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  bookmarkButton: {
    padding: Spacing[2],
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: Spacing[4],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  quickAccessContainer: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[3],
    gap: Spacing[2],
  },
  quickAccessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing[3],
    ...Shadows.sm,
  },
  quickAccessCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  quickAccessInfo: {
    marginLeft: Spacing[3],
    flex: 1,
  },
  quickAccessTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  quickAccessSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
})

export default SocialFeedScreen