import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors, Spacing, Typography } from '../../constants'
import { pulseData } from '../../utils/pulseConstants'

const { width } = Dimensions.get('window')

const PulseManagement = () => {
  const insets = useSafeAreaInsets()
  const [isPrivateProfile, setIsPrivateProfile] = useState(false)
  const [allowComments, setAllowComments] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'posts' | 'drafts' | 'analytics'>('posts')

  // Mock user's pulse content
  const userPulseContent = pulseData.slice(0, 3) // Simulate user's content

  const pulseStats = {
    totalPosts: 24,
    totalViews: 125000,
    totalLikes: 8500,
    totalShares: 420,
    avgEngagement: 12.5,
    followers: 1250,
  }

  const renderContentGrid = () => {
    return (
      <View style={styles.contentGrid}>
        {userPulseContent.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.contentItem}
            onPress={() => {
              // Navigate to edit content or view details
            }}
          >
            <Image
              source={{ uri: item.creator.avatar }}
              style={styles.contentThumbnail}
              resizeMode="cover"
            />
            <View style={styles.contentOverlay}>
              <View style={styles.contentStats}>
                <View style={styles.statRow}>
                  <FontAwesome name="heart" size={12} color="#fff" />
                  <Text style={styles.statText}>{item.liveMetrics.engagement > 1000 ? `${Math.floor(item.liveMetrics.engagement / 1000)}K` : item.liveMetrics.engagement}</Text>
                </View>
                <View style={styles.statRow}>
                  <FontAwesome name="comment" size={12} color="#fff" />
                  <Text style={styles.statText}>{item.liveMetrics.comments}</Text>
                </View>
              </View>
              <View style={styles.contentBadge}>
                <FontAwesome name="bolt" size={10} color="#FFD700" />
              </View>
            </View>
            <Text style={styles.contentTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Add New Content Button */}
        <TouchableOpacity
          style={[styles.contentItem, styles.addContentItem]}
          onPress={() => router.push('/(social)/create')}
        >
          <View style={styles.addContentButton}>
            <FontAwesome name="plus" size={24} color={Colors.primary[500]} />
            <Text style={styles.addContentText}>Create New</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderAnalytics = () => {
    return (
      <View style={styles.analyticsContainer}>
        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <FontAwesome name="eye" size={24} color="#4ECDC4" />
            <Text style={styles.analyticsNumber}>{pulseStats.totalViews.toLocaleString()}</Text>
            <Text style={styles.analyticsLabel}>Total Views</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <FontAwesome name="heart" size={24} color="#FF375F" />
            <Text style={styles.analyticsNumber}>{pulseStats.totalLikes.toLocaleString()}</Text>
            <Text style={styles.analyticsLabel}>Total Likes</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <FontAwesome name="share" size={24} color="#9C27B0" />
            <Text style={styles.analyticsNumber}>{pulseStats.totalShares}</Text>
            <Text style={styles.analyticsLabel}>Shares</Text>
          </View>
          
          <View style={styles.analyticsCard}>
            <FontAwesome name="bar-chart" size={24} color="#FFD700" />
            <Text style={styles.analyticsNumber}>{pulseStats.avgEngagement}%</Text>
            <Text style={styles.analyticsLabel}>Avg Engagement</Text>
          </View>
        </View>
        
        <View style={styles.analyticsDetails}>
          <Text style={styles.analyticsTitle}>Performance Insights</Text>
          <View style={styles.insightItem}>
            <Ionicons name="trending-up" size={20} color="#4ECDC4" />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>Your content performs best on weekends</Text>
              <Text style={styles.insightSubtext}>38% higher engagement</Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="time" size={20} color="#FFA726" />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>Peak activity: 7-9 PM</Text>
              <Text style={styles.insightSubtext}>Post during this time for max reach</Text>
            </View>
          </View>
          <View style={styles.insightItem}>
            <Ionicons name="people" size={20} color="#9C27B0" />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>Crypto content gets +45% more engagement</Text>
              <Text style={styles.insightSubtext}>Your top performing category</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pulse Management</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <FontAwesome name="cog" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Privacy Settings */}
      <View style={styles.privacySection}>
        <View style={styles.privacyItem}>
          <View style={styles.privacyInfo}>
            <FontAwesome name="lock" size={16} color={Colors.primary[500]} />
            <Text style={styles.privacyText}>Private Profile</Text>
          </View>
          <Switch
            value={isPrivateProfile}
            onValueChange={setIsPrivateProfile}
            trackColor={{ false: Colors.text.disabled, true: Colors.primary[500] }}
            thumbColor={isPrivateProfile ? '#fff' : '#f4f3f4'}
          />
        </View>
        
        <View style={styles.privacyItem}>
          <View style={styles.privacyInfo}>
            <FontAwesome name="comment" size={16} color={Colors.primary[500]} />
            <Text style={styles.privacyText}>Allow Comments</Text>
          </View>
          <Switch
            value={allowComments}
            onValueChange={setAllowComments}
            trackColor={{ false: Colors.text.disabled, true: Colors.primary[500] }}
            thumbColor={allowComments ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
          onPress={() => setSelectedTab('posts')}
        >
          <Text style={[styles.tabText, selectedTab === 'posts' && styles.activeTabText]}>
            Posts ({pulseStats.totalPosts})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'drafts' && styles.activeTab]}
          onPress={() => setSelectedTab('drafts')}
        >
          <Text style={[styles.tabText, selectedTab === 'drafts' && styles.activeTabText]}>
            Drafts (3)
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'analytics' && styles.activeTab]}
          onPress={() => setSelectedTab('analytics')}
        >
          <Text style={[styles.tabText, selectedTab === 'analytics' && styles.activeTabText]}>
            Analytics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {selectedTab === 'posts' && renderContentGrid()}
        {selectedTab === 'drafts' && (
          <View style={styles.emptyState}>
            <FontAwesome name="file-text" size={48} color={Colors.text.muted} />
            <Text style={styles.emptyStateText}>No drafts yet</Text>
            <Text style={styles.emptyStateSubtext}>Your draft content will appear here</Text>
          </View>
        )}
        {selectedTab === 'analytics' && renderAnalytics()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacySection: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing[5],
    marginVertical: Spacing[4],
    borderRadius: 12,
    padding: Spacing[4],
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: Typography.sizes.md,
    color: Colors.text.primary,
    marginLeft: Spacing[3],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Spacing[5],
    borderRadius: 12,
    padding: Spacing[1],
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[3],
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.text.primary,
  },
  scrollView: {
    flex: 1,
    marginTop: Spacing[4],
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[5],
    justifyContent: 'space-between',
  },
  contentItem: {
    width: (width - Spacing[5] * 2 - Spacing[3]) / 2,
    marginBottom: Spacing[4],
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contentThumbnail: {
    width: '100%',
    height: 120,
  },
  contentOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
    padding: Spacing[2],
  },
  contentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
  },
  contentBadge: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  contentTitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.primary,
    padding: Spacing[2],
    fontWeight: '600',
  },
  addContentItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  addContentButton: {
    alignItems: 'center',
    padding: Spacing[4],
  },
  addContentText: {
    color: Colors.primary[500],
    fontSize: Typography.sizes.sm,
    fontWeight: '600',
    marginTop: Spacing[2],
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
  },
  emptyStateText: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
    fontWeight: '600',
    marginTop: Spacing[4],
  },
  emptyStateSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.muted,
    marginTop: Spacing[2],
  },
  analyticsContainer: {
    paddingHorizontal: Spacing[5],
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing[6],
  },
  analyticsCard: {
    width: (width - Spacing[5] * 2 - Spacing[3]) / 2,
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing[4],
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  analyticsNumber: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: Spacing[2],
  },
  analyticsLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: Spacing[1],
  },
  analyticsDetails: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 12,
    padding: Spacing[4],
  },
  analyticsTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing[4],
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  insightContent: {
    marginLeft: Spacing[3],
    flex: 1,
  },
  insightText: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  insightSubtext: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
})

export default PulseManagement