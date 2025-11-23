import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function JobProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job profile</Text>
      <Text style={styles.text}>
        Build your global job profile, upload your CV and let companies discover
        you on Mukulah.
      </Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Complete profile</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050509',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  button: {
    alignSelf: 'flex-start',
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
