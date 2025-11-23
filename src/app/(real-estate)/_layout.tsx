// app/(real-estate)/_layout.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native'
import { Tabs } from 'expo-router'
import { FontAwesome5, Feather } from '@expo/vector-icons'

/* -------------------------------------------------------------------------- */
/*  Sidebar component                                                         */
/* -------------------------------------------------------------------------- */

type RealEstateSidebarProps = {
  open: boolean
  onClose: () => void
}

const RealEstateSidebar: React.FC<RealEstateSidebarProps> = ({
  open,
  onClose,
}) => {
  const [visible, setVisible] = React.useState(open)
  const slideAnim = React.useRef(new Animated.Value(0)).current

  React.useEffect(() => {
    if (open) {
      setVisible(true)
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setVisible(false)
      })
    }
  }, [open, slideAnim])

  if (!visible) return null

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [280, 0], // slide in from right
  })

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.sidebarOverlay}
      />
      <Animated.View
        style={[styles.sidebarPanel, { transform: [{ translateX }] }]}
      >
        <View style={styles.sidebarHeader}>
          <View style={styles.sidebarAvatar}>
            <Text style={styles.sidebarAvatarText}>M</Text>
          </View>
          <View>
            <Text style={styles.sidebarTitle}>Mukulah Real Estate</Text>
            <Text style={styles.sidebarSubtitle}>Your property universe</Text>
          </View>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarSectionLabel}>Browse</Text>

          <View style={styles.sidebarItemRow}>
            <Feather name="home" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>All properties</Text>
          </View>
          <View style={styles.sidebarItemRow}>
            <Feather name="key" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>For rent</Text>
          </View>
          <View style={styles.sidebarItemRow}>
            <Feather name="dollar-sign" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>For sale</Text>
          </View>
          <View style={styles.sidebarItemRow}>
            <Feather name="map-pin" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>Near you</Text>
          </View>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarSectionLabel}>My activity</Text>

          <View style={styles.sidebarItemRow}>
            <Feather name="heart" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>Saved homes</Text>
          </View>
          <View style={styles.sidebarItemRow}>
            <Feather name="clipboard" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>My listings</Text>
          </View>
          <View style={styles.sidebarItemRow}>
            <Feather name="bell" size={18} color="#E5E7EB" />
            <Text style={styles.sidebarItemText}>Alerts & notifications</Text>
          </View>
        </View>

        <View style={styles.sidebarFooter}>
          <Text style={styles.sidebarFooterText}>Settings & Privacy</Text>
        </View>
      </Animated.View>
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*  Header for Real Estate layout                                             */
/* -------------------------------------------------------------------------- */

type RealEstateHeaderProps = {
  title: string
  onMenu: () => void
}

const RealEstateHeader: React.FC<RealEstateHeaderProps> = ({
  title,
  onMenu,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerIconButton} onPress={onMenu}>
        <Feather name="menu" size={20} color="#F9FAFB" />
      </TouchableOpacity>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>Homes • Rentals • Investments</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Feather name="bell" size={18} color="#E5E7EB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconButton}>
          <Feather name="user" size={18} color="#E5E7EB" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*  Layout with bottom tabs + sidebar                                         */
/* -------------------------------------------------------------------------- */

export default function RealEstateLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: '#050509' }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#F5C451',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarShowLabel: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="heart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'Post',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="plus-square" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, size }) => (
              <Feather name="message-circle" color={color} size={size} />
            ),
          }}
        />
      </Tabs>

      {/* Real estate sidebar */}
      <RealEstateSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*  Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#050509',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#111827',
  },
  headerIconButton: {
    padding: 6,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
  },

  /* tab bar */
  tabBar: {
    backgroundColor: '#050509',
    borderTopColor: '#111827',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
    paddingTop: 4,
    height: 60,
  },

  /* sidebar */
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sidebarPanel: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#050509',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#111827',
    paddingHorizontal: 16,
    paddingTop: 36,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sidebarAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sidebarAvatarText: {
    color: '#F5C451',
    fontWeight: '700',
    fontSize: 18,
  },
  sidebarTitle: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '700',
  },
  sidebarSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarSectionLabel: {
    color: '#6B7280',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sidebarItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  sidebarItemText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
  },
  sidebarFooter: {
    marginTop: 'auto',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#111827',
  },
  sidebarFooterText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
})
