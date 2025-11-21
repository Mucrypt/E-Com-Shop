import React from 'react'
import { Stack } from 'expo-router'

const ProductLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='[slug]' options={{ headerShown: false }} />
    </Stack>
  )
}

export default ProductLayout
