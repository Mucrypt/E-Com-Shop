import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { useAuth } from '../../providers'
import { useRouter } from 'expo-router'
import NavigationHeader from '../../components/common/NavigationHeader'

type Follower = {
  id: string
  name: string
  handle: string
  isMutual: boolean
  isFollowingBack: boolean
}

const mockFollowers: Follower[] = [
  {
    id: '1',
    name: 'John Builder',
    handle: '@john_builds',
    isMutual: true,
    isFollowingBack: true,
  },
  {
    id: '2',
    name: 'Sarah Designer',
    handle: '@sarah_designs',
    isMutual: false,
    isFollowingBack: false,
  },
  {
    id: '3',
    name: 'Crypto Hero',
    handle: '@crypto_hero',
    isMutual: true,
    isFollowingBack: true,
  },
  {
    id: '4',
    name: 'House Finder',
    handle: '@real_estate_pro',
    isMutual: false,
    isFollowingBack: true,
  },
]

export default function FollowersScreen() {
  const { colors } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()
  const [followers, setFollowers] = useState(mockFollowers)

  const toggleFollowBack = (id: string) => {
    setFollowers((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isFollowingBack: !f.isFollowingBack } : f
      )
    )
  }

  const renderItem = ({ item }: { item: Follower }) => {
    const initials = item.name
      .split(' ')
      .map((p) => p.charAt(0))
      .join('')
      .toUpperCase()

    return (
      <TouchableOpacity
        style={[styles.row, { backgroundColor: colors.surface }]}
        onPress={() => router.push(`/(profile)/public/${item.id}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text
            style={[styles.handle, { color: colors.textSecondary }]}
          >
            {item.handle}
          </Text>
          {item.isMutual && (
            <Text style={styles.mutual}>Follows you • Mutual</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.followBtn,
            item.isFollowingBack && styles.followBtnActive,
          ]}
          onPress={() => toggleFollowBack(item.id)}
        >
          <Text
            style={[
              styles.followText,
              item.isFollowingBack && styles.followTextActive,
            ]}
          >
            {item.isFollowingBack ? 'Following' : 'Follow back'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationHeader title="Followers" />
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {followers.length} people follow{' '}
          {user?.profile?.full_name || user?.email?.split('@')[0] || 'you'}
        </Text>
      </View>

      <FlatList
        data={followers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <FontAwesome name='users' size={28} color='#4B5563' />
            <Text style={styles.emptyTitle}>No followers yet</Text>
            <Text style={styles.emptyText}>
              When people follow you, they’ll appear here.
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F5C451',
  },
  avatarText: {
    color: '#F5C451',
    fontWeight: '700',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  handle: {
    fontSize: 12,
  },
  mutual: {
    fontSize: 11,
    color: '#22C55E',
    marginTop: 3,
  },
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F5C451',
  },
  followBtnActive: {
    backgroundColor: '#F5C451',
  },
  followText: {
    fontSize: 12,
    color: '#F5C451',
    fontWeight: '600',
  },
  followTextActive: {
    color: '#050509',
  },
  emptyBox: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  emptyText: {
    marginTop: 4,
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
})
