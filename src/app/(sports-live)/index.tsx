// app/sports-live/index.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import {
  LEAGUES,
  League,
  getLeaguesBySport,
} from '../../lib/sports/leaguesData'
import { useSportsSidebar } from '../../lib/sports/SportsSidebarContext'
import NavigationHeader from '../../components/common/NavigationHeader'
import { Colors, Spacing, Typography } from '../../constants'

type SportKey = 'football' | 'basketball' | 'tennis' | 'formula1' | 'esports'

type SportTab = {
  key: SportKey
  label: string
  icon: string
}

const SPORTS: SportTab[] = [
  { key: 'football', label: 'Football', icon: 'soccer' },
  { key: 'basketball', label: 'Basketball', icon: 'basketball' },
  { key: 'tennis', label: 'Tennis', icon: 'tennis' },
  { key: 'formula1', label: 'Formula 1', icon: 'racing-helmet' },
  { key: 'esports', label: 'Esports', icon: 'controller-classic-outline' },
]

const DATES = [
  { key: 'live', labelTop: 'LIVE', labelBottom: '' },
  { key: 'thu', labelTop: 'THU', labelBottom: '20 NOV' },
  { key: 'fri', labelTop: 'FRI', labelBottom: '21 NOV' },
  { key: 'today', labelTop: 'TODAY', labelBottom: '22 NOV' },
  { key: 'sun', labelTop: 'SUN', labelBottom: '23 NOV' },
  { key: 'mon', labelTop: 'MON', labelBottom: '24 NOV' },
]

