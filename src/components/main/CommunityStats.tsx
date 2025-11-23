import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

interface CommunityMetrics {
  activeUsers: {
    current: string
    growth: string
    isPositive: boolean
  }
  transactions: {
    current: string
    volume: string
    isPositive: boolean
  }
  contentCreated: {
    current: string
    growth: string
    isPositive: boolean
  }
  earnings: {
    current: string
    growth: string
    isPositive: boolean
  }
}

const mockMetrics: CommunityMetrics = {
  activeUsers: {
    current: '2.4M',
    growth: '+12.5%',
    isPositive: true,
  },
  transactions: {
    current: '847K',
    volume: '$23.4M',
    isPositive: true,
  },
  contentCreated: {
    current: '156K',
    growth: '+34.2%',
    isPositive: true,
  },
  earnings: {
    current: '$5.7M',
    growth: '+67.8%',
    isPositive: true,
  },
}

const CommunityStats: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<keyof CommunityMetrics>('activeUsers')
  const pulseAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Pulse animation for live stats
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    )

    pulseAnimation.start()

    return () => pulseAnimation.stop()
  }, [])

  useEffect(() => {
    // Slide animation when metric changes
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [selectedMetric])

  const getMetricIcon = (metric: keyof CommunityMetrics) => {
    switch (metric) {
      case 'activeUsers': return 'users'
      case 'transactions': return 'exchange'
      case 'contentCreated': return 'file-text'
      case 'earnings': return 'dollar'
      default: return 'circle'
    }
  }

  const getMetricColor = (metric: keyof CommunityMetrics) => {
    switch (metric) {
      case 'activeUsers': return Colors.status.info
      case 'transactions': return Colors.status.success
      case 'contentCreated': return Colors.status.warning
      case 'earnings': return Colors.primary[500]
      default: return Colors.text.secondary
    }
  }

  const getMetricTitle = (metric: keyof CommunityMetrics) => {
    switch (metric) {
      case 'activeUsers': return 'Active Users'
      case 'transactions': return 'Transactions'
      case 'contentCreated': return 'Content Created'
      case 'earnings': return 'Creator Earnings'
      default: return 'Metric'
    }
  }

  const currentMetric = mockMetrics[selectedMetric]
  const metricColor = getMetricColor(selectedMetric)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <FontAwesome name="signal" size={20} color={Colors.primary[500]} />
          </Animated.View>
          <Text style={styles.title}>Community Pulse</Text>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Animated.View style={[styles.mainMetric, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.metricHeader}>
            <View style={[styles.metricIcon, { backgroundColor: `${metricColor}20` }]}>
              <FontAwesome 
                name={getMetricIcon(selectedMetric)} 
                size={24} 
                color={metricColor} 
              />
            </View>
            <View style={styles.metricInfo}>
              <Text style={styles.metricTitle}>{getMetricTitle(selectedMetric)}</Text>
              <View style={styles.metricValueContainer}>
                <Text style={[styles.metricValue, { color: metricColor }]}>
                  {currentMetric.current}
                </Text>
                {selectedMetric === 'transactions' && 'volume' in currentMetric && (
                  <Text style={styles.metricSubValue}>
                    {currentMetric.volume}
                  </Text>
                )}
              </View>
            </View>
          </View>
          
          {(selectedMetric !== 'transactions') && 'growth' in currentMetric && (
            <View style={styles.growthContainer}>
              <FontAwesome 
                name={currentMetric.isPositive ? 'arrow-up' : 'arrow-down'} 
                size={14} 
                color={currentMetric.isPositive ? Colors.status.success : Colors.status.error} 
              />
              <Text style={[
                styles.growthText,
                { color: currentMetric.isPositive ? Colors.status.success : Colors.status.error }
              ]}>
                {currentMetric.growth} this week
              </Text>
            </View>
          )}
        </Animated.View>

        <View style={styles.metricsGrid}>
          {Object.keys(mockMetrics).map((metric) => {
            const typedMetric = metric as keyof CommunityMetrics
            const isSelected = selectedMetric === typedMetric
            const color = getMetricColor(typedMetric)
            
            return (
              <TouchableOpacity
                key={metric}
                style={[
                  styles.miniMetric,
                  {
                    backgroundColor: isSelected ? `${color}15` : Colors.background.tertiary,
                    borderColor: isSelected ? color : Colors.border.primary,
                  },
                ]}
                onPress={() => setSelectedMetric(typedMetric)}
              >
                <FontAwesome 
                  name={getMetricIcon(typedMetric)} 
                  size={16} 
                  color={isSelected ? color : Colors.text.secondary} 
                />
                <Text style={[
                  styles.miniMetricValue,
                  { color: isSelected ? color : Colors.text.primary }
                ]}>
                  {mockMetrics[typedMetric].current}
                </Text>
                <Text style={styles.miniMetricLabel}>
                  {getMetricTitle(typedMetric)}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.additionalStats}>
          <View style={styles.statPill}>
            <FontAwesome name="globe" size={14} color={Colors.status.info} />
            <Text style={styles.statPillText}>195 Countries</Text>
          </View>
          <View style={styles.statPill}>
            <FontAwesome name="clock-o" size={14} color={Colors.status.warning} />
            <Text style={styles.statPillText}>24/7 Active</Text>
          </View>
          <View style={styles.statPill}>
            <FontAwesome name="rocket" size={14} color={Colors.status.success} />
            <Text style={styles.statPillText}>Growing Fast</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing[6],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[1],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: Spacing[2],
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.status.error}20`,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    marginLeft: Spacing[2],
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.status.error,
    marginRight: Spacing[1],
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.status.error,
  },
  statsCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.md,
  },
  mainMetric: {
    marginBottom: Spacing[4],
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  metricInfo: {
    flex: 1,
  },
  metricTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing[1],
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '900',
    marginRight: Spacing[2],
  },
  metricSubValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing[1],
  },
  growthText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  miniMetric: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    borderRadius: 12,
    marginHorizontal: Spacing[1],
    borderWidth: 1,
  },
  miniMetricValue: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing[1],
    marginBottom: Spacing[1],
  },
  miniMetricLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.muted,
    textAlign: 'center',
  },
  additionalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.overlay.light10,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
  },
  statPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginLeft: Spacing[1],
  },
})

export default CommunityStats