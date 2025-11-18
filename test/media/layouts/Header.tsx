import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import AnimatedButton from '../components/ui/AnimatedButton'
import { styles } from '../../../src/styles/Header.styles'

const Header: React.FC = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      {/* Logo */}
      <AnimatedButton onPress={() => {}} style={styles.logoButton}>
        <Text style={styles.logoText}>Mukulah</Text>
      </AnimatedButton>

      {/* Right actions */}
      <View style={styles.actions}>
        <AnimatedButton
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Search')
          }}
          style={styles.actionButton}
          scaleTo={0.9}
        >
          <Ionicons name='search' size={24} color='#fff' />
        </AnimatedButton>

        <AnimatedButton
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Notifications')
          }}
          style={styles.actionButton}
          scaleTo={0.9}
        >
          <Ionicons name='notifications-outline' size={24} color='#fff' />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </AnimatedButton>

        <AnimatedButton
          onPress={() => {
            // @ts-ignore
            navigation.navigate('Messages')
          }}
          style={styles.actionButton}
          scaleTo={0.9}
        >
          <Ionicons name='chatbubble-ellipses-outline' size={24} color='#fff' />
        </AnimatedButton>
      </View>
    </View>
  )
}

export default Header
