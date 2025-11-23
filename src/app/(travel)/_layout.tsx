// app/(travel)/_layout.tsx
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Spacing } from '../../constants'
import CenterTabButton from '../../components/common/CenterTabButton'
import { useCenterTabButton } from '../../hooks/useCenterTabButton'

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

const TravelHeader = () => {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  
  const handleNotificationPress = () => {
    // Handle notification press - you can implement notification logic here
    console.log('Notifications pressed')
  }
  
  const handleSavedPress = () => {
    router.push('/(travel)/saved')
  }
  
  const handleProfilePress = () => {
    router.push('/(profile)')
  }
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Travel</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleSavedPress}>
            <FontAwesome name="heart" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={handleProfilePress}>
            <FontAwesome name="user" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

function TravelTabsLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('realEstate') // Travel uses real estate theme (purple)

  return (
    <View style={styles.container}>
      <TravelHeader />
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
          title: 'Travel',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="globe" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Your trips',
          tabBarLabel: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="plane" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: 'List your place',
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
          title: 'Travel messages',
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

      {/* Hidden detail screen – opened from destination cards */}
      <Tabs.Screen
        name="destination-detail"
        options={{
          href: null,
          title: 'Destination detail',
        }}
      />
      </Tabs>
    </View>
  )
}

export default function TravelLayout() {
  return (
    <SafeAreaProvider>
      <TravelTabsLayout />
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
})
