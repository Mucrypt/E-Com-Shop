import React, { memo } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import VideoPlayer from './VideoPlayer'
import ProductOverlay from './ProductOverlay'
import CreatorInfo from './CreatorInfo'
import SocialActions from './SocialActions'
import CommentSheet from './CommentSheet'
import { useFeedItem } from '../../../../src/hooks/useFeedItem'
import { styles } from '../../../../src/styles/FeedItem.styles'

interface FeedItemProps {
  item: any
  isActive: boolean
  index: number
}

const FeedItem: React.FC<FeedItemProps> = memo(({ item, isActive, index }) => {
  const {
    isPlaying,
    isLiked,
    isBookmarked,
    showComments,
    togglePlay,
    toggleLike,
    toggleBookmark,
    toggleComments,
    handleAddToCart,
  } = useFeedItem(item.id)

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={togglePlay}>
        <View style={styles.videoContainer}>
          <VideoPlayer
            url={item.contentUrl}
            isActive={isActive}
            isPlaying={isPlaying}
            type={item.type}
          />

          {/* Content overlay */}
          <View style={styles.overlay}>
            {/* Left side - Creator info and caption */}
            <View style={styles.leftSection}>
              <CreatorInfo
                creator={item.creator}
                caption={item.caption}
                sound={item.sound}
                createdAt={item.created_at}
                hashtags={item.hashtags}
              />
            </View>

            {/* Right side - Social actions */}
            <View style={styles.rightSection}>
              <SocialActions
                item={item}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                onLike={toggleLike}
                onComment={toggleComments}
                onBookmark={toggleBookmark}
                onShare={() => {}}
              />
            </View>
          </View>

          {/* Product overlay */}
          {item.product && (
            <ProductOverlay
              product={item.product}
              onAddToCart={handleAddToCart}
            />
          )}
        </View>
      </TouchableWithoutFeedback>

      {/* Comment bottom sheet */}
      <CommentSheet
        isVisible={showComments}
        onClose={toggleComments}
        itemId={item.id}
        comments={item.comments}
      />
    </View>
  )
})

export default FeedItem
