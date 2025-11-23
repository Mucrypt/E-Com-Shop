import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ServicesSavedScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Saved services</Text>
      <Text style={styles.subtitle}>
        Soon you’ll find all the freelancers and services you bookmarked here.
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
