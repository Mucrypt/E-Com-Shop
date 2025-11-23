import React from 'react'
import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="post-center-modal"
        options={{
          title: "Create Post",
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}