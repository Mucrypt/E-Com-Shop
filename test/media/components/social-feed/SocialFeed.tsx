import React, { useRef, useState } from 'react'
import CreatePost from './CreatePost'
import {
  View,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import { useFeed } from '../../../../src/hooks/useFeed'
import FeedItem from './FeedItem'
import LoadingSpinner from '../ui/LoadingSpinner'
import { styles } from '../../../../src/styles/SocialFeed.styles'

const { height } = Dimensions.get('window')

const SocialFeed: React.FC = () => {
  const { feedData, isLoading, loadMore, refresh } = useFeed()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / height)
    setCurrentIndex(index)
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <FeedItem item={item} isActive={index === currentIndex} index={index} />
  )

  if (isLoading && feedData.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <LoadingSpinner size='large' />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CreatePost onPostCreated={refresh} />
      <FlatList
        ref={flatListRef}
        data={feedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onRefresh={refresh}
        refreshing={isLoading}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={3}
      />
    </View>
  )
}

export default SocialFeed
