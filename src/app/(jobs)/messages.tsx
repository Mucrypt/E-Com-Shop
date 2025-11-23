// app/jobs/messages.tsx
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'

export default function JobMessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity style={styles.iconButton}>
          <FontAwesome name='filter' size={16} color='#E5E7EB' />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Here you’ll see conversations between candidates and companies about
        applications, interviews and offers.
      </Text>

      <View style={styles.emptyCard}>
        <FontAwesome name='comments-o' size={32} color='#9CA3AF' />
        <Text style={styles.emptyTitle}>No conversations yet</Text>
        <Text style={styles.emptyText}>
          Apply for a job or post a new position to start receiving messages
          directly inside Mukulah Jobs.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Browse jobs</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconButton: {
    padding: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 20,
  },
  emptyCard: {
    marginTop: 20,
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#111827',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
    marginTop: 10,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#F5C451',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#050509',
  },
})
