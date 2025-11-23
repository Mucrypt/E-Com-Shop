// app/(travel)/saved.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function TravelSavedScreen() {
  return (
    <View style={styles.root}>
      <FontAwesome name="heart-o" size={40} color="#4B5563" />
      <Text style={styles.title}>Saved places</Text>
      <Text style={styles.text}>
        Save destinations, hotels and routes you love. We’ll keep them here for
        your next trip.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  text: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
  },
})
