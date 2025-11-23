// app/(services)/_layout.tsx
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Spacing } from '../../constants'
import CenterTabButton from '../../components/common/CenterTabButton'
import { useCenterTabButton } from '../../hooks/useCenterTabButton'
import ServicesSidebar from '../../components/services/ServicesSidebar'
import { ServicesSidebarProvider, useServicesSidebar } from '../../contexts/ServicesSidebarContext'

type TabIconProps = {
  name: React.ComponentProps<typeof FontAwesome>['name']
  focused: boolean
  color: string
  showLabel?: boolean
}

const TabIcon = ({ name, focused, color, showLabel = true }: TabIconProps) => (
  <View style={styles.iconWrapper}>
    <FontAwesome name={name} size={showLabel ? 18 : 24} color={color} />
  </View>
)

const ServicesHeader = () => {
  const { toggle } = useServicesSidebar()
  const insets = useSafeAreaInsets()
  const router = useRouter()
  
  const handleNotificationPress = () => {
    // Handle notification press - you can implement notification logic here
    console.log('Notifications pressed')
  }
  
  const handleSavedPress = () => {
    router.push('/(services)/saved')
  }
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.hamburgerButton} onPress={toggle}>
            <FontAwesome name="bars" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Services</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.savedButton} onPress={handleSavedPress}>
            <FontAwesome name="heart" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
            <FontAwesome name="bell" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function ServicesTabsLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('services')
  const { isOpen, close } = useServicesSidebar()

  return (
    <View style={styles.container}>
      <ServicesHeader />
      <Tabs
        screenOptions={{
          headerShown: false, // Hide individual screen headers
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
          title: 'Services',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="search" color={color} focused={focused} />
          ),
        }}
      />

 
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses & Skills',
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="graduation-cap" color={color} focused={focused} />
          ),
        }}
      />

           <Tabs.Screen
        name="post"
        options={{
          title: 'Post a service',
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
          title: 'Service Messages',
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
      {/* Hidden screens – opened via navigation, not tabs */}
      <Tabs.Screen
        name="service-detail"
        options={{
          href: null,
          title: 'Service detail',
        }}
        />
      </Tabs>
      
      {/* Services Sidebar */}
      <ServicesSidebar isOpen={isOpen} onClose={close} />
    </View>
  )
}

export default function ServicesLayout() {
  return (
    <SafeAreaProvider>
      <ServicesSidebarProvider>
        <ServicesTabsLayout />
      </ServicesSidebarProvider>
    </SafeAreaProvider>
  )
}const styles = StyleSheet.create({
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
  hamburgerButton: {
    padding: Spacing[2],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
    marginRight: Spacing[3],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  savedButton: {
    padding: Spacing[2],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
  notificationButton: {
    padding: Spacing[2],
    borderRadius: 8,
    backgroundColor: Colors.background.secondary,
  },
})
