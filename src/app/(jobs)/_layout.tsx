// app/jobs/_layout.tsx
import React, { useState } from 'react'
import { Tabs, useRouter } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Spacing } from '../../constants'
import CenterTabButton from '../../components/common/CenterTabButton'
import { useCenterTabButton } from '../../hooks/useCenterTabButton'

const { width } = Dimensions.get('window')

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

const JobsHeader = ({ onMenuPress }: { onMenuPress: () => void }) => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  
  const handleNotificationPress = () => {
    // Handle notification press - you can implement notification logic here
    console.log('Notifications pressed')
  }
  
  const handleSavedPress = () => {
    router.push('/(jobs)/saved')
  }
  
  const handleProfilePress = () => {
    router.push('/(profile)')
  }
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.hamburgerButton} onPress={onMenuPress}>
            <FontAwesome name="bars" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jobs</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSavedPress}>
            <FontAwesome name="heart" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <FontAwesome name="user" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
            <FontAwesome name="bell" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// Sidebar Item Component
const SidebarItem: React.FC<{ icon: string; label: string; onPress?: () => void }> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity style={styles.sidebarItem} activeOpacity={0.75} onPress={onPress}>
    <FontAwesome name={icon as any} size={18} color={Colors.text.primary} />
    <Text style={styles.sidebarItemText}>{label}</Text>
    <FontAwesome name='chevron-right' size={12} color={Colors.text.muted} />
  </TouchableOpacity>
)

// Jobs Sidebar Component
const JobsSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const router = useRouter()
  
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.sidebarOverlay}>
        <TouchableOpacity
          style={styles.sidebarBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Jobs & Services</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome name='times' size={20} color={Colors.text.muted} />
            </TouchableOpacity>
          </View>

          <Text style={styles.sidebarSectionLabel}>My space</Text>
          <SidebarItem icon='user-circle-o' label='My job profile' onPress={() => { onClose(); router.push('/(jobs)/profile'); }} />
          <SidebarItem icon='file-text-o' label='Applications' onPress={() => { onClose(); router.push('/(jobs)/applications'); }} />
          <SidebarItem icon='bookmark-o' label='Saved jobs & searches' onPress={() => { onClose(); router.push('/(jobs)/saved'); }} />
          <SidebarItem icon='briefcase' label='Jobs I posted' />

          <Text style={styles.sidebarSectionLabel}>Discover</Text>
          <SidebarItem icon='map-marker' label='Jobs near me' />
          <SidebarItem icon='globe' label='Remote & global roles' />
          <SidebarItem icon='graduation-cap' label='Internships & juniors' />
          <SidebarItem icon='wrench' label='Skilled trades & services' />

          <Text style={styles.sidebarSectionLabel}>Settings</Text>
          <SidebarItem icon='bell-o' label='Alert preferences' />
          <SidebarItem icon='cog' label='Job center settings' />
        </View>
      </View>
    </Modal>
  )
}

function JobsTabsLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('jobs')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <View style={styles.container}>
      <JobsHeader onMenuPress={() => setSidebarOpen(true)} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.background.primary,
            borderTopColor: Colors.border.primary,
          },
          tabBarActiveTintColor: Colors.primary[500],
          tabBarInactiveTintColor: Colors.text.muted,
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="briefcase" color={color} focused={focused} />
          ),
        }}
      />
    
      
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications',
          tabBarLabel: 'Applications',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="file-text-o" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="post"
        options={{
          title: 'Post a Job',
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
          title: 'Job Messages',
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
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      </Tabs>
      
      {/* Jobs Sidebar */}
      <JobsSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </View>
  )
}

export default function JobsLayout() {
  return (
    <SafeAreaProvider>
      <JobsTabsLayout />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    backgroundColor: Colors.background.primary,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    minHeight: 44,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  iconButton: {
    padding: Spacing[2],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  hamburgerButton: {
    padding: Spacing[2],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing[3],
  },
  // Sidebar styles
  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: width * 0.78,
    backgroundColor: Colors.background.secondary,
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  sidebarSectionLabel: {
    fontSize: 11,
    color: Colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.primary,
  },
  sidebarItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text.primary,
  },
})
