import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AnimatedButton from '../ui/AnimatedButton'
import { styles } from '../../../../src/styles/SocialActions.styles'

interface SocialActionsProps {
  item: any
  isLiked: boolean
  isBookmarked: boolean
  onLike: () => void
  onComment: () => void
  onBookmark: () => void
  onShare: () => void
}

const SocialActions: React.FC<SocialActionsProps> = ({
  item,
  isLiked,
  isBookmarked,
  onLike,
  onComment,
  onBookmark,
  onShare,
}) => {
  return (
    <View style={styles.container}>
      {/* Like button */}
      <View style={styles.actionGroup}>
        <AnimatedButton
          onPress={onLike}
          style={styles.actionButton}
          scaleTo={0.7}
          withHapticFeedback
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={32}
            color={isLiked ? '#ff2c55' : '#fff'}
          />
        </AnimatedButton>
        <Text style={styles.actionCount}>{item.likes}</Text>
      </View>

      {/* Comment button */}
      <View style={styles.actionGroup}>
        <AnimatedButton
          onPress={onComment}
          style={styles.actionButton}
          scaleTo={0.7}
        >
          <Ionicons name='chatbubble-outline' size={28} color='#fff' />
        </AnimatedButton>
        <Text style={styles.actionCount}>{item.comments}</Text>
      </View>

      {/* Share button */}
      <View style={styles.actionGroup}>
        <AnimatedButton
          onPress={onShare}
          style={styles.actionButton}
          scaleTo={0.7}
        >
          <Ionicons name='arrow-redo-outline' size={28} color='#fff' />
        </AnimatedButton>
        <Text style={styles.actionCount}>{item.shares}</Text>
      </View>

      {/* Bookmark button */}
      <View style={styles.actionGroup}>
        <AnimatedButton
          onPress={onBookmark}
          style={styles.actionButton}
          scaleTo={0.7}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={isBookmarked ? '#2E8C83' : '#fff'}
          />
        </AnimatedButton>
      </View>

      {/* Rotating music disc for video content */}
      {item.type === 'video' && (
        <View style={styles.musicDisc}>
          <Ionicons name='musical-notes' size={20} color='#fff' />
        </View>
      )}
    </View>
  )
}

export default SocialActions
