import React from 'react'
import { View, StatusBar, StyleSheet } from 'react-native'
import { router } from 'expo-router'

// Import the enhanced media screen
import MediaScreen from '../(media)/index'

const SocialMediaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      <MediaScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
})

export default SocialMediaScreen