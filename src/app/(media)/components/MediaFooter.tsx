import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

interface MediaFooterProps {
  onCreatePost: () => void
  onGoLive: () => void // Add this prop
  currentTab: 'home' | 'discover' | 'cart' | 'profile'
}

const MediaFooter: React.FC<MediaFooterProps> = ({
  onCreatePost,
  onGoLive, // Add this prop
  currentTab,
}) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[
          styles.footerButton,
          currentTab === 'home' && styles.footerButtonActive,
        ]}
      >
        <Ionicons
          name='home'
          size={24}
          color={currentTab === 'home' ? '#fff' : '#999'}
        />
        <Text
          style={[
            styles.footerButtonText,
            currentTab === 'home' && styles.footerButtonTextActive,
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => router.push('/(shop)/shop')}
      >
        <Ionicons name='search' size={24} color='#999' />
        <Text style={styles.footerButtonText}>Discover</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={onCreatePost}
        testID='create-post-button'
      >
        <View style={styles.recordButton}>
          <Ionicons name='add' size={32} color='#fff' />
        </View>
      </TouchableOpacity>

      {/* Add the Go Live button */}
      <TouchableOpacity
        style={styles.footerButton}
        onPress={onGoLive}
        testID='go-live-button'
      >
        <View style={styles.liveButton}>
          <Ionicons name='radio' size={24} color='#fff' />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => router.push('/cart')}
      >
        <Ionicons name='cart-outline' size={24} color='#999' />
        <Text style={styles.footerButtonText}>Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => router.push('/(shop)/profile')}
      >
        <Ionicons name='person-outline' size={24} color='#999' />
        <Text style={styles.footerButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    zIndex: 100, // Added zIndex to ensure footer stays above other content
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonActive: {
    opacity: 1,
  },
  footerButtonText: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
  },
  footerButtonTextActive: {
    color: '#fff',
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  // Add this style for the live button
  liveButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF375F', // Red color for live streaming
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
})

export default MediaFooter
