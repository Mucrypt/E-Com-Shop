import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover</Text>
      <Text style={styles.text}>
        Explore trending cryptocurrencies, new tokens, and market insights.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#9CA3AF',
  },
})