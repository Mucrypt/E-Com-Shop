// app/(real-estate)/saved.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

const BG = '#050509'
const CARD = '#0B0F1A'
const MUTED = '#9CA3AF'

export default function SavedHomesScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Feather name='heart' size={28} color='#F9FAFB' />
        <Text style={styles.title}>Your saved properties</Text>
        <Text style={styles.subtitle}>
          Save apartments, houses and land you love, and we’ll keep them here
          for quick access.
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111827',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
  },
})
