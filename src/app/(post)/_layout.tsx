import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '../../constants'

export default function PostLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Colors.background.primary,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="category/[id]" />
      <Stack.Screen name="wizard/[step]" />
    </Stack>
  )
}