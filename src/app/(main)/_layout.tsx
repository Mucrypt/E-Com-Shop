// app/(main)/_layout.tsx
import React from 'react'
import { Tabs, useRouter } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from '../../constants'
import CenterTabButton from '../../components/common/CenterTabButton'
import { useCenterTabButton } from '../../hooks/useCenterTabButton'

type IconProps = {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
  focused: boolean
}

const TabIcon = ({ name, color, focused }: IconProps) => (
  <View style={styles.iconWrapper}>
    <FontAwesome
      name={name}
      size={focused ? 24 : 22}
      color={focused ? '#F5C451' : color}
    />
  </View>
)

export default function CoreLayout() {
  const router = useRouter()
  const centerButtonConfig = useCenterTabButton('services')

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background.primary,
          borderTopColor: Colors.background.overlay,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.text.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'main',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name='th-large' color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name='saved'
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name='heart' color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name='sell'
        options={{
          title: '',
          tabBarButton: () => (
            <CenterTabButton
              onPress={() => router.push('/(modals)/post-center-modal')}
              {...centerButtonConfig}
            />
          ),
        }}
      />

      <Tabs.Screen
        name='messages'
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name='comments' color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name='user' color={color} focused={focused} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/(profile)');
          },
        }}
      />

      {/* Hidden route - accessible via navigation but not shown in tabs */}
      <Tabs.Screen
        name='more'
        options={{
          href: null,
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
