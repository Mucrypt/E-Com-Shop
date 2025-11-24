import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar } from 'react-native'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import PulseSearchModal from './PulseSearchModal'

interface MediaHeaderProps {
  scrollY?: Animated.Value
}

const MediaHeader: React.FC<MediaHeaderProps> = ({
  scrollY,
}) => {
  const [activeTab, setActiveTab] = useState('Pulse')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const navigateToMain = () => {
    router.push('/(main)')
  }

  const tabs = ['Pulse', 'Universe', 'Live', 'Create']

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View style={[
        styles.header,
        scrollY && {
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 0.98],
            extrapolate: 'clamp',
          })
        }
      ]}>
        {/* Left Section - Main Button */}
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={navigateToMain}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <FontAwesome name="home" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Section - Navigation Tabs */}
        <View style={styles.centerSection}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tabButton}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === tab && styles.activeTabText
                ]}
              >
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Right Section - Search Icon */}
        <View style={styles.rightSection}>
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => setIsSearchVisible(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="search" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Search Modal */}
      <PulseSearchModal 
        visible={isSearchVisible}
        onClose={() => setIsSearchVisible(false)}
      />
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 15,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  leftSection: {
    flex: 0.25,
    alignItems: 'flex-start',
    paddingRight: 12,
  },
  centerSection: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  rightSection: {
    flex: 0.25,
    alignItems: 'flex-end',
    paddingLeft: 12,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mainButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 3,
    position: 'relative',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 1,
    width: 20,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
})

export default MediaHeader
