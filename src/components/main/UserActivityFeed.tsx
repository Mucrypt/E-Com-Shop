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

interface ActivityItem {
  id: string
  user: {
    name: string
    avatar: string
    verified: boolean
  }
  action: 'posted' | 'bought' | 'shared' | 'earned' | 'traveled' | 'joined' | 'created'
  content: {
    title: string
    category: string
    value?: string
    description: string
  }
  timestamp: string
  mutual: {
    count: number
    names: string[]
  }
}

const mockActivityFeed: ActivityItem[] = [
  {
    id: '1',
    user: {
      name: 'Alex Thompson',
      avatar: '🎯',
      verified: true,
    },
    action: 'earned',
    content: {
      title: '$2,500 Trading Profit',
      category: 'Crypto Hub',
      value: '$2,500',
      description: 'Made successful trades on BTC and ETH',
    },
    timestamp: '2h ago',
    mutual: {
      count: 12,
      names: ['Sarah', 'Mike', 'Emma'],
    },
  },
  {
    id: '2',
    user: {
      name: 'Maria Rodriguez',
      avatar: '✈️',
      verified: false,
    },
    action: 'traveled',
    content: {
      title: 'Tokyo Adventure',
      category: 'Travel',
      description: 'Just landed in Tokyo! The city is incredible',
    },
    timestamp: '4h ago',
    mutual: {
      count: 8,
      names: ['James', 'Lisa'],
    },
  },
  {
    id: '3',
    user: {
      name: 'David Kim',
      avatar: '💼',
      verified: true,
    },
    action: 'joined',
    content: {
      title: 'Senior Developer at TechCorp',
      category: 'Jobs',
      value: '$95k',
      description: 'Started my dream job as a Senior React Developer',
    },
    timestamp: '6h ago',
    mutual: {
      count: 15,
      names: ['Anna', 'Tom', 'Chris'],
    },
  },
  {
    id: '4',
    user: {
      name: 'Sophie Chen',
      avatar: '🛍️',
      verified: true,
    },
    action: 'bought',
    content: {
      title: 'Wireless Headphones',
      category: 'Marketplace',
      value: '$199',
      description: 'These headphones are amazing! Great sound quality',
    },
    timestamp: '8h ago',
    mutual: {
      count: 6,
      names: ['Ryan', 'Kate'],
    },
  },
  {
    id: '5',
    user: {
      name: 'Marcus Johnson',
      avatar: '🎬',
      verified: true,
    },
    action: 'created',
    content: {
      title: 'Viral Cooking Video',
      category: 'Media',
      value: '1.2M views',
      description: 'My pasta recipe just went viral! Thank you everyone',
    },
    timestamp: '12h ago',
    mutual: {
      count: 23,
      names: ['Jenny', 'Paul', 'Amy'],
    },
  },
  {
    id: '6',
    user: {
      name: 'Isabella Garcia',
      avatar: '🏠',
      verified: false,
    },
    action: 'bought',
    content: {
      title: 'Downtown Apartment',
      category: 'Real Estate',
      value: '$450k',
      description: 'Finally bought my first investment property!',
    },
    timestamp: '1d ago',
    mutual: {
      count: 11,
      names: ['Robert', 'Nina'],
    },
  },
]

const UserActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState(mockActivityFeed)
  const [showAll, setShowAll] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'posted': return 'edit'
      case 'bought': return 'shopping-cart'
      case 'shared': return 'share'
      case 'earned': return 'dollar'
      case 'traveled': return 'plane'
      case 'joined': return 'briefcase'
      case 'created': return 'plus-circle'
      default: return 'circle'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'posted': return Colors.status.info
      case 'bought': return Colors.primary[500]
      case 'shared': return Colors.status.warning
      case 'earned': return Colors.status.success
      case 'traveled': return Colors.status.info
      case 'joined': return Colors.status.success
      case 'created': return Colors.status.error
      default: return Colors.text.secondary
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Crypto Hub': return Colors.status.warning
      case 'Travel': return Colors.status.info
      case 'Jobs': return Colors.status.success
      case 'Marketplace': return Colors.primary[500]
      case 'Media': return Colors.status.error
      case 'Real Estate': return Colors.special.featured
      default: return Colors.text.secondary
    }
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'posted': return 'posted about'
      case 'bought': return 'purchased'
      case 'shared': return 'shared'
      case 'earned': return 'earned'
      case 'traveled': return 'traveled to'
      case 'joined': return 'joined'
      case 'created': return 'created'
      default: return 'did something with'
    }
  }

  const displayedActivities = showAll ? activities : activities.slice(0, 4)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <FontAwesome name="users" size={20} color={Colors.primary[500]} />
          <Text style={styles.title}>Friend Activity</Text>
        </View>
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowAll(!showAll)}
        >
          <Text style={styles.toggleText}>
            {showAll ? 'Show Less' : 'See All'}
          </Text>
          <FontAwesome 
            name={showAll ? 'chevron-up' : 'chevron-down'} 
            size={12} 
            color={Colors.primary[500]} 
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.feedContainer, { opacity: fadeAnim }]}>
        {displayedActivities.map((activity, index) => (
          <TouchableOpacity key={activity.id} style={styles.activityItem}>
            <View style={styles.activityHeader}>
              <View style={styles.userInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarEmoji}>{activity.user.avatar}</Text>
                  {activity.user.verified && (
                    <View style={styles.verifiedBadge}>
                      <FontAwesome name="check" size={8} color={Colors.background.primary} />
                    </View>
                  )}
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{activity.user.name}</Text>
                    <Text style={styles.actionText}>
                      {getActionText(activity.action)}
                    </Text>
                  </View>
                  <Text style={styles.timestamp}>{activity.timestamp}</Text>
                </View>
              </View>
              <View style={[styles.actionIcon, { backgroundColor: `${getActionColor(activity.action)}20` }]}>
                <FontAwesome 
                  name={getActionIcon(activity.action)} 
                  size={16} 
                  color={getActionColor(activity.action)} 
                />
              </View>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.contentHeader}>
                <Text style={styles.contentTitle}>{activity.content.title}</Text>
                {activity.content.value && (
                  <Text style={[styles.contentValue, { color: getActionColor(activity.action) }]}>
                    {activity.content.value}
                  </Text>
                )}
              </View>
              <Text style={styles.contentDescription}>{activity.content.description}</Text>
              
              <View style={styles.contentFooter}>
                <View style={[styles.categoryTag, { backgroundColor: `${getCategoryColor(activity.content.category)}15` }]}>
                  <Text style={[styles.categoryText, { color: getCategoryColor(activity.content.category) }]}>
                    {activity.content.category}
                  </Text>
                </View>
                
                {activity.mutual.count > 0 && (
                  <View style={styles.mutualFriends}>
                    <FontAwesome name="users" size={12} color={Colors.text.muted} />
                    <Text style={styles.mutualText}>
                      {activity.mutual.names.slice(0, 2).join(', ')}
                      {activity.mutual.count > 2 && ` +${activity.mutual.count - 2} others`}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.activityActions}>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="heart-o" size={16} color={Colors.text.secondary} />
                <Text style={styles.actionButtonText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="comment-o" size={16} color={Colors.text.secondary} />
                <Text style={styles.actionButtonText}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <FontAwesome name="share" size={16} color={Colors.text.secondary} />
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {!showAll && activities.length > 4 && (
        <TouchableOpacity 
          style={styles.viewMoreButton}
          onPress={() => setShowAll(true)}
        >
          <Text style={styles.viewMoreText}>View {activities.length - 4} more activities</Text>
          <FontAwesome name="arrow-down" size={14} color={Colors.primary[500]} />
        </TouchableOpacity>
      )}
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
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginRight: Spacing[1],
  },
  feedContainer: {
    backgroundColor: Colors.background.secondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.primary,
    ...Shadows.md,
  },
  activityItem: {
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing[3],
  },
  avatarEmoji: {
    fontSize: 20,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary[500],
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: Spacing[1],
  },
  actionText: {
    fontSize: 15,
    color: Colors.text.secondary,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: Spacing[1],
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    marginBottom: Spacing[3],
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[1],
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  contentValue: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: Spacing[2],
  },
  contentDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 18,
    marginBottom: Spacing[2],
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mutualFriends: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: Spacing[2],
  },
  mutualText: {
    fontSize: 11,
    color: Colors.text.muted,
    marginLeft: Spacing[1],
  },
  activityActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  actionButtonText: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginLeft: Spacing[1],
    fontWeight: '500',
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.overlay.light10,
    paddingVertical: Spacing[3],
    borderRadius: 12,
    marginTop: Spacing[3],
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary[500],
    marginRight: Spacing[2],
  },
})

export default UserActivityFeed