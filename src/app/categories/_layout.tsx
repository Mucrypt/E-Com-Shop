import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const CategoriesLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='[slug]'
        options={({ route }) => {
          const params = route.params as { slug?: string } | undefined
          const slug = params?.slug
          const categoryName = slug
            ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
            : 'Category'

          return {
            title: categoryName,
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2E8C83',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 15 }}
              >
                <Ionicons name='arrow-back' size={24} color='white' />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name='search' size={24} color='white' />
              </TouchableOpacity>
            ),
          }
        }}
      />
    </Stack>
  )
}

export default CategoriesLayout
