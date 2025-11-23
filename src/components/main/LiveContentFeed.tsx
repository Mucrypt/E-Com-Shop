import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Colors, Typography, Spacing, Shadows } from '../../constants'

const { width } = Dimensions.get('window')

interface LiveContentItem {
  id: string
  type: 'shop_review' | 'travel_photo' | 'job_success' | 'crypto_trade' | 'media_post'
  author: {
    name: string
    avatar: string
    verified: boolean
  }
  content: {
    title: string
    description: string
    image?: string
    value?: string
    category: string
  }
  timestamp: string
  engagement: {
    likes: number
    comments: number
    shares: number
  }
  isLive?: boolean
}

const mockLiveContent: LiveContentItem[] = [
  {
    id: '1',
    type: 'crypto_trade',
    author: {
      name: 'CryptoKing',
      avatar: '👑',
      verified: true,
    },
    content: {
      title: 'BTC Trade Alert',
      description: 'Just executed a perfect swing trade on Bitcoin',
      value: '+$2,340',
      category: 'Crypto Hub',
    },
    timestamp: '2m ago',
    engagement: { likes: 234, comments: 18, shares: 12 },
    isLive: true,
  },
  {
    id: '2',
    type: 'travel_photo',
    author: {
      name: 'WanderlustSarah',
      avatar: '✈️',
      verified: true,
    },
    content: {
      title: 'Bali Paradise',
      description: 'Found this hidden gem through Mukulah Travel!',
      image: '🏝️',
      category: 'Travel',
    },
    timestamp: '5m ago',
    engagement: { likes: 456, comments: 32, shares: 28 },
  },
  {
    id: '3',
    type: 'job_success',
    author: {
      name: 'TechRecruiter',
      avatar: '💼',
      verified: false,
    },
    content: {
      title: 'Dream Job Landed!',
      description: 'Thanks to Mukulah Jobs, I found my perfect remote position',
      value: '$120k/year',
      category: 'Jobs',
    },
    timestamp: '12m ago',
    engagement: { likes: 189, comments: 45, shares: 67 },
  },
  {
    id: '4',
    type: 'shop_review',
    author: {
      name: 'ReviewQueen',
      avatar: '⭐',
      verified: true,
    },
    content: {
      title: '5-Star Product!',
      description: 'This wireless headset is incredible - best purchase ever!',
      category: 'Marketplace',
    },
    timestamp: '18m ago',
    engagement: { likes: 89, comments: 15, shares: 8 },
  },
  {
    id: '5',
    type: 'media_post',
    author: {
      name: 'CreatorStudio',
      avatar: '🎬',
      verified: true,
    },
    content: {
      title: 'Viral Video Alert',
      description: 'My latest content just hit 1M views on Mukulah Media!',
      value: '1M views',
      category: 'Media',
    },
    timestamp: '25m ago',
    engagement: { likes: 1240, comments: 156, shares: 89 },
    isLive: true,
  },
]

const LiveContentFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slideAnim = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockLiveContent.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + mockLiveContent.length) % mockLiveContent.length)
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
    // Slide animation when content changes
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -10,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()

    // Pulse animation for live content
    if (mockLiveContent[currentIndex].isLive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [currentIndex])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'crypto_trade': return 'bitcoin'
      case 'travel_photo': return 'plane'
      case 'job_success': return 'briefcase'
      case 'shop_review': return 'shopping-bag'
      case 'media_post': return 'play'
      default: return 'circle'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'crypto_trade': return Colors.status.warning
      case 'travel_photo': return Colors.status.info
      case 'job_success': return Colors.status.success
      case 'shop_review': return Colors.primary[500]
      case 'media_post': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const currentItem = mockLiveContent[currentIndex]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="flash" size={20} color={Colors.primary[500]} />
          <Text style={styles.title}>Live Activity</Text>
          {currentItem.isLive && (
            <Animated.View style={[styles.liveIndicator, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.liveText}>LIVE</Text>
            </Animated.View>
          )}
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <FontAwesome name="chevron-right" size={12} color={Colors.primary[500]} />
        </TouchableOpacity>
      </View>

      <Animated.View 
        {...panResponder.panHandlers}
        style={[styles.contentCard, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.authorInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{currentItem.author.avatar}</Text>
              {currentItem.author.verified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome name="check" size={8} color={Colors.background.primary} />
                </View>
              )}
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{currentItem.author.name}</Text>
              <Text style={styles.timestamp}>{currentItem.timestamp}</Text>
            </View>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: `${getTypeColor(currentItem.type)}20` }]}>
            <FontAwesome 
              name={getTypeIcon(currentItem.type)} 
              size={12} 
              color={getTypeColor(currentItem.type)} 
            />
            <Text style={[styles.categoryText, { color: getTypeColor(currentItem.type) }]}>
              {currentItem.content.category}
            </Text>
          </View>
        </View>

        <View style={styles.contentBody}>
          <Text style={styles.contentTitle}>{currentItem.content.title}</Text>
          <Text style={styles.contentDescription}>{currentItem.content.description}</Text>
          
          {currentItem.content.value && (
            <View style={styles.valueContainer}>
              <Text style={[styles.valueText, { color: getTypeColor(currentItem.type) }]}>
                {currentItem.content.value}
              </Text>
            </View>
          )}

          {currentItem.content.image && (
            <View style={styles.imageContainer}>
              <Text style={styles.imageEmoji}>{currentItem.content.image}</Text>
            </View>
          )}
        </View>

        <View style={styles.engagementBar}>
          <View style={styles.engagementItem}>
            <FontAwesome name="heart" size={14} color={Colors.status.error} />
            <Text style={styles.engagementText}>{currentItem.engagement.likes}</Text>
          </View>
          <View style={styles.engagementItem}>
            <FontAwesome name="comment" size={14} color={Colors.text.secondary} />
            <Text style={styles.engagementText}>{currentItem.engagement.comments}</Text>
          </View>
          <View style={styles.engagementItem}>
            <FontAwesome name="share" size={14} color={Colors.text.secondary} />
            <Text style={styles.engagementText}>{currentItem.engagement.shares}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.indicators}>
        {mockLiveContent.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentIndex ? Colors.primary[500] : Colors.overlay.light10,
                width: index === currentIndex ? 20 : 8,
              },
            ]}
            onPress={() => setCurrentIndex(index)}
          />
        ))}
      </View>
      
      {/* Swipe hint */}
      <View style={styles.swipeHint}>
        <FontAwesome name="hand-o-right" size={12} color={Colors.text.muted} />
        <Text style={styles.swipeHintText}>Swipe or tap to explore activity</Text>
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
    backgroundColor: Colors.status.error,
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 4,
    marginLeft: Spacing[2],
  },
  liveText: {
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
  contentCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[3],
  },
  avatarEmoji: {
    fontSize: 24,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary[500],
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: Spacing[1],
  },
  contentBody: {
    marginBottom: Spacing[3],
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[1],
  },
  contentDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  valueContainer: {
    marginTop: Spacing[2],
  },
  valueText: {
    fontSize: 18,
    fontWeight: '700',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: Spacing[2],
  },
  imageEmoji: {
    fontSize: 32,
  },
  engagementBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: Spacing[1],
    fontWeight: '600',
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

export default LiveContentFeed