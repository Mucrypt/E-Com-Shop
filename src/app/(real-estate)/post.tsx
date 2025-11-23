// app/real-estate/post.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'

const BG = '#050509'
const CARD = '#0B0F1A'
const ACCENT = '#C084FC'
const MUTED = '#9CA3AF'

export default function PostPropertyScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Feather name='upload-cloud' size={32} color={ACCENT} />
        <Text style={styles.title}>Post your property</Text>
        <Text style={styles.subtitle}>
          In a few steps you’ll be able to publish apartments, rooms, villas,
          land or commercial spaces and reach buyers worldwide.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Start listing</Text>
        </TouchableOpacity>
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
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111827',
  },
  title: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  subtitle: {
    color: MUTED,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 18,
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  buttonText: {
    color: BG,
    fontSize: 13,
    fontWeight: '700',
  },
})
