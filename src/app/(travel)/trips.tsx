// app/(travel)/trips.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function TripsScreen() {
  return (
    <View style={styles.root}>
      <FontAwesome name="suitcase" size={40} color="#4B5563" />
      <Text style={styles.title}>Your trips</Text>
      <Text style={styles.text}>
        When you book stays, transport or experiences, they will appear here as a
        single smart itinerary.
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
