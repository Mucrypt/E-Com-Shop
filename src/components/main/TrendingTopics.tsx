import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

interface TrendingTopic {
  id: string
  hashtag: string
  category: string
  posts: string
  growth: string
  isHot: boolean
  engagement: string
  description: string
}

const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    hashtag: '#CryptoRevolution',
    category: 'Crypto Hub',
    posts: '245K',
    growth: '+189%',
    isHot: true,
    engagement: '12.4M',
    description: 'Latest blockchain innovations and trading strategies',
  },
  {
    id: '2',
    hashtag: '#WanderlustVibes',
    category: 'Travel',
    posts: '178K',
    growth: '+156%',
    isHot: true,
    engagement: '8.7M',
    description: 'Amazing travel destinations and adventure stories',
  },
  {
    id: '3',
    hashtag: '#RemoteWork',
    category: 'Jobs',
    posts: '156K',
    growth: '+134%',
    isHot: false,
    engagement: '6.2M',
    description: 'Remote job opportunities and career tips',
  },
  {
    id: '4',
    hashtag: '#ShopSmartt',
    category: 'Marketplace',
    posts: '198K',
    growth: '+167%',
    isHot: true,
    engagement: '9.8M',
    description: 'Best deals and product reviews from the community',
  },
  {
    id: '5',
    hashtag: '#ViralContent',
    category: 'Media',
    posts: '289K',
    growth: '+234%',
    isHot: true,
    engagement: '15.6M',
    description: 'Trending videos and creative content inspiration',
  },
  {
    id: '6',
    hashtag: '#PropertyInvest',
    category: 'Real Estate',
    posts: '89K',
    growth: '+78%',
    isHot: false,
    engagement: '4.1M',
    description: 'Real estate investment tips and market insights',
  },
  {
    id: '7',
    hashtag: '#LiveSports',
    category: 'Sports',
    posts: '167K',
    growth: '+145%',
    isHot: true,
    engagement: '7.9M',
    description: 'Live sports updates and community discussions',
  },
]

const TrendingTopics: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic>(mockTrendingTopics[0])
  const slideAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    // Auto-rotate through trending topics
    const interval = setInterval(() => {
      const currentIndex = mockTrendingTopics.findIndex(topic => topic.id === selectedTopic.id)
      const nextIndex = (currentIndex + 1) % mockTrendingTopics.length
      setSelectedTopic(mockTrendingTopics[nextIndex])
    }, 8000)

    return () => clearInterval(interval)
  }, [selectedTopic])

  useEffect(() => {
    // Slide animation when topic changes
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -15,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Pulse animation for hot topics
    if (selectedTopic.isHot) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [selectedTopic])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Hub': return Colors.status.warning
      case 'Travel': return Colors.status.info
      case 'Jobs': return Colors.status.success
      case 'Marketplace': return Colors.primary[500]
      case 'Media': return Colors.status.error
      case 'Real Estate': return Colors.special.featured
      case 'Sports': return Colors.status.warning
      default: return Colors.text.secondary
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Crypto Hub': return 'bitcoin'
      case 'Travel': return 'plane'
      case 'Jobs': return 'briefcase'
      case 'Marketplace': return 'shopping-bag'
      case 'Media': return 'play'
      case 'Real Estate': return 'building'
      case 'Sports': return 'soccer-ball-o'
      default: return 'hashtag'
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="fire" size={20} color={Colors.status.error} />
          <Text style={styles.title}>Trending Now</Text>
          {selectedTopic.isHot && (
            <Animated.View style={[styles.hotBadge, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.hotText}>HOT</Text>
            </Animated.View>
          )}
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>All Topics</Text>
          <FontAwesome name="chevron-right" size={12} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.featuredTopic, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.topicHeader}>
          <View style={styles.topicInfo}>
            <View style={[styles.categoryIcon, { backgroundColor: `${getCategoryColor(selectedTopic.category)}20` }]}>
              <FontAwesome 
                name={getCategoryIcon(selectedTopic.category)} 
                size={20} 
                color={getCategoryColor(selectedTopic.category)} 
              />
            </View>
            <View style={styles.topicDetails}>
              <Text style={styles.hashtag}>{selectedTopic.hashtag}</Text>
              <Text style={styles.topicDescription}>{selectedTopic.description}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{selectedTopic.posts}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.status.success }]}>
              {selectedTopic.growth}
            </Text>
            <Text style={styles.statLabel}>Growth</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.status.info }]}>
              {selectedTopic.engagement}
            </Text>
            <Text style={styles.statLabel}>Engagement</Text>
          </View>
        </View>

        <View style={[styles.categoryBadge, { backgroundColor: `${getCategoryColor(selectedTopic.category)}15` }]}>
          <Text style={[styles.categoryText, { color: getCategoryColor(selectedTopic.category) }]}>
            {selectedTopic.category}
          </Text>
        </View>
      </Animated.View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.topicsScroll}
        contentContainerStyle={styles.topicsScrollContent}
      >
        {mockTrendingTopics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicPill,
              {
                backgroundColor: selectedTopic.id === topic.id 
                  ? `${getCategoryColor(topic.category)}20` 
                  : Colors.background.tertiary,
                borderColor: selectedTopic.id === topic.id 
                  ? getCategoryColor(topic.category) 
                  : Colors.border.primary,
              },
            ]}
            onPress={() => setSelectedTopic(topic)}
          >
            <Text style={[
              styles.pillHashtag,
              { 
                color: selectedTopic.id === topic.id 
                  ? getCategoryColor(topic.category) 
                  : Colors.text.primary 
              }
            ]}>
              {topic.hashtag}
            </Text>
            <View style={styles.pillStats}>
              <Text style={styles.pillPostCount}>{topic.posts}</Text>
              {topic.isHot && (
                <View style={styles.pillHotIndicator}>
                  <FontAwesome name="fire" size={10} color={Colors.status.error} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.exploreButton}>
        <FontAwesome name="search" size={16} color={Colors.background.primary} />
        <Text style={styles.exploreButtonText}>Explore Topic</Text>
      </TouchableOpacity>
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
  hotBadge: {
    backgroundColor: Colors.status.error,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 4,
    marginLeft: Spacing[2],
  },
  hotText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginRight: Spacing[1],
  },
  featuredTopic: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.md,
  },
  topicHeader: {
    marginBottom: Spacing[3],
  },
  topicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[3],
  },
  topicDetails: {
    flex: 1,
  },
  hashtag: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  topicDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing[3],
    backgroundColor: Colors.background.tertiary,
    borderRadius: 12,
    paddingVertical: Spacing[3],
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  topicsScroll: {
    marginBottom: Spacing[4],
  },
  topicsScrollContent: {
    paddingHorizontal: Spacing[1],
  },
  topicPill: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: 12,
    marginRight: Spacing[2],
    borderWidth: 1,
    minWidth: 120,
  },
  pillHashtag: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  pillStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillPostCount: {
    fontSize: 12,
    color: Colors.text.muted,
    fontWeight: '500',
  },
  pillHotIndicator: {
    marginLeft: Spacing[1],
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing[3],
    borderRadius: 12,
    ...Shadows.md,
  },
  exploreButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.background.primary,
    marginLeft: Spacing[2],
  },
})

export default TrendingTopics