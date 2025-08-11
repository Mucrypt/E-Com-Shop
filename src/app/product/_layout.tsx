import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const ProductLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'Product Details',
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
              <Ionicons name='arrow-back' size={34} color='white' />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', marginRight: 15 }}>
              <TouchableOpacity style={{ marginRight: 15 }}>
                <Ionicons name='heart-outline' size={24} color='white' />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name='share-outline' size={24} color='white' />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name='[slug]'
        options={({ route }) => {
          const params = route.params as { slug?: string } | undefined
          const slug = params?.slug
          const productName = slug
            ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
            : 'Product'

          return {
            title: productName,
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
              <View style={{ flexDirection: 'row', marginRight: 15 }}>
                <TouchableOpacity style={{ marginRight: 15 }}>
                  <Ionicons name='heart-outline' size={24} color='white' />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name='share-outline' size={24} color='white' />
                </TouchableOpacity>
              </View>
            ),
          }
        }}
      />
    </Stack>
  )
}

export default ProductLayout
