// app/(shop)/categories/_layout.tsx
import React from 'react'
import { Stack } from 'expo-router'

const CategoriesLayout = () => {
  return (
    <Stack>
      {/* Index (categories list) keeps default header or its own options */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Category slug uses a full custom header inside the screen */}
      <Stack.Screen
        name="[slug]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  )
}

export default CategoriesLayout
