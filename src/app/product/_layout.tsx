import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ProductLayout = () => {
  return (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen
        name='[slug]'
        options={({ route }) => {
          const params = route.params as { slug?: string } | undefined
          const slug = params?.slug
          const productName = slug
            ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
            : 'Product'

            return {
              // Hide native header so custom ProductHeader is the only top bar
              headerShown: false,
            }
        }}
      />
    </Stack>
  )
}

export default ProductLayout
