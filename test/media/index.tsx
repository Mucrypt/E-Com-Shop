//src>app>media>index.tsx
import React from 'react'
import { View, StatusBar, Platform } from 'react-native'
import SocialFeed from './components/social-feed/SocialFeed'
import Header from './layouts/Header'
import BottomNavigation from './components/social-feed/BottomNavigation'
import { styles } from '../../src/styles/SocialFeed.styles'

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />
      <Header />
      <SocialFeed />
      <BottomNavigation />
    </View>
  )
}

export default Home
