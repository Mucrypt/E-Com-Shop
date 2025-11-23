import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

const { width } = Dimensions.get('window')

interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  verified: boolean
  stats: {
    followers: string
    earnings: string
    growth: string
  }
  specialty: string
  achievements: string[]
  isRising: boolean
}

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'CryptoMaster',
    category: 'Crypto Hub',
    avatar: '₿',
    verified: true,
    stats: {
      followers: '2.4M',
      earnings: '$847K',
      growth: '+234%',
    },
    specialty: 'DeFi Trading Expert',
    achievements: ['Top Trader 2024', 'Million Dollar Club'],
    isRising: true,
  },
  {
    id: '2',
    name: 'TravelVlogger',
    category: 'Travel',
    avatar: '🌍',
    verified: true,
    stats: {
      followers: '1.8M',
      earnings: '$456K',
      growth: '+189%',
    },
    specialty: 'Adventure Content Creator',
    achievements: ['Global Explorer', 'Content King'],
    isRising: false,
  },
  {
    id: '3',
    name: 'TechRecruiterPro',
    category: 'Jobs',
    avatar: '💼',
    verified: true,
    stats: {
      followers: '890K',
      earnings: '$234K',
      growth: '+156%',
    },
    specialty: 'Career Development Coach',
    achievements: ['Job Placement Expert', 'Career Mentor'],
    isRising: true,
  },
  {
    id: '4',
    name: 'ShopInfluencer',
    category: 'Marketplace',
    avatar: '🛍️',
    verified: true,
    stats: {
      followers: '3.2M',
      earnings: '$1.2M',
      growth: '+312%',
    },
    specialty: 'Product Review Specialist',
    achievements: ['Review Champion', 'Sales Leader'],
    isRising: false,
  },
  {
    id: '5',
    name: 'MediaProducer',
    category: 'Media',
    avatar: '🎬',
    verified: true,
    stats: {
      followers: '5.1M',
      earnings: '$2.3M',
      growth: '+445%',
    },
    specialty: 'Viral Content Creator',
    achievements: ['Billion Views Club', 'Creator of the Year'],
    isRising: true,
  },
]

const FeaturedCreatorsSpotlight: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slideAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(1)).current
  const glowAnim = useRef(new Animated.Value(0)).current

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockCreators.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mockCreators.length) % mockCreators.length)
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        // Swipe right - go to previous
        goToPrevious()
      } else if (gestureState.dx < -50) {
        // Swipe left - go to next
        goToNext()
      }
    },
  })

  useEffect(() => {
    // Slide and scale animation when creator changes
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    })

    // Glow animation for rising creators
    if (mockCreators[currentIndex].isRising) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [currentIndex])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Hub': return Colors.status.warning
      case 'Travel': return Colors.status.info
      case 'Jobs': return Colors.status.success
      case 'Marketplace': return Colors.primary[500]
      case 'Media': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const currentCreator = mockCreators[currentIndex]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="star" size={20} color={Colors.primary[500]} />
          <Text style={styles.title}>Creator Spotlight</Text>
          {currentCreator.isRising && (
            <View style={styles.risingBadge}>
              <FontAwesome name="arrow-up" size={12} color={Colors.status.success} />
              <Text style={styles.risingText}>Rising</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.exploreButton}>
          <Text style={styles.exploreText}>Explore</Text>
          <FontAwesome name="chevron-right" size={12} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View 
          {...panResponder.panHandlers}
          style={[
            styles.creatorCard,
            {
              transform: [{ translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10],
              }) }, { scale: scaleAnim }],
              borderColor: currentCreator.isRising ? Colors.primary[500] : Colors.border.primary,
            },
          ]}
        >
        {currentCreator.isRising && (
          <Animated.View 
            style={[
              styles.glowOverlay,
              { 
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.2],
                }),
              }
            ]} 
          />
        )}
        <View style={styles.cardHeader}>
          <View style={styles.creatorInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{currentCreator.avatar}</Text>
              {currentCreator.verified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome name="check" size={10} color={Colors.background.primary} />
                </View>
              )}
            </View>
            <View style={styles.creatorDetails}>
              <Text style={styles.creatorName}>{currentCreator.name}</Text>
              <Text style={styles.specialty}>{currentCreator.specialty}</Text>
            </View>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(currentCreator.category)}20` }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(currentCreator.category) }]}>
              {currentCreator.category}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentCreator.stats.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.status.success }]}>
              {currentCreator.stats.earnings}
            </Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.status.info }]}>
              {currentCreator.stats.growth}
            </Text>
            <Text style={styles.statLabel}>Growth</Text>
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.achievementsTitle}>Achievements</Text>
          <View style={styles.achievementsList}>
            {currentCreator.achievements.map((achievement, index) => (
              <View key={index} style={styles.achievementBadge}>
                <FontAwesome name="trophy" size={12} color={Colors.primary[500]} />
                <Text style={styles.achievementText}>{achievement}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.followButton}>
          <FontAwesome name="user-plus" size={14} color={Colors.background.primary} />
          <Text style={styles.followButtonText}>Follow Creator</Text>
        </TouchableOpacity>
      </Animated.View>
      </View>

      <View style={styles.indicators}>
        {mockCreators.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentIndex ? Colors.primary[500] : Colors.overlay.light10,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
            onPress={() => setCurrentIndex(index)}
          />
        ))}
      </View>
      
      {/* Swipe hint */}
      <View style={styles.swipeHint}>
        <FontAwesome name="hand-o-right" size={12} color={Colors.text.muted} />
        <Text style={styles.swipeHintText}>Swipe or tap to explore creators</Text>
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
  risingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.status.success}20`,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    marginLeft: Spacing[2],
  },
  risingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.status.success,
    marginLeft: Spacing[1],
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginRight: Spacing[1],
  },
  cardContainer: {
    position: 'relative',
  },
  creatorCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 20,
    padding: Spacing[5],
    borderWidth: 2,
    ...Shadows.lg,
    position: 'relative',
  },
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary[500],
    borderRadius: 20,
    zIndex: -1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[3],
  },
  avatarEmoji: {
    fontSize: 32,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary[500],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  specialty: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  categoryBadge: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing[4],
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: Spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border.primary,
  },
  achievementsContainer: {
    marginBottom: Spacing[4],
  },
  achievementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing[2],
  },
  achievementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary[500]}15`,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
    marginRight: Spacing[2],
    marginBottom: Spacing[1],
  },
  achievementText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary[500],
    marginLeft: Spacing[1],
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[3],
    borderRadius: 12,
    ...Shadows.md,
  },
  followButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.background.primary,
    marginLeft: Spacing[2],
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing[4],
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: Spacing[1],
    ...Shadows.sm,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing[2],
  },
  swipeHintText: {
    fontSize: 11,
    color: Colors.text.muted,
    marginLeft: Spacing[1],
    fontWeight: '500',
  },
})

export default FeaturedCreatorsSpotlight