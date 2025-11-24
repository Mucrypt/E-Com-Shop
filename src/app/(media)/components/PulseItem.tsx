import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { PulseContentItem } from '../../../utils/pulseConstants'

const { width, height } = Dimensions.get('window')

interface PulseItemProps {
  item: PulseContentItem
  index: number
  scrollY: any
  isPlaying: boolean
  isLiked: boolean
  isSaved: boolean
  isFollowing: boolean
  onTogglePlay: () => void
  onToggleLike: () => void
  onToggleSave: () => void
  onToggleFollow: () => void
  onOpenComments: () => void
  onAddToCart: () => void
}

const PulseItem: React.FC<PulseItemProps> = ({
  item,
  isLiked,
  isSaved,
  isFollowing,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
}) => {
  const [showAIInsights, setShowAIInsights] = useState(false)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto': return '#F7931A'
      case 'travel': return '#00D4AA'
      case 'jobs': return '#0066CC'
      case 'real-estate': return '#FF6B6B'
      case 'sports': return '#FF4081'
      case 'services': return '#9C27B0'
      case 'shopping': return '#4CAF50'
      default: return '#FF375F'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'crypto': return 'bitcoin'
      case 'travel': return 'plane'
      case 'jobs': return 'briefcase'
      case 'real-estate': return 'home'
      case 'sports': return 'futbol-o'
      case 'services': return 'wrench'
      case 'shopping': return 'shopping-cart'
      default: return 'bolt'
    }
  }

  const handleActionPress = () => {
    const { actionables } = item
    if (actionables.canInvest) {
      router.push('/(crypto-hub)')
    } else if (actionables.canApply) {
      router.push('/(jobs)')
    } else if (actionables.canBook) {
      router.push('/(travel)')
    } else if (actionables.canSchedule) {
      router.push('/(services)')
    } else if (actionables.canBuy) {
      router.push('/(shop)')
    }
  }

  return (
    <View style={styles.container}>
      {/* Background Media */}
      <View style={styles.mediaContainer}>
        {item.mediaUrl ? (
          <Image 
            source={{ uri: item.mediaUrl }} 
            style={styles.mediaBackground}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mediaPlaceholder, { backgroundColor: getCategoryColor(item.category) + '20' }]}>
            <FontAwesome name={getCategoryIcon(item.category)} size={60} color={getCategoryColor(item.category)} />
          </View>
        )}
        
        {/* Live Indicator - Only shows for live-stream content */}
        {item.mediaType === 'live-stream' && item.type === 'live-market' && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Content Overlay - TikTok Style */}
      <View style={styles.contentOverlay}>
        {/* Top Section - Category & Priority */}
        <View style={styles.topSection}>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
            <FontAwesome name={getCategoryIcon(item.category)} size={12} color="#fff" />
            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
          </View>
        </View>

        {/* TikTok Layout */}
        <View style={styles.tikTokLayout}>
          {/* Left Side - Content */}
          <View style={styles.leftContent}>
            {/* Title */}
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            
            {/* Creator Info - Compact */}
            <View style={styles.creatorCompact}>
              <Text style={styles.creatorName}>@{item.creator.name.toLowerCase().replace(' ', '')}</Text>
              {item.creator.verified && (
                <FontAwesome name="check-circle" size={12} color="#1DA1F2" style={{ marginLeft: 4 }} />
              )}
            </View>

            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>{item.description}</Text>

            {/* Context Info */}
            {item.context.timeRelevant && (
              <View style={styles.contextInfo}>
                <Ionicons name="time" size={14} color="#FF375F" />
                <Text style={styles.contextText}>
                  {item.context.opportunityWindow && `⚡ ${item.context.opportunityWindow} left`}
                </Text>
              </View>
            )}

            {/* Main Action Button */}
            <TouchableOpacity
              style={[styles.mainActionButton, { backgroundColor: getCategoryColor(item.category) }]}
              onPress={handleActionPress}
            >
              <Text style={styles.mainActionText}>
                {item.actionables.canInvest && '💰 INVEST'}
                {item.actionables.canApply && '🎯 APPLY'}
                {item.actionables.canBook && '✈️ BOOK'}
                {item.actionables.canSchedule && '📅 SCHEDULE'}
                {item.actionables.canBuy && '🛒 BUY'}
                {!Object.values(item.actionables).some(Boolean) && '👀 VIEW'}
              </Text>
            </TouchableOpacity>

            {/* AI Insights Panel */}
            {showAIInsights && (
              <View style={styles.aiInsightsPanel}>
                <Text style={styles.aiInsightTitle}>🤖 AI Analysis</Text>
                <Text style={styles.aiInsightText}>
                  {item.aiInsights.personalizedReason}
                </Text>
                <View style={styles.aiMetrics}>
                  <View style={styles.aiMetric}>
                    <Text style={styles.aiMetricLabel}>Relevance</Text>
                    <Text style={styles.aiMetricValue}>{item.aiInsights.relevanceScore}%</Text>
                  </View>
                  <View style={styles.aiMetric}>
                    <Text style={styles.aiMetricLabel}>Trending</Text>
                    <Text style={styles.aiMetricValue}>{item.aiInsights.trendingFactor}%</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Right Side - Profile & Actions */}
          <View style={styles.rightSidebar}>
            {/* Profile Picture */}
            <TouchableOpacity 
              style={styles.profileContainer}
              onPress={() => router.push(`/user-profile?userId=${item.creator.id}&name=${encodeURIComponent(item.creator.name)}&username=${encodeURIComponent('@' + item.creator.name.toLowerCase().replace(' ', ''))}&category=${encodeURIComponent(item.creator.expertise[0] || 'Creator')}&avatar=${encodeURIComponent(item.creator.avatar)}&verified=${item.creator.verified}&credibility=${item.creator.credibilityScore}`)}
            >
              <Image 
                source={{ uri: item.creator.avatar }} 
                style={styles.profileAvatar}
              />
              {item.creator.verified && (
                <View style={styles.verifiedBadge}>
                  <FontAwesome name="check" size={8} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            {/* Follow Button */}
            <TouchableOpacity 
              style={[styles.followButton, { backgroundColor: isFollowing ? '#666' : '#FF375F' }]}
              onPress={onToggleFollow}
            >
              <FontAwesome name={isFollowing ? "check" : "plus"} size={12} color="#fff" />
            </TouchableOpacity>

            {/* Vertical Action Buttons */}
            <TouchableOpacity style={styles.sideActionButton} onPress={onToggleLike}>
              <FontAwesome 
                name={isLiked ? "heart" : "heart-o"} 
                size={28} 
                color={isLiked ? "#FF375F" : "#fff"} 
              />
              <Text style={styles.sideActionText}>
                {item.liveMetrics.engagement > 1000 ? `${Math.floor(item.liveMetrics.engagement / 1000)}K` : item.liveMetrics.engagement}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideActionButton} onPress={onOpenComments}>
              <FontAwesome name="comment-o" size={28} color="#fff" />
              <Text style={styles.sideActionText}>
                {item.liveMetrics.comments > 1000 ? `${Math.floor(item.liveMetrics.comments / 1000)}K` : item.liveMetrics.comments}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideActionButton} onPress={onToggleSave}>
              <FontAwesome 
                name={isSaved ? "bookmark" : "bookmark-o"} 
                size={28} 
                color={isSaved ? "#FFD700" : "#fff"} 
              /> 
              <Text style={styles.sideActionText}>
                {item.liveMetrics.saves > 1000 ? `${Math.floor(item.liveMetrics.saves / 1000)}K` : item.liveMetrics.saves}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sideActionButton}>
              <FontAwesome name="share" size={28} color="#fff" />
              <Text style={styles.sideActionText}>
                {item.liveMetrics.shares > 1000 ? `${Math.floor(item.liveMetrics.shares / 1000)}K` : item.liveMetrics.shares}
              </Text>
            </TouchableOpacity>

            {/* AI Insights Button */}
            <TouchableOpacity 
              style={styles.sideActionButton}
              onPress={() => setShowAIInsights(!showAIInsights)}
            >
              <Ionicons name="sparkles" size={28} color="#FFD700" />
              <Text style={styles.sideActionText}>{item.aiInsights.relevanceScore}%</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Timestamp */}
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    position: 'relative',
  },
  mediaContainer: {
    flex: 1,
    position: 'relative',
  },
  mediaBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mediaPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    top: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF375F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#FF375F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'space-between',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 100,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },
  tikTokLayout: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 100,
    flex: 1,
  },
  leftContent: {
    flex: 1,
    paddingRight: 20,
  },
  rightSidebar: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  creatorCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  contextInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 55, 95, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  contextText: {
    color: '#FF375F',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  mainActionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  mainActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  aiInsightsPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  aiInsightTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  aiInsightText: {
    color: '#fff',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  aiMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  aiMetric: {
    alignItems: 'center',
  },
  aiMetricLabel: {
    color: '#ccc',
    fontSize: 10,
  },
  aiMetricValue: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
  },
  profileContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1DA1F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  followButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sideActionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sideActionText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  timestampContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  timestamp: {
    color: '#ccc',
    fontSize: 12,
  },
})

export default PulseItem
