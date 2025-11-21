import React from 'react'
import { Stack } from 'expo-router'

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Checkout' }}>
      <Stack.Screen name="index" options={{ headerShown: true, title: 'Checkout' }} />
    </Stack>
  )
}