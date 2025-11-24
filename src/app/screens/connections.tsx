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
  ScrollView,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

interface Connection {
  id: string
  name: string
  username: string
  avatar: string
  verified: boolean
  category: string
  mutualConnections: number
  location?: string
  bio: string
  isOnline: boolean
  lastActive: string
  connectionDate?: string
  connectionStatus: 'following' | 'follower' | 'mutual' | 'pending_in' | 'pending_out' | 'suggested'
  badges: string[]
}

const mockConnections: Connection[] = [
  {
    id: '1',
    name: 'Alex Rodriguez',
    username: '@alexcrypto',
    avatar: '👨‍💼',
    verified: true,
    category: 'Crypto Trader',
    mutualConnections: 12,
    location: 'Miami, FL',
    bio: 'Professional crypto trader sharing daily insights',
    isOnline: true,
    lastActive: 'Online now',
    connectionDate: '2 weeks ago',
    connectionStatus: 'mutual',
    badges: ['Top Trader', 'Verified Pro'],
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
    isOnline: false,
    lastActive: '2h ago',
    connectionDate: '1 week ago',
    connectionStatus: 'following',
    badges: ['Explorer', 'Content Creator'],
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
    bio: 'Connecting top talent with amazing opportunities',
    isOnline: true,
    lastActive: 'Online now',
    connectionDate: '3 days ago',
    connectionStatus: 'follower',
    badges: ['Top Recruiter', 'Industry Expert'],
  },
  {
    id: '4',
    name: 'Emma Thompson',
    username: '@emmashop',
    avatar: '👩‍🎨',
    verified: true,
    category: 'Fashion Influencer',
    mutualConnections: 15,
    bio: 'Curating sustainable fashion trends',
    isOnline: false,
    lastActive: '1h ago',
    connectionStatus: 'pending_in',
    badges: ['Style Icon', 'Sustainable Fashion'],
  },
  {
    id: '5',
    name: 'David Kim',
    username: '@davidmedia',
    avatar: '🎬',
    verified: true,
    category: 'Content Creator',
    mutualConnections: 7,
    bio: 'Creating viral content and brand stories',
    isOnline: true,
    lastActive: 'Online now',
    connectionStatus: 'pending_out',
    badges: ['Viral Creator', 'Brand Partner'],
  },
  {
    id: '6',
    name: 'Lisa Wang',
    username: '@lisafitness',
    avatar: '💪',
    verified: false,
    category: 'Fitness Coach',
    mutualConnections: 4,
    bio: 'Transforming lives through fitness',
    isOnline: false,
    lastActive: '30m ago',
    connectionStatus: 'suggested',
    badges: ['Certified Trainer'],
  },
]

type TabType = 'followers' | 'following' | 'requests' | 'suggested' | 'mutual'

const ConnectionsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('followers')
  const [searchQuery, setSearchQuery] = useState('')
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [refreshing, setRefreshing] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [activeTab])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const handleConnectionAction = (userId: string, action: 'accept' | 'decline' | 'follow' | 'unfollow' | 'cancel') => {
    setConnections(prevConnections =>
      prevConnections.map(connection => {
        if (connection.id === userId) {
          switch (action) {
            case 'accept':
              return { ...connection, connectionStatus: 'mutual' as const }
            case 'decline':
              return { ...connection, connectionStatus: 'suggested' as const }
            case 'follow':
              return { ...connection, connectionStatus: 'following' as const }
            case 'unfollow':
              return { ...connection, connectionStatus: 'suggested' as const }
            case 'cancel':
              return { ...connection, connectionStatus: 'suggested' as const }
            default:
              return connection
          }
        }
        return connection
      })
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Trader': return Colors.status.warning
      case 'Travel Creator': return Colors.status.info
      case 'Tech Recruiter': return Colors.status.success
      case 'Fashion Influencer': return Colors.primary[500]
      case 'Content Creator': return Colors.status.error
      case 'Fitness Coach': return '#FF6B6B'
      default: return Colors.text.secondary
    }
  }

  const getTabCount = (tab: TabType) => {
    switch (tab) {
      case 'followers':
        return connections.filter(c => c.connectionStatus === 'follower' || c.connectionStatus === 'mutual').length
      case 'following':
        return connections.filter(c => c.connectionStatus === 'following' || c.connectionStatus === 'mutual').length
      case 'requests':
        return connections.filter(c => c.connectionStatus === 'pending_in' || c.connectionStatus === 'pending_out').length
      case 'suggested':
        return connections.filter(c => c.connectionStatus === 'suggested').length
      case 'mutual':
        return connections.filter(c => c.connectionStatus === 'mutual').length
      default:
        return 0
    }
  }

  const getFilteredConnections = () => {
    let filtered = connections.filter(connection => {
      const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           connection.username.toLowerCase().includes(searchQuery.toLowerCase())
      
      let matchesTab = false
      switch (activeTab) {
        case 'followers':
          matchesTab = connection.connectionStatus === 'follower' || connection.connectionStatus === 'mutual'
          break
        case 'following':
          matchesTab = connection.connectionStatus === 'following' || connection.connectionStatus === 'mutual'
          break
        case 'requests':
          matchesTab = connection.connectionStatus === 'pending_in' || connection.connectionStatus === 'pending_out'
          break
        case 'suggested':
          matchesTab = connection.connectionStatus === 'suggested'
          break
        case 'mutual':
          matchesTab = connection.connectionStatus === 'mutual'
          break
      }
      
      return matchesSearch && matchesTab
    })
    
    return filtered
  }

  const renderConnectionCard = ({ item: connection }: { item: Connection }) => (
    <TouchableOpacity
      style={styles.connectionCard}
      onPress={() => router.push(`/user-profile?userId=${connection.id}`)}
    >
      {/* Online Status */}
      {connection.isOnline && (
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
        </View>
      )}

      <View style={styles.connectionInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{connection.avatar}</Text>
          {connection.verified && (
            <View style={styles.verifiedBadge}>
              <FontAwesome name="check" size={8} color={Colors.background.primary} />
            </View>
          )}
        </View>

        <View style={styles.userDetails}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{connection.name}</Text>
            {connection.connectionDate && (
              <Text style={styles.connectionDate}>
                {connection.connectionStatus === 'mutual' ? 'Friends' : 'Connected'} {connection.connectionDate}
              </Text>
            )}
          </View>
          
          <Text style={styles.username}>{connection.username}</Text>
          
          <View style={styles.categoryRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(connection.category)}20` }]}>
              <Text style={[styles.categoryText, { color: getCategoryColor(connection.category) }]}>
                {connection.category}
              </Text>
            </View>
            {connection.location && (
              <View style={styles.locationContainer}>
                <FontAwesome name="map-marker" size={10} color={Colors.text.muted} />
                <Text style={styles.locationText}>{connection.location}</Text>
              </View>
            )}
          </View>

          <Text style={styles.bio} numberOfLines={2}>{connection.bio}</Text>

          <View style={styles.metaRow}>
            <Text style={styles.mutualText}>
              {connection.mutualConnections} mutual connections
            </Text>
            <Text style={styles.lastActive}>{connection.lastActive}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {connection.connectionStatus === 'pending_in' && (
          <View style={styles.pendingInActions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.acceptBtn]}
              onPress={() => handleConnectionAction(connection.id, 'accept')}
            >
              <FontAwesome name="check" size={12} color={Colors.background.primary} />
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.declineBtn]}
              onPress={() => handleConnectionAction(connection.id, 'decline')}
            >
              <FontAwesome name="times" size={12} color={Colors.status.error} />
              <Text style={styles.declineBtnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        )}

        {connection.connectionStatus === 'pending_out' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.pendingBtn]}
            onPress={() => handleConnectionAction(connection.id, 'cancel')}
          >
            <FontAwesome name="clock-o" size={12} color={Colors.status.warning} />
            <Text style={styles.pendingBtnText}>Pending</Text>
          </TouchableOpacity>
        )}

        {connection.connectionStatus === 'suggested' && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.followBtn]}
            onPress={() => handleConnectionAction(connection.id, 'follow')}
          >
            <FontAwesome name="user-plus" size={12} color={Colors.background.primary} />
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        )}

        {(connection.connectionStatus === 'following' || connection.connectionStatus === 'mutual') && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.followingBtn]}
            onPress={() => handleConnectionAction(connection.id, 'unfollow')}
          >
            <FontAwesome name="check" size={12} color={Colors.status.success} />
            <Text style={styles.followingBtnText}>Following</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.actionBtn, styles.messageBtn]}>
          <FontAwesome name="comment" size={12} color={Colors.primary[500]} />
          <Text style={styles.messageBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderTabButton = (tab: TabType, label: string) => {
    const count = getTabCount(tab)
    return (
      <TouchableOpacity
        style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
          {label}
        </Text>
        {count > 0 && (
          <Text style={[styles.tabCount, activeTab === tab && styles.activeTabCount]}>
            {count > 99 ? '99+' : count}
          </Text>
        )}
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
        <Text style={styles.headerTitle}>People</Text>
        <TouchableOpacity style={styles.searchButton}>
          <FontAwesome name="search" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
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

      {/* Tab Navigation */}
      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContentContainer}
        >
          {renderTabButton('followers', 'Followers')}
          {renderTabButton('following', 'Following')}
          {renderTabButton('mutual', 'Friends')}
          {renderTabButton('requests', 'Requests')}
          {renderTabButton('suggested', 'Suggested')}
        </ScrollView>
      </View>

      {/* Connections List */}
      <Animated.View style={[styles.listContainer, { opacity: fadeAnim }]}>
        <FlatList
          data={getFilteredConnections()}
          renderItem={renderConnectionCard}
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome name="users" size={48} color={Colors.text.muted} />
              <Text style={styles.emptyTitle}>No people found</Text>
              <Text style={styles.emptyDescription}>
                {activeTab === 'suggested' 
                  ? "We'll suggest people you might know based on your interests"
                  : `You don't have any ${activeTab} yet`}
              </Text>
            </View>
          }
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
    marginBottom: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: Spacing[2],
  },
  tabsWrapper: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[2],
  },
  tabsContentContainer: {
    alignItems: 'center',
    height: 32,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing[2],
    minWidth: 70,
  },
  activeTabButton: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.secondary,
    lineHeight: 13,
  },
  activeTabText: {
    color: Colors.background.primary,
  },
  tabCount: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.text.muted,
    marginLeft: 4,
    backgroundColor: Colors.overlay.light10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    minWidth: 14,
    textAlign: 'center',
    lineHeight: 11,
  },
  activeTabCount: {
    color: Colors.background.primary,
    backgroundColor: Colors.overlay.dark30,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  listContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: 0,
    paddingBottom: Spacing[8],
  },
  connectionCard: {
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
  connectionInfo: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[1],
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    flex: 1,
  },
  connectionDate: {
    fontSize: 11,
    color: Colors.text.muted,
    fontWeight: '500',
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mutualText: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  lastActive: {
    fontSize: 11,
    color: Colors.text.muted,
  },
  actionSection: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  pendingInActions: {
    flexDirection: 'row',
    gap: Spacing[2],
    flex: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
    borderRadius: 8,
  },
  acceptBtn: {
    backgroundColor: Colors.status.success,
  },
  acceptBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background.primary,
    marginLeft: Spacing[1],
  },
  declineBtn: {
    backgroundColor: `${Colors.status.error}20`,
    borderWidth: 1,
    borderColor: Colors.status.error,
  },
  declineBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.status.error,
    marginLeft: Spacing[1],
  },
  pendingBtn: {
    backgroundColor: `${Colors.status.warning}20`,
    borderWidth: 1,
    borderColor: Colors.status.warning,
  },
  pendingBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.status.warning,
    marginLeft: Spacing[1],
  },
  followBtn: {
    backgroundColor: Colors.primary[500],
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background.primary,
    marginLeft: Spacing[1],
  },
  followingBtn: {
    backgroundColor: `${Colors.status.success}20`,
    borderWidth: 1,
    borderColor: Colors.status.success,
  },
  followingBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.status.success,
    marginLeft: Spacing[1],
  },
  messageBtn: {
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  messageBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: Spacing[1],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.text.muted,
    textAlign: 'center',
    paddingHorizontal: Spacing[6],
    lineHeight: 20,
  },
})

export default ConnectionsScreen