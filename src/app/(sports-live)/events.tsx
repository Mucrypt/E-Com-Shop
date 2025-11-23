// app/sports-live/events.tsx
import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors, Spacing, Typography } from '../../constants'

type EventItem = {
  id: string
  title: string
  subtitle: string
  date: string
  tag: string
}

const MOCK_EVENTS: EventItem[] = [
  {
    id: 'cl-final',
    title: 'UEFA Champions League Final Watch Party',
    subtitle: 'Live community rooms + multi-camera highlights.',
    date: 'May 28, 2026',
    tag: 'Football',
  },
  {
    id: 'nba-finals',
    title: 'NBA Finals – Game 7 Interactive Stream',
    subtitle: 'Real-time polls, odds, and fan reactions.',
    date: 'June 12, 2026',
    tag: 'Basketball',
  },
  {
    id: 'f1-monza',
    title: 'Formula 1 – Monza Live Telemetry',
    subtitle: 'Track sectors, overtakes and tyre strategy in real time.',
    date: 'Sept 4, 2026',
    tag: 'Formula 1',
  },
]

export default function SportsEventsScreen() {
  return (
    <View style={styles.root}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <MaterialCommunityIcons
            name="calendar-star"
            size={26}
            color={Colors.primary[500]}
          />
          <Text style={styles.title}>Live Sports Events</Text>
        </View>

        <Text style={styles.subtitle}>
          Soon you’ll be able to book live rooms, watch parties, contests and
          more — all connected with Mukulah media & crypto hubs.
        </Text>

        <View style={styles.list}>
          {MOCK_EVENTS.map((e) => (
            <View key={e.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTag}>{e.tag}</Text>
                <Text style={styles.cardDate}>{e.date}</Text>
              </View>
              <Text style={styles.cardTitle}>{e.title}</Text>
              <Text style={styles.cardSubtitle}>{e.subtitle}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background.secondary, // Brighter background
  },
  scrollContent: {
    paddingHorizontal: Spacing[4], // 16px
    paddingTop: Spacing[4], // 16px
    paddingBottom: Spacing[6], // 24px
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2], // 8px
    gap: Spacing[2], // 8px
  },
  title: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  subtitle: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing[4], // 16px
  },
  list: {
    gap: Spacing[3], // 12px
  },
  card: {
    backgroundColor: Colors.background.tertiary, // Higher contrast card
    borderRadius: 14,
    padding: Spacing[4], // 16px
    borderWidth: 1,
    borderColor: Colors.border.secondary, // Brighter border
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[2], // 8px
  },
  cardTag: {
    paddingHorizontal: Spacing[3], // 12px
    paddingVertical: Spacing[1], // 4px
    borderRadius: 999,
    backgroundColor: Colors.background.quaternary, // Higher contrast tag background
    color: Colors.primary[500],
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  cardDate: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.xs,
  },
  cardTitle: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing[1], // 4px
  },
  cardSubtitle: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.xs,
  },
})
