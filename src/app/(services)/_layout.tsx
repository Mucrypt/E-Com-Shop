// app/(services)/_layout.tsx
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
  showLabel?: boolean
}

const TabIcon = ({ name, focused, color, showLabel = true }: TabIconProps) => (
  <View style={styles.iconWrapper}>
    <FontAwesome name={name} size={showLabel ? 18 : 24} color={color} />
  </View>
)

export default function ServicesLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('services')

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
          title: 'Services',
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="th-large" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved services',
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="heart-o" color={color} focused={focused} />
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
              onPress={() => router.push('/(services)/post')}
              {...centerButtonConfig}
            />
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
        name="messages"
        options={{
          title: 'Service Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="comments-o" color={color} focused={focused} />
          ),
        }}
      />
      {/* Hidden detail screen – opened from cards, not a tab */}
      <Tabs.Screen
        name="service-detail"
        options={{
          href: null,
          title: 'Service detail',
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
