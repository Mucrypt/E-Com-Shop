// app/real-estate/messages.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Feather } from '@expo/vector-icons'

const BG = '#050509'
const CARD = '#0B0F1A'
const MUTED = '#9CA3AF'

export default function RealEstateMessagesScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <Feather name='message-square' size={30} color='#F9FAFB' />
        <Text style={styles.title}>Conversations</Text>
        <Text style={styles.subtitle}>
          Here you’ll chat with agents, landlords and buyers about rentals and
          sales. We’ll later plug this into your global Mukulah messaging
          system.
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
    borderRadius: 16,
    padding: 20,
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
    marginTop: 8,
  },
})
