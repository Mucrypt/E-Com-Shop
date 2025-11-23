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

type Following = {
  id: string
  name: string
  handle: string
  isNotificationsOn: boolean
}

const mockFollowing: Following[] = [
  {
    id: '10',
    name: 'Pro Contractor',
    handle: '@pro_contractor',
    isNotificationsOn: true,
  },
  {
    id: '11',
    name: 'Luxury Homes',
    handle: '@lux_homes',
    isNotificationsOn: false,
  },
  {
    id: '12',
    name: 'Travel Deals',
    handle: '@travel_world',
    isNotificationsOn: true,
  },
  {
    id: '13',
    name: 'Tech Gadgets',
    handle: '@gadget_hub',
    isNotificationsOn: false,
  },
]

export default function FollowingScreen() {
  const { colors } = useDarkMode()
  const { user } = useAuth()
  const router = useRouter()
  const [following, setFollowing] = useState(mockFollowing)

  const toggleNotifications = (id: string) => {
    setFollowing((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, isNotificationsOn: !f.isNotificationsOn }
          : f
      )
    )
  }

  const renderItem = ({ item }: { item: Following }) => {
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
        </View>

        <TouchableOpacity
          style={[
            styles.bellBtn,
            item.isNotificationsOn && styles.bellBtnActive,
          ]}
          onPress={() => toggleNotifications(item.id)}
        >
          <FontAwesome
            name={item.isNotificationsOn ? 'bell' : 'bell-o'}
            size={14}
            color={item.isNotificationsOn ? '#050509' : '#F5C451'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationHeader title="Following" />
      <View style={styles.header}>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          You are following {following.length} accounts
        </Text>
      </View>

      <FlatList
        data={following}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <FontAwesome name='user-plus' size={28} color='#4B5563' />
            <Text style={styles.emptyTitle}>You are not following anyone</Text>
            <Text style={styles.emptyText}>
              Discover creators, sellers and professionals from the Mukulah
              universe and follow them.
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
  bellBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F5C451',
  },
  bellBtnActive: {
    backgroundColor: '#F5C451',
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
