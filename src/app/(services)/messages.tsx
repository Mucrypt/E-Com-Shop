import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ServicesMessagesScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Service messages</Text>
      <Text style={styles.subtitle}>
        All conversations between clients and freelancers will live here:
        proposals, contracts, files and more.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
    padding: 16,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
  },
})
