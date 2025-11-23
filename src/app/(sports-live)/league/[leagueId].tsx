// app/sports-live/league/[leagueId].tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getLeagueById } from '../../../lib/sports/leaguesData'
import { Colors, Spacing, Typography } from '../../../constants'

export default function LeagueDetailScreen() {
  const { leagueId } = useLocalSearchParams<{ leagueId: string }>()
  const league = leagueId ? getLeagueById(String(leagueId)) : undefined

  if (!league) {
    return (
      <View style={styles.root}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.roundIcon}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
          <Text style={styles.appTitle}>League not found</Text>
          <View style={{ width: 32 }} />
        </View>

        <View style={styles.centerContent}>
          <Text style={styles.notFoundText}>
            We could not find this league. It might be a test id.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.roundIcon}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>

          <Text style={styles.appTitle}>{league.name}</Text>

          <TouchableOpacity style={styles.roundIcon}>
            <MaterialCommunityIcons
              name="star-outline"
              size={20}
              color={Colors.primary[500]}
            />
          </TouchableOpacity>
        </View>

        {/* League meta */}
        <View style={styles.leagueHeader}>
          <View>
            <Text style={styles.leagueName}>{league.name}</Text>
            <Text style={styles.leagueCountry}>{league.country}</Text>
          </View>
          <View style={styles.leagueMetaRight}>
            <Text style={styles.leagueTag}>{league.sport.toUpperCase()}</Text>
          </View>
        </View>

        {/* Section tabs (placeholder) */}
        <View style={styles.sectionTabs}>
          <Text style={[styles.sectionTab, styles.sectionTabActive]}>
            Matches
          </Text>
          <Text style={styles.sectionTab}>Table</Text>
          <Text style={styles.sectionTab}>News</Text>
        </View>

        {/* Matches list */}
        <View style={styles.matchesList}>
          {league.matches.map((m) => (
            <View key={m.id} style={styles.matchRow}>
              <View style={styles.matchStatusColumn}>
                <Text
                  style={[
                    styles.matchStatus,
                    m.status === 'LIVE' && styles.matchStatusLive,
                  ]}
                >
                  {m.status}
                </Text>
                {m.minute && (
                  <Text style={styles.matchMinute}>{m.minute}</Text>
                )}
              </View>

              <View style={styles.matchTeamsColumn}>
                <View style={styles.teamRow}>
                  <Text style={styles.teamName}>{m.homeTeam}</Text>
                  <Text style={styles.teamScore}>{m.homeScore ?? '-'}</Text>
                </View>
                <View style={styles.teamRow}>
                  <Text style={styles.teamName}>{m.awayTeam}</Text>
                  <Text style={styles.teamScore}>{m.awayScore ?? '-'}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.moreButton}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={20}
                  color={Colors.text.muted}
                />
              </TouchableOpacity>
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
    paddingTop: Spacing[3], // 12px
    paddingBottom: Spacing[6], // 24px
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3], // 12px
  },
  roundIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.quaternary, // Higher contrast
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },

  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[6], // 24px
  },
  notFoundText: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
  },

  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3], // 12px
  },
  leagueName: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  leagueCountry: {
    color: Colors.text.muted,
    fontSize: Typography.sizes.xs,
  },
  leagueMetaRight: {},
  leagueTag: {
    paddingHorizontal: Spacing[3], // 12px
    paddingVertical: Spacing[1], // 4px
    borderRadius: 999,
    backgroundColor: Colors.background.quaternary, // Higher contrast tag
    color: Colors.primary[500],
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },

  sectionTabs: {
    flexDirection: 'row',
    gap: Spacing[4], // 16px
    marginTop: Spacing[3], // 12px
    marginBottom: Spacing[3], // 12px
  },
  sectionTab: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    fontWeight: Typography.weights.semiBold,
  },
  sectionTabActive: {
    color: Colors.primary[500],
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary[500],
    paddingBottom: Spacing[1], // 4px
  },

  matchesList: {
    borderRadius: 14,
    backgroundColor: Colors.background.tertiary, // Higher contrast
    borderWidth: 1,
    borderColor: Colors.border.secondary, // Brighter border
  },
  matchRow: {
    flexDirection: 'row',
    paddingVertical: Spacing[3], // 12px
    paddingHorizontal: Spacing[3], // 12px
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  matchStatusColumn: {
    width: 52,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  matchStatus: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.muted,
  },
  matchStatusLive: {
    color: Colors.status.error,
  },
  matchMinute: {
    marginTop: Spacing[1], // 4px
    fontSize: Typography.sizes.xs,
    color: Colors.primary[500],
  },
  matchTeamsColumn: {
    flex: 1,
    paddingLeft: Spacing[2], // 8px
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[1], // 4px
  },
  teamName: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
  },
  teamScore: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  moreButton: {
    width: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
})
