// app/(travel)/_layout.tsx
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from '../../constants'
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

export default function TravelLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('realEstate') // Travel uses real estate theme (purple)

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background.primary },
        headerTintColor: Colors.text.primary,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
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
              onPress={() => router.push('/(travel)/post')}
              iconName="home"
              iconLibrary="FontAwesome"
              gradient={['#C084FC', '#A855F7']} // Purple gradient for travel
              size={32}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved places',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="heart-o" color={color} focused={focused} />
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

      {/* Hidden detail screen – opened from destination cards */}
      <Tabs.Screen
        name="destination-detail"
        options={{
          href: null,
          title: 'Destination detail',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
