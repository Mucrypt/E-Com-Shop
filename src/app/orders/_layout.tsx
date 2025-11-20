import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

const OrdersLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          title: 'My Orders',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2E8C83',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => {
                // Could add filter/search functionality
                console.log('Filter orders')
              }}
            >
              <FontAwesome name='filter' size={20} color='white' />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name='[orderId]'
        options={({ route }) => {
          const params = route.params as { orderId?: string } | undefined
          const orderId = params?.orderId || 'Order'

          return {
            title: `Order #${orderId.replace('ORD-', '')}`,
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2E8C83',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 16,
            },
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 15 }}
              >
                <FontAwesome name='arrow-left' size={20} color='white' />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 15 }}
                onPress={() => {
                  // Could add share functionality
                  console.log('Share order')
                }}
              >
                <FontAwesome name='share' size={20} color='white' />
              </TouchableOpacity>
            ),
          }
        }}
      />
    </Stack>
  )
}

export default OrdersLayout
