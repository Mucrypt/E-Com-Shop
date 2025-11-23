import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type SportsProps = {
  sportTitle: string
  teamA: string
  teamB: string
  score?: string
  status: string
}

type CryptoProps = {
  pair: string
  price: string
  change: string
}

type Props = {
  sports: SportsProps
  crypto: CryptoProps
}

const SportsCryptoWidget: React.FC<Props> = ({ sports, crypto }) => {
  const isPositive = crypto.change.trim().startsWith('+')

  return (
    <View style={styles.container}>
      {/* Sports side */}
      <View style={styles.block}>
        <Text style={styles.blockLabel}>Live Scores</Text>
        <Text style={styles.sportTitle}>{sports.sportTitle}</Text>
        <View style={styles.teamsRow}>
          <Text style={styles.teamText}>{sports.teamA}</Text>
          <Text style={styles.vsText}>vs</Text>
          <Text style={styles.teamText}>{sports.teamB}</Text>
        </View>
        {sports.score && <Text style={styles.scoreText}>{sports.score}</Text>}
        <Text style={styles.statusText}>{sports.status}</Text>
      </View>

      <View style={styles.divider} />

      {/* Crypto side */}
      <View style={styles.block}>
        <Text style={styles.blockLabel}>Crypto Hub</Text>
        <Text style={styles.pairText}>{crypto.pair}</Text>
        <Text style={styles.priceText}>{crypto.price}</Text>
        <Text
          style={[
            styles.changeText,
            { color: isPositive ? '#22C55E' : '#F97316' },
          ]}
        >
          {crypto.change}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    padding: 12,
    marginBottom: 14,
  },
  block: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: '#1F2937',
    marginHorizontal: 10,
  },
  blockLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  sportTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  teamText: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  vsText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F5C451',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  pairText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  changeText: {
    fontSize: 11,
    marginTop: 2,
  },
})

export default SportsCryptoWidget
