import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import ProgressiveImage from '../ui/ProgressiveImage'
import AnimatedButton from '../ui/AnimatedButton'
import { styles } from '../../../../src/styles/CreatorInfo.styles'

interface CreatorInfoProps {
  creator: {
    id: string
    name: string
    avatar: string
    verified: boolean
    followers?: number
  }
  caption: string
  sound: string
  createdAt: string
  hashtags: string[]
}

const CreatorInfo: React.FC<CreatorInfoProps> = ({
  creator,
  caption,
  sound,
  createdAt,
  hashtags,
}) => {
  return (
    <View style={styles.container}>
      {/* Creator profile */}
      <View style={styles.creatorContainer}>
        <ProgressiveImage
          source={{ uri: creator.avatar }}
          style={styles.avatar}
          resizeMode='cover'
        />

        <View style={styles.creatorInfo}>
          <View style={styles.creatorNameRow}>
            <Text style={styles.creatorName}>@{creator.name}</Text>
            {creator.verified && (
              <MaterialIcons name='verified' size={16} color='#2E8C83' />
            )}
          </View>

          <Text style={styles.followers}>
            {creator.followers
              ? `${creator.followers.toLocaleString()} followers`
              : 'New creator'}
          </Text>
        </View>

        <AnimatedButton
          onPress={() => console.log('Follow', creator.id)}
          style={styles.followButton}
          scaleTo={0.95}
        >
          <Text style={styles.followText}>Follow</Text>
        </AnimatedButton>
      </View>

      {/* Caption */}
      {caption && (
        <Text style={styles.caption} numberOfLines={2}>
          {caption}
        </Text>
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <View style={styles.hashtagContainer}>
          {hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtag}>
              {tag}
            </Text>
          ))}
        </View>
      )}

      {/* Sound info */}
      <View style={styles.soundContainer}>
        <Ionicons
          name='musical-notes'
          size={14}
          color='rgba(255,255,255,0.7)'
        />
        <Text style={styles.soundName} numberOfLines={1}>
          {sound}
        </Text>
        <Text style={styles.timestamp}> · {createdAt}</Text>
      </View>
    </View>
  )
}

export default CreatorInfo
