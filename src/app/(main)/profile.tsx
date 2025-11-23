import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ProfileScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Your Space</Text>
      <Text style={styles.subtitle}>
        This will become the control center for identity, privacy and data
        ownership.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050509', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#F9FAFB', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#9CA3AF' },
})