export default function SportsLiveHomeScreen() {
  const [activeSport, setActiveSport] = useState<SportKey>('football')
  const [activeDateKey, setActiveDateKey] = useState<string>('today')
  const { toggleSidebar } = useSportsSidebar()

  const leaguesForSport: League[] = getLeaguesBySport(activeSport)

  return (
    <View style={styles.root}>
      <NavigationHeader
        title="Mukulah Live"
        backgroundColor={Colors.background.primary}
        textColor={Colors.text.primary}
        statusBarStyle="light-content"
        rightComponent={
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.roundIcon}
              onPress={toggleSidebar}
            >
              <MaterialCommunityIcons
                name='menu'
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundIcon}>
              <MaterialCommunityIcons
                name='bell-outline'
                size={18}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.roundIcon}>
              <MaterialCommunityIcons
                name='cog-outline'
                size={18}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Sport tabs */}
        <View style={styles.sectionMarginBottom}>
          <FlatList
            horizontal
            data={SPORTS}
            keyExtractor={(item) => item.key}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item }) => {
              const active = item.key === activeSport
              return (
                <TouchableOpacity
                  style={[
                    styles.sportChip,
                    active && styles.sportChipActive,
                  ]}
                  onPress={() => setActiveSport(item.key)}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={20}
                    color={active ? Colors.background.primary : Colors.text.primary}
                  />
                  <Text
                    style={[
                      styles.sportChipLabel,
                      active && styles.sportChipLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            }}
          />
        </View>

        {/* Hero promo banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>
              Live scores for every sport
            </Text>
            <Text style={styles.promoSubtitle}>
              Follow your favourite teams, get instant goal alerts and deep
              stats — all in one control center.
            </Text>
          </View>
          <TouchableOpacity style={styles.promoCta}>
            <Text style={styles.promoCtaText}>Personalize</Text>
          </TouchableOpacity>
        </View>

        {/* Date selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateStrip}
        >
          {DATES.map((date) => {
            const active = date.key === activeDateKey
            return (
              <TouchableOpacity
                key={date.key}
                style={[styles.datePill, active && styles.datePillActive]}
                onPress={() => setActiveDateKey(date.key)}
              >
                <Text
                  style={[
                    styles.dateTop,
                    active && styles.dateTopActive,
                  ]}
                >
                  {date.labelTop}
                </Text>
                {date.labelBottom ? (
                  <Text
                    style={[
                      styles.dateBottom,
                      active && styles.dateBottomActive,
                    ]}
                  >
                    {date.labelBottom}
                  </Text>
                ) : null}
              </TouchableOpacity>
            )
          })}

          <TouchableOpacity style={styles.calendarButton}>
            <MaterialCommunityIcons
              name='calendar-month-outline'
              size={20}
              color={Colors.text.secondary}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* League sections */}
        <View style={styles.leagueList}>
          {leaguesForSport.map((league) => (
            <TouchableOpacity
              key={league.id}
              activeOpacity={0.85}
              onPress={() =>
                router.push(`/sports-live/league/${league.id}`)
              }
              style={styles.leagueCard}
            >
              <View style={styles.leagueHeader}>
                <View>
                  <Text style={styles.leagueName}>{league.name}</Text>
                  <Text style={styles.leagueCountry}>{league.country}</Text>
                </View>
                <View style={styles.leagueHeaderRight}>
                  <Text style={styles.leagueSeeAll}>Details</Text>
                  <MaterialCommunityIcons
                    name='chevron-right'
                    size={22}
                    color={Colors.text.secondary}
                  />
                </View>
              </View>

              {league.matches.slice(0, 3).map((match) => (
                <View key={match.id} style={styles.matchRow}>
                  <View style={styles.matchStatusColumn}>
                    <Text
                      style={[
                        styles.matchStatus,
                        match.status === 'LIVE' && styles.matchStatusLive,
                      ]}
                    >
                      {match.status}
                    </Text>
                    {match.minute && (
                      <Text style={styles.matchMinute}>{match.minute}</Text>
                    )}
                  </View>

                  <View style={styles.matchTeamsColumn}>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamName}>
                        {match.homeTeam}
                      </Text>
                      <Text style={styles.teamScore}>
                        {match.homeScore ?? '-'}
                      </Text>
                    </View>
                    <View style={styles.teamRow}>
                      <Text style={styles.teamName}>
                        {match.awayTeam}
                      </Text>
                      <Text style={styles.teamScore}>
                        {match.awayScore ?? '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.matchStarButton}>
                    <MaterialCommunityIcons
                      name='star-outline'
                      size={20}
                      color={Colors.text.muted}
                    />
                  </View>
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom info banner */}
        <View style={styles.bottomAd}>
          <Text style={styles.bottomAdTitle}>
            Powered by Mukulah Sports Engine
          </Text>
          <Text style={styles.bottomAdSubtitle}>
            Soon this hub will connect to real-time APIs for football,
            basketball, F1, esports and more — with live odds and deep
            stats.
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background.secondary }, // Brighter background
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing[4], // 16px
    paddingTop: Spacing[3], // 12px
    paddingBottom: Spacing[6], // 24px
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2], // 8px
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3], // 12px
  },
  appTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2], // 8px
  },
  roundIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.quaternary, // Higher contrast
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionMarginBottom: { marginBottom: Spacing[3] }, // 12px

  sportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4], // 16px
    paddingVertical: Spacing[2], // 8px
    borderRadius: 999,
    backgroundColor: Colors.background.tertiary, // Higher contrast
    borderWidth: 1,
    borderColor: Colors.border.secondary, // Brighter border
  },
  sportChipActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  sportChipLabel: {
    marginLeft: Spacing[2], // 8px
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    color: Colors.text.primary,
  },
  sportChipLabelActive: { color: Colors.background.primary },

  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.tertiary,
    borderRadius: 14,
    padding: Spacing[4], // 16px
    marginBottom: Spacing[4], // 16px
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  promoLeft: { flex: 1, paddingRight: Spacing[3] }, // 12px
  promoTitle: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing[1], // 4px
  },
  promoSubtitle: { color: Colors.text.muted, fontSize: Typography.sizes.xs },
  promoCta: {
    backgroundColor: Colors.primary[500],
    borderRadius: 999,
    paddingHorizontal: Spacing[4], // 16px
    paddingVertical: Spacing[2], // 8px
  },
  promoCtaText: {
    color: Colors.background.primary,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },

  dateStrip: {
    alignItems: 'center',
    paddingVertical: Spacing[1], // 4px
    paddingRight: Spacing[3], // 12px
    gap: Spacing[2], // 8px
  },
  datePill: {
    width: 72,
    borderRadius: 999,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    paddingVertical: Spacing[2], // 8px
    marginRight: Spacing[2], // 8px
    alignItems: 'center',
  },
  datePillActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  dateTop: { fontSize: Typography.sizes.xs, fontWeight: Typography.weights.bold, color: Colors.text.muted },
  dateTopActive: { color: Colors.background.primary },
  dateBottom: { fontSize: 10, color: Colors.text.disabled },
  dateBottomActive: { color: Colors.background.tertiary },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[1], // 4px
  },

  leagueList: { marginTop: Spacing[3], gap: Spacing[3] }, // 12px
  leagueCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 14,
    paddingHorizontal: Spacing[4], // 16px
    paddingVertical: Spacing[3], // 12px
    borderWidth: 1,
    borderColor: Colors.border.primary,
    marginBottom: Spacing[3], // 12px
  },
  leagueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2], // 8px
  },
  leagueHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leagueName: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
  },
  leagueCountry: { color: Colors.text.muted, fontSize: Typography.sizes.xs },
  leagueSeeAll: {
    fontSize: Typography.sizes.xs,
    color: Colors.primary[500],
    marginRight: Spacing[1], // 4px
  },

  matchRow: {
    flexDirection: 'row',
    paddingVertical: Spacing[2], // 8px
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  matchStatusColumn: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  matchStatus: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.text.muted,
  },
  matchStatusLive: { color: Colors.special.live },
  matchMinute: {
    marginTop: Spacing[1], // 4px
    fontSize: 10,
    color: Colors.primary[500],
  },
  matchTeamsColumn: { flex: 1, paddingLeft: Spacing[1] }, // 4px
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[1], // 4px
  },
  teamName: { fontSize: Typography.sizes.sm, color: Colors.text.primary },
  teamScore: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.bold, color: Colors.text.primary },
  matchStarButton: {
    width: 32,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  bottomAd: {
    marginTop: Spacing[4], // 16px
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    padding: Spacing[3], // 12px
    borderWidth: 1,
    borderColor: Colors.border.secondary,
  },
  bottomAdTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.text.primary,
    marginBottom: Spacing[1], // 4px
  },
  bottomAdSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.muted,
  },
})
