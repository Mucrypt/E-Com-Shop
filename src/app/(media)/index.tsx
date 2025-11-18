import React, { useState, useRef } from 'react'
import { View, Dimensions, Animated, FlatList, StatusBar } from 'react-native'
import { useAuth } from '../../providers'

// Components
import MediaHeader from './components/MediaHeader'
import MediaFooter from './components/MediaFooter'
import VideoItem from './components/VideoItem'
import CommentsModal from './components/CommentsModal'
import CreatePostModal from './components/CreatePostModal'
import LiveStreamModal from './components/LiveStreamModal'

// Data and utilities
import { feedData } from '../../utils/constants'
import { router } from 'expo-router'

const { height } = Dimensions.get('window')

const MediaScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [following, setFollowing] = useState<string[]>([])
  const [savedItems, setSavedItems] = useState<string[]>([])
  const [commentModalVisible, setCommentModalVisible] = useState(false)
  const [currentPost, setCurrentPost] = useState<any>(null)
  const [createModalVisible, setCreateModalVisible] = useState(false) // Add this state
  const [liveModalVisible, setLiveModalVisible] = useState(false)

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

  const renderVideoItem = ({ item, index }: { item: any; index: number }) => (
    <VideoItem
      item={item}
      index={index}
      scrollY={scrollY}
      isPlaying={isPlaying && index === currentIndex}
      isLiked={likedItems.includes(item.id)}
      isSaved={savedItems.includes(item.id)}
      isFollowing={following.includes(item.creator.id)}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onToggleLike={() =>
        setLikedItems((prev) =>
          prev.includes(item.id)
            ? prev.filter((id) => id !== item.id)
            : [...prev, item.id]
        )
      }
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

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />
      <MediaHeader />
      <Animated.FlatList
        ref={flatListRef}
        data={feedData}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / height)
          setCurrentIndex(index)
          setIsPlaying(true)
        }}
        scrollEventThrottle={16}
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
     
      <MediaFooter
        onCreatePost={handleCreatePost}
        onGoLive={() => setLiveModalVisible(true)}
        currentTab='home'
      />
      
      <LiveStreamModal
        visible={liveModalVisible}
        onClose={() => setLiveModalVisible(false)}
      />
    </View>
  )
}

export default MediaScreen
