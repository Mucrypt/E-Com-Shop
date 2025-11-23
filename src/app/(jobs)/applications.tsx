import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ApplicationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My applications</Text>
      <Text style={styles.text}>
        Track every role you’ve applied for, application status, interviews and
        feedback — all in one place.
      </Text>
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
  },
})
