import React, { useState, useRef } from 'react'
import { View, Dimensions, Animated, FlatList, StatusBar } from 'react-native'
import { useAuth } from '../../providers'

// Components
import MediaHeader from './components/MediaHeader'
import PulseItem from './components/PulseItem'
import CommentsModal from './components/CommentsModal'
import CreatePostModal from './components/CreatePostModal'
import LiveStreamModal from './components/LiveStreamModal'

// Revolutionary Pulse Data
import { pulseData, PulseContentItem } from '../../utils/pulseConstants'
import { router } from 'expo-router'

const { width, height } = Dimensions.get('window')

const MediaScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [following, setFollowing] = useState<string[]>([])
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [liveModalVisible, setLiveModalVisible] = useState(false)
  const [preloadedVideos, setPreloadedVideos] = useState<Set<number>>(new Set())
  const [viewTime, setViewTime] = useState<number>(0)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const { user, isAuthenticated } = useAuth()
  const scrollY = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList>(null)

  const openComments = (post: any) => {
    setCurrentPost(post)
    setCommentModalVisible(true)
  }

  const handleCreatePost = () => {
    setCreateModalVisible(true) // This should trigger the modal
  }

  // World-class video preloading and optimization
  const preloadVideo = React.useCallback((index: number) => {
    setPreloadedVideos(prev => new Set([...prev, index]))
  }, [])

  // Preload content based on current index (moved to top level)
  React.useEffect(() => {
    // Preload current and next 2 items for smooth scrolling
    for (let i = currentIndex; i <= currentIndex + 2; i++) {
      if (i < pulseData.length) {
        preloadVideo(i)
      }
    }
  }, [currentIndex, preloadVideo])

  // Enhanced pulse item renderer with revolutionary features
  const renderPulseItem = ({ item, index }: { item: PulseContentItem; index: number }) => {
    return (
      <PulseItem
        item={item}
        index={index}
        scrollY={scrollY}
        isPlaying={isPlaying && index === currentIndex}
        isLiked={likedItems.includes(item.id)}
        isSaved={savedItems.includes(item.id)}
        isFollowing={following.includes(item.creator.id)}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleLike={() => {
          setLikedItems((prev) =>
            prev.includes(item.id)
              ? prev.filter((id) => id !== item.id)
              : [...prev, item.id]
          )
          // Haptic feedback on like (world-class UX)
          if (item.id && !likedItems.includes(item.id)) {
            // Add haptic feedback here if available
          }
        }}
        onToggleSave={() =>
          setSavedItems((prev) =>
            prev.includes(item.id)
              ? prev.filter((id) => id !== item.id)
              : [...prev, item.id]
          )
        }
        onToggleFollow={() =>
          setFollowing((prev) =>
            prev.includes(item.creator.id)
              ? prev.filter((id) => id !== item.creator.id)
              : [...prev, item.creator.id]
          )
        }
        onOpenComments={() => openComments(item)}
        onAddToCart={() => {
          /* Add to cart logic */
        }}
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />
      <MediaHeader scrollY={scrollY} />
      <Animated.FlatList
        ref={flatListRef}
        data={pulseData}
        renderItem={renderPulseItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={height}
        snapToAlignment="start"
        disableIntervalMomentum
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { 
            useNativeDriver: true,
            listener: (event: any) => {
              const offsetY = event.nativeEvent.contentOffset.y
              const newIndex = Math.round(offsetY / height)
              if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex)
                setIsPlaying(true)
                setViewTime(Date.now())
              }
            }
          }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / height)
          setCurrentIndex(index)
          setIsPlaying(true)
        }}
        scrollEventThrottle={16}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          // Load more videos (infinite scroll)
          console.log('Loading more videos...')
        }}
      />
     
      <CommentsModal
        visible={commentModalVisible}
        post={currentPost}
        onClose={() => setCommentModalVisible(false)}
        user={user}
      />
      <CreatePostModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
     
      {/* MediaFooter removed - controlled by social navigation */}
      
      <LiveStreamModal
        visible={liveModalVisible}
        onClose={() => setLiveModalVisible(false)}
      />
    </View>
  )
}

export default MediaScreen
