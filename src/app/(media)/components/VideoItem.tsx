import React, { useRef } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { formatNumber } from '../../../utils/formatters'

const { width, height } = Dimensions.get('window')

interface VideoItemProps {
  item: any
  index: number
  scrollY: Animated.Value
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

const VideoItem: React.FC<VideoItemProps> = ({
  item,
  index,
  scrollY,
  isPlaying,
  isLiked,
  isSaved,
  isFollowing,
  onTogglePlay,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
  onOpenComments,
  onAddToCart,
}) => {
  const heartScale = useRef(new Animated.Value(0)).current

  const inputRange = [
    (index - 1) * height,
    index * height,
    (index + 1) * height,
  ]

  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
  })

  const animateHeart = () => {
    heartScale.setValue(0)
    Animated.spring(heartScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start()
  }

  const handleLike = () => {
    onToggleLike()
    if (!isLiked) {
      animateHeart()
    }
  }

  const heartAnimation = {
    transform: [
      {
        scale: heartScale.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [1, 1.5, 1],
        }),
      },
    ],
  }

  return (
    <Animated.View style={[styles.videoContainer, { opacity }]}>
      {/* Media Content */}
      <View style={styles.mediaContainer}>
        <Image
          source={{
            uri: item.type === 'image' ? item.contentUrl : item.product.image,
          }}
          style={styles.media}
          resizeMode='cover'
        />

        {item.type !== 'image' && (
          <TouchableOpacity style={styles.playButton} onPress={onTogglePlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={40}
              color='rgba(255,255,255,0.8)'
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Product Card */}
      <TouchableOpacity style={styles.productCard} onPress={onAddToCart}>
        <Image
          source={{ uri: item.product.image }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.product.name}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>${item.product.price}</Text>
            <Text style={styles.originalPrice}>
              ${item.product.originalPrice}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Ionicons name='cart' size={20} color='#fff' />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Right Actions */}
      <View style={styles.rightActions}>
        <View style={styles.actionColumn}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Animated.View style={isLiked ? heartAnimation : {}}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={32}
                color={isLiked ? '#ff2c55' : '#fff'}
              />
            </Animated.View>
            <Text style={styles.actionCount}>{formatNumber(item.likes)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={onOpenComments}
          >
            <Ionicons name='chatbubble-outline' size={28} color='#fff' />
            <Text style={styles.actionCount}>
              {formatNumber(item.comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='arrow-redo-outline' size={28} color='#fff' />
            <Text style={styles.actionCount}>{formatNumber(item.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onToggleSave}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={28}
              color={isSaved ? '#2E8C83' : '#fff'}
            />
          </TouchableOpacity>

          {item.type === 'tutorial' && (
            <View style={styles.tutorialBadge}>
              <MaterialIcons
                name='play-circle-outline'
                size={16}
                color='#fff'
              />
              <Text style={styles.tutorialText}>Tutorial</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.creatorInfo}>
          <TouchableOpacity style={styles.creator}>
            <Image
              source={{ uri: item.creator.avatar }}
              style={styles.avatar}
            />
            <View style={styles.creatorDetails}>
              <View style={styles.creatorNameRow}>
                <Text style={styles.creatorName}>{item.creator.name}</Text>
                {item.creator.verified && (
                  <MaterialIcons
                    name='verified'
                    size={16}
                    color='#2E8C83'
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <Text style={styles.followerCount}>
                {formatNumber(item.creator.followers)} followers
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={onToggleFollow}
          >
            <Text
              style={[styles.followText, isFollowing && styles.followingText]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption} numberOfLines={2}>
          {item.caption}
        </Text>

        <View style={styles.hashtagContainer}>
          {item.hashtags.map((tag: string, i: number) => (
            <Text key={i} style={styles.hashtag}>
              {tag}
            </Text>
          ))}
        </View>

        <View style={styles.soundInfo}>
          <Ionicons name='musical-notes' size={14} color='#fff' />
          <Text style={styles.soundName}>{item.sound}</Text>
          <Text style={styles.timestamp}> · {item.created_at}</Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    width,
    height,
    backgroundColor: '#000',
  },
  mediaContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 40,
    padding: 10,
  },
  productCard: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 80,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8C83',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  addToCartBtn: {
    backgroundColor: '#2E8C83',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: 160,
    alignItems: 'center',
  },
  actionColumn: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionCount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  tutorialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 140, 131, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  tutorialText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  bottomContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 80,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorName: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
    fontSize: 16,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  followerCount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 4,
  },
  followingButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  followingText: {
    color: 'rgba(255,255,255,0.7)',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  hashtag: {
    color: '#2E8C83',
    fontWeight: '600',
    marginRight: 8,
    fontSize: 14,
  },
  soundInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundName: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
})

export default VideoItem
