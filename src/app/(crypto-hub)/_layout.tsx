// app/(crypto-hub)/_layout.tsx
import React from 'react'
import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

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

export default function CryptoHubLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#050509',
          borderTopColor: '#151822',
          height: 78,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#F5C451',
        tabBarInactiveTintColor: '#888EA3',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="markets"
        options={{
          title: 'Markets',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="line-chart" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trade',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="exchange" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="bullhorn" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="assets"
        options={{
          title: 'Assets',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="briefcase" color={color} focused={focused} />
          ),
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
