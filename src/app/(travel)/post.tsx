// app/(travel)/post.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function TravelPostScreen() {
  return (
    <View style={styles.root}>
      <FontAwesome name="home" size={40} color="#F5C451" />
      <Text style={styles.title}>List your place or service</Text>
      <Text style={styles.text}>
        Hotels, guest houses, apartments, travel agencies and drivers can create
        listings here and reach Mukulah travellers globally.
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start listing (demo)</Text>
      </TouchableOpacity>
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
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#050509',
    fontWeight: '700',
    fontSize: 13,
  },
})
