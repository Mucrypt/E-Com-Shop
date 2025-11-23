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
import { Tabs, useRouter } from 'expo-router'
import { FontAwesome5, Feather, FontAwesome } from '@expo/vector-icons'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import CenterTabButton from '../../components/common/CenterTabButton'
import { useCenterTabButton } from '../../hooks/useCenterTabButton'

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
    outputRange: [-280, 0], // slide in from left
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
  const router = useRouter()
  const insets = useSafeAreaInsets()
  
  const handleSavedPress = () => {
    router.push('/(real-estate)/saved')
  }
  
  const handleProfilePress = () => {
    router.push('/(profile)')
  }
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <View style={styles.headerLeft}>
        <TouchableOpacity style={styles.headerIconButton} onPress={onMenu}>
          <Feather name="menu" size={20} color="#F9FAFB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleSavedPress}>
          <FontAwesome name="heart" size={18} color="#E5E7EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>Homes • Rentals • Investments</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerIconButton}>
          <Feather name="bell" size={18} color="#E5E7EB" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconButton} onPress={handleProfilePress}>
          <Feather name="user" size={18} color="#E5E7EB" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

/* -------------------------------------------------------------------------- */
/*  Layout with bottom tabs + sidebar                                         */
/* -------------------------------------------------------------------------- */

type TabIconProps = {
  name: React.ComponentProps<typeof FontAwesome>['name']
  focused: boolean
  color: string
}

const TabIcon = ({ name, focused, color }: TabIconProps) => (
  <View style={styles.iconWrapper}>
    <FontAwesome name={name} size={18} color={color} />
  </View>
)

export default function RealEstateLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('realEstate')

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#050509' }}>
      <RealEstateHeader
        title="Real Estate"
        onMenu={() => setSidebarOpen(true)}
      />

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
            title: 'Real Estate',
            tabBarLabel: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="building-o" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Market Analytics',
            tabBarLabel: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="line-chart" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: 'List Property',
            tabBarLabel: '',
            tabBarButton: () => (
              <CenterTabButton
                onPress={() => router.push('/(modals)/post-center-modal')}
                {...centerButtonConfig}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: 'Property Messages',
            tabBarLabel: 'Messages',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="comments-o" color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Back to Main',
            tabBarLabel: 'Main',
            tabBarIcon: ({ color, focused }) => (
              <TabIcon name="th-large" color={color} focused={focused} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              router.push('/(main)');
            },
          }}
        />
      </Tabs>

      {/* Real estate sidebar */}
      <RealEstateSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      </View>
    </SafeAreaProvider>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* sidebar */
  sidebarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sidebarPanel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#050509',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#111827',
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
