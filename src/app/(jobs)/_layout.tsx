// app/jobs/_layout.tsx
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

export default function JobsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#050509',
          borderTopColor: '#111827',
          height: 64,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: '#F5C451',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
        },
        tabBarIcon: ({ color, size }) => {
          let icon: string = 'briefcase'

          switch (route.name) {
            case 'index':
              icon = 'briefcase'
              break
            case 'saved':
              icon = 'heart-o'
              break
            case 'post':
              icon = 'plus-square'
              break
            case 'applications':
              icon = 'file-text-o'
              break
            case 'messages':
              icon = 'comments-o' // NEW: messages tab
              break
          }

          return <FontAwesome name={icon as any} size={size} color={color} />
        },
      })}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Jobs',
        }}
      />
      <Tabs.Screen
        name='saved'
        options={{
          title: 'Saved',
        }}
      />
      <Tabs.Screen
        name='post'
        options={{
          title: 'Post',
        }}
      />
      <Tabs.Screen
        name='applications'
        options={{
          title: 'Applications',
        }}
      />
      <Tabs.Screen
        name='messages'
        options={{
          title: 'Messages',
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  )
}
