import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface MediaHeaderProps {
  onSearch?: () => void
  onNotifications?: () => void
  onMessages?: () => void
}

const MediaHeader: React.FC<MediaHeaderProps> = ({
  onSearch = () => {},
  onNotifications = () => {},
  onMessages = () => {},
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Text style={styles.headerLogo}>Mukulah</Text>
      </TouchableOpacity>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerButton} onPress={onSearch}>
          <Ionicons name='search' size={24} color='#fff' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onNotifications}>
          <Ionicons name='notifications-outline' size={24} color='#fff' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onMessages}>
          <Ionicons name='chatbubble-ellipses-outline' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLogo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 20,
  },
})

export default MediaHeader
