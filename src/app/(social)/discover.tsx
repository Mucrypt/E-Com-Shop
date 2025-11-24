import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors, Typography, Spacing, Shadows } from '../../constants'
import SocialDiscovery from '../../components/main/SocialDiscovery'

const DiscoverScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity 
          style={styles.connectionsButton}
          onPress={() => router.push('/screens/connections')}
        >
          <FontAwesome name="users" size={18} color={Colors.primary[500]} />
          <Text style={styles.connectionsText}>My Connections</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/screens/connections')}
        >
          <View style={styles.actionIcon}>
            <FontAwesome name="users" size={24} color={Colors.primary[500]} />
          </View>
          <Text style={styles.actionTitle}>Manage Connections</Text>
          <Text style={styles.actionSubtitle}>View followers, following & requests</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/screens/people-discovery')}
        >
          <View style={styles.actionIcon}>
            <FontAwesome name="user-plus" size={24} color={Colors.status.success} />
          </View>
          <Text style={styles.actionTitle}>Find People</Text>
          <Text style={styles.actionSubtitle}>Discover new connections</Text>
        </TouchableOpacity>
      </View>

      {/* Social Discovery Component */}
      <SocialDiscovery />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingTop: 50,
    paddingBottom: Spacing[4],
    backgroundColor: Colors.background.primary,
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  connectionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: 20,
    gap: Spacing[2],
  },
  connectionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    gap: Spacing[3],
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[3],
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
})

export default DiscoverScreen