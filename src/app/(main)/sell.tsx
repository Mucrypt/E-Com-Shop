import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function SellScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Sell on Mukulah</Text>
      <Text style={styles.subtitle}>
        Soon you’ll be able to list products, services and second-hand items
        from one powerful place.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050509', padding: 20 },
  title: { fontSize: 22, fontWeight: '800', color: '#F9FAFB', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#9CA3AF' },
})
