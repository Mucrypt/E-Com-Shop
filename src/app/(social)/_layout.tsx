import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { Colors } from '../../constants'

// Import the modals from media
import CreatePostModal from '../(media)/components/CreatePostModal'
import LiveStreamModal from '../(media)/components/LiveStreamModal'

const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -20,
  },
  createButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E8C83', // Same green as MediaFooter
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  createTabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default function SocialLayout() {
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [liveModalVisible, setLiveModalVisible] = useState(false)

  const CreateButton = () => (
    <TouchableOpacity
      style={styles.createButton}
      onPress={() => setCreateModalVisible(true)}
      activeOpacity={0.7}
    >
      <View style={styles.createButtonInner}>
        <FontAwesome name="plus" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  )

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary[500],
          tabBarInactiveTintColor: Colors.text.muted,
          tabBarStyle: {
            backgroundColor: Colors.background.primary,
            borderTopColor: Colors.border.primary,
            borderTopWidth: 1,
            height: Platform.OS === 'ios' ? 85 : 65,
            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
            paddingTop: 8,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          headerShown: false,
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="media"
        options={{
          title: 'Pulse',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bolt" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: () => <CreateButton />,
          tabBarButton: (props) => (
            <View style={[props.style, styles.createTabButton]}>
              <CreateButton />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="compass" size={size} color={color} />
          ),
        }}
      />
     
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
      </Tabs>

      {/* Modals */}
      <CreatePostModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onOpenLiveStream={() => setLiveModalVisible(true)}
      />
      <LiveStreamModal
        visible={liveModalVisible}
        onClose={() => setLiveModalVisible(false)}
      />
    </>
  )
}