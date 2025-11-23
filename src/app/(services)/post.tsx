import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ServicesPostScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Post a new service</Text>
      <Text style={styles.subtitle}>
        Here you will create world-class service listings with pricing, packages
        and portfolios. We’ll wire this to your backend later.
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
