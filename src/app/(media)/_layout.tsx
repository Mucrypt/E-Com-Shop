import { Stack } from 'expo-router'
import React from 'react'

export default function MediaLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#000' },
      }}
    />
  )
}
