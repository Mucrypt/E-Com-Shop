import React, { useState, useRef } from 'react'
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
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

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
  connectionStatus?: 'pending' | 'connected' | null
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
    stats: { followers: '45.2K', following: '1.2K', posts: '2.1K' },
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
    stats: { followers: '23.8K', following: '892', posts: '1.5K' },
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
    stats: { followers: '67.1K', following: '3.4K', posts: '892' },
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
    stats: { followers: '128K', following: '2.1K', posts: '3.2K' },
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
    stats: { followers: '89.3K', following: '1.8K', posts: '2.7K' },
    connectionType: 'follow',
    isOnline: true,
    badges: ['Viral Creator', 'Brand Partner'],
    recentActivity: 'Streaming live',
  },
  {
    id: '6',
    name: 'Lisa Wang',
    username: '@lisafitness',
    avatar: '💪',
    verified: false,
    category: 'Fitness Coach',
    mutualConnections: 4,
    location: 'Austin, TX',
    bio: 'Helping people transform their lives through fitness and nutrition',
    stats: { followers: '34.6K', following: '567', posts: '1.8K' },
    connectionType: 'follow',
    isOnline: true,
    badges: ['Certified Trainer', 'Nutrition Expert'],
    recentActivity: 'Posted 1h ago',
  },
  {
    id: '7',
    name: 'Ryan Cooper',
    username: '@ryanproperty',
    avatar: '🏠',
    verified: true,
    category: 'Real Estate',
    mutualConnections: 18,
    location: 'Dubai, UAE',
    bio: 'Luxury real estate specialist in the Middle East market',
    stats: { followers: '56.7K', following: '2.3K', posts: '1.2K' },
    connectionType: 'friend_request',
    isOnline: false,
    badges: ['Top Agent', 'Luxury Specialist'],
    recentActivity: 'Active 3h ago',
  },
  {
    id: '8',
    name: 'Priya Sharma',
    username: '@priyatech',
    avatar: '👩‍🔬',
    verified: true,
    category: 'Tech Innovator',
    mutualConnections: 22,
    location: 'Bangalore, India',
    bio: 'AI researcher and startup founder building the future of technology',
    stats: { followers: '78.9K', following: '1.5K', posts: '967' },
    connectionType: 'follow',
    isOnline: true,
    badges: ['AI Expert', 'Startup Founder'],
    recentActivity: 'Live now',
  },
]

const PeopleDiscoveryScreen: React.FC = () => {
  const [users, setUsers] = useState<SuggestedUser[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'follow' | 'friend_request'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [connections, setConnections] = useState<{ [key: string]: 'pending' | 'connected' | null }>({})
  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  const handleConnection = (userId: string, type: 'follow' | 'friend_request') => {
    setConnections(prev => ({
      ...prev,
      [userId]: type === 'follow' ? 'connected' : 'pending'
    }))
  }

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Trader': return Colors.status.warning
      case 'Travel Creator': return Colors.status.info
      case 'Tech Recruiter': return Colors.status.success
      case 'Fashion Influencer': return Colors.primary[500]
      case 'Content Creator': return Colors.status.error
      case 'Fitness Coach': return '#FF6B6B'
      case 'Real Estate': return '#4ECDC4'
      case 'Tech Innovator': return '#A8E6CF'
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' || user.connectionType === selectedFilter
    
    return matchesSearch && matchesFilter
  })

  const renderUserCard = ({ item: user }: { item: SuggestedUser }) => {
    const connectionStatus = connections[user.id]
    const activityStatus = getActivityStatus(user.recentActivity, user.isOnline)

    return (
      <TouchableOpacity
        style={styles.userCard}
        onPress={() => router.push(`/user-profile?userId=${user.id}`)}
        activeOpacity={0.95}
      >
        {/* Online Status Indicator */}
        {user.isOnline && (
          <View style={styles.onlineIndicator}>
            <View style={styles.onlineDot} />
          </View>
        )}

        {/* User Info Section */}
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>{user.avatar}</Text>
            {user.verified && (
              <View style={styles.verifiedBadge}>
                <FontAwesome name="check" size={8} color={Colors.background.primary} />
              </View>
            )}
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
            
            <View style={styles.categoryRow}>
              <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(user.category)}20` }]}>
                <Text style={[styles.categoryText, { color: getCategoryColor(user.category) }]}>
                  {user.category}
                </Text>
              </View>
              {user.location && (
                <View style={styles.locationContainer}>
                  <FontAwesome name="map-marker" size={10} color={Colors.text.muted} />
                  <Text style={styles.locationText}>{user.location}</Text>
                </View>
              )}
            </View>

            <Text style={styles.bio} numberOfLines={2}>{user.bio}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <Text style={styles.stat}>{user.stats.followers} followers</Text>
              <Text style={styles.statDot}>•</Text>
              <Text style={styles.stat}>{user.mutualConnections} mutual</Text>
            </View>

            {/* Activity Status */}
            <View style={styles.activityRow}>
              <View style={[styles.activityDot, { backgroundColor: activityStatus.color }]} />
              <Text style={[styles.activityText, { color: activityStatus.color }]}>
                {activityStatus.text}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {connectionStatus === 'connected' ? (
            <TouchableOpacity style={[styles.actionButton, styles.connectedButton]}>
              <FontAwesome name="check" size={12} color={Colors.status.success} />
              <Text style={[styles.actionButtonText, { color: Colors.status.success }]}>Following</Text>
            </TouchableOpacity>
          ) : connectionStatus === 'pending' ? (
            <TouchableOpacity style={[styles.actionButton, styles.pendingButton]}>
              <FontAwesome name="clock-o" size={12} color={Colors.status.warning} />
              <Text style={[styles.actionButtonText, { color: Colors.status.warning }]}>Pending</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => handleConnection(user.id, user.connectionType)}
            >
              <FontAwesome
                name={user.connectionType === 'follow' ? "user-plus" : "user"}
                size={12}
                color={Colors.background.primary}
              />
              <Text style={styles.primaryButtonText}>
                {user.connectionType === 'follow' ? 'Follow' : 'Add Friend'}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <FontAwesome name="comment" size={12} color={Colors.primary[500]} />
            <Text style={[styles.actionButtonText, { color: Colors.primary[500] }]}>Message</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover People</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.connectionsButton}
            onPress={() => router.push('/screens/connections')}
          >
            <FontAwesome name="group" size={16} color={Colors.primary[500]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <FontAwesome name="search" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color={Colors.text.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search people..."
          placeholderTextColor={Colors.text.muted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={16} color={Colors.text.muted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All People
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'follow' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('follow')}
        >
          <Text style={[styles.filterText, selectedFilter === 'follow' && styles.activeFilterText]}>
            To Follow
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'friend_request' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('friend_request')}
        >
          <Text style={[styles.filterText, selectedFilter === 'friend_request' && styles.activeFilterText]}>
            Add Friends
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredUsers.length} people found
        </Text>
      </View>

      {/* Users List */}
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={filteredUsers}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary[500]}
              colors={[Colors.primary[500]]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
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
  backButton: {
    padding: Spacing[2],
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  searchButton: {
    padding: Spacing[2],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    marginHorizontal: Spacing[4],
    marginBottom: Spacing[4],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
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
  resultsContainer: {
    paddingHorizontal: Spacing[4],
    marginBottom: Spacing[3],
  },
  resultsText: {
    fontSize: 14,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[8],
  },
  userCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadows.sm,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    top: Spacing[3],
    right: Spacing[3],
    zIndex: 1,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.status.success,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: Spacing[4],
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[3],
  },
  avatar: {
    fontSize: 36,
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
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
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
    marginBottom: Spacing[2],
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 6,
    marginRight: Spacing[2],
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 10,
    color: Colors.text.muted,
    marginLeft: Spacing[1],
  },
  bio: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing[2],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  stat: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  statDot: {
    fontSize: 12,
    color: Colors.text.muted,
    marginHorizontal: Spacing[2],
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: Spacing[1],
  },
  activityText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionSection: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
    borderRadius: 8,
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
    fontSize: 12,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  primaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background.primary,
    marginLeft: Spacing[1],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  connectionsButton: {
    backgroundColor: Colors.background.tertiary,
    padding: Spacing[2],
    borderRadius: 20,
  },
})

export default PeopleDiscoveryScreen