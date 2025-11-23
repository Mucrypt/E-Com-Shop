import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useDarkMode } from '../../contexts/DarkModeContext'
import NavigationHeader from '../../components/common/NavigationHeader'

type UserProfile = {
  id: string
  name: string
  handle: string
  bio: string
  followersCount: number
  followingCount: number
  postsCount: number
  isFollowing: boolean
}

// Mock user data - in real app, fetch based on userId
const mockUser: UserProfile = {
  id: '1',
  name: 'John Builder',
  handle: '@john_builds',
  bio: 'Professional contractor specializing in residential construction. Building dreams one project at a time.',
  followersCount: 1248,
  followingCount: 342,
  postsCount: 89,
  isFollowing: false,
}

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>()
  const { colors } = useDarkMode()
  const router = useRouter()
  const [user, setUser] = React.useState<UserProfile>(mockUser)
  const [isFollowing, setIsFollowing] = React.useState(user.isFollowing)

  const initials = user.name
    .split(' ')
    .map((p) => p.charAt(0))
    .join('')
    .toUpperCase()

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)
    // In real app, make API call here
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationHeader 
        title="Profile"
        rightComponent={
          <TouchableOpacity style={styles.moreButton}>
            <FontAwesome name="ellipsis-h" size={18} color={colors.text} />
          </TouchableOpacity>
        }
      />
      
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.handle, { color: colors.textSecondary }]}>{user.handle}</Text>
          
          {user.bio && (
            <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text>
          )}
          
          {/* Stats */}
          <View style={styles.stats}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.postsCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.followersCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{user.followingCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Following</Text>
            </TouchableOpacity>
          </View>
          
          {/* Follow Button */}
          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={handleFollowToggle}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Posts/Content would go here */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Posts</Text>
          <View style={styles.emptyState}>
            <FontAwesome name="image" size={32} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No posts yet</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  moreButton: {
    padding: 8,
  },
  profileHeader: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5C451',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5C451',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  handle: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  followButton: {
    backgroundColor: '#F5C451',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F5C451',
  },
  followButtonText: {
    color: '#050509',
    fontWeight: '600',
    fontSize: 14,
  },
  followingButtonText: {
    color: '#F5C451',
  },
  section: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
})