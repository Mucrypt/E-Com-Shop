import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function MessagesScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Messages</Text>
      <Text style={styles.subtitle}>
        Chat with buyers, sellers and creators. We’ll build a smart inbox here.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050509', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#F9FAFB', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#9CA3AF' },
})
