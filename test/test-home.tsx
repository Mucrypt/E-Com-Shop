import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
} from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useCartStore } from '../src/store'
import { useAppToast } from '../src/components'
import { useAuth } from '../src/providers'

const { width, height } = Dimensions.get('window')

// Mock data for social commerce feed
const feedData = [
  {
    id: '1',
    type: 'video',
    contentUrl: 'https://example.com/video1.mp4',
    creator: {
      id: 'user1',
      name: 'FashionGuru',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
    },
    product: {
      id: 'prod1',
      name: 'Designer Summer Dress',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://example.com/dress.jpg',
    },
    likes: 2456,
    comments: 189,
    shares: 456,
    caption:
      'This dress is perfect for summer outings! So comfortable and stylish. #fashion #summer',
    sound: 'Original Sound - FashionGuru',
    hashtags: ['#fashion', '#summer', '#ootd'],
    created_at: '2 hours ago',
  },
  {
    id: '2',
    type: 'video',
    contentUrl: 'https://example.com/video2.mp4',
    creator: {
      id: 'user2',
      name: 'TechReviewer',
      avatar: 'https://example.com/avatar2.jpg',
      verified: true,
    },
    product: {
      id: 'prod2',
      name: 'Wireless Earbuds Pro',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://example.com/earbuds.jpg',
    },
    likes: 3892,
    comments: 267,
    shares: 892,
    caption:
      'These earbuds have amazing sound quality and battery life! Must-have for music lovers.',
    sound: 'Tech Review Beat',
    hashtags: ['#tech', '#music', '#gadgets'],
    created_at: '5 hours ago',
  },
  {
    id: '3',
    type: 'image',
    contentUrl: 'https://example.com/image1.jpg',
    creator: {
      id: 'user3',
      name: 'HomeDecorIdeas',
      avatar: 'https://example.com/avatar3.jpg',
      verified: false,
    },
    product: {
      id: 'prod3',
      name: 'Minimalist Wall Art',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://example.com/wallart.jpg',
    },
    likes: 1567,
    comments: 98,
    shares: 234,
    caption:
      'Transform your space with this beautiful wall art! #homedecor #interiordesign',
    sound: 'Interior Design Theme',
    hashtags: ['#homedecor', '#interior', '#design'],
    created_at: '1 day ago',
  },
  {
    id: '4',
    type: 'tutorial',
    contentUrl: 'https://example.com/video3.mp4',
    creator: {
      id: 'user4',
      name: 'BeautyExpert',
      avatar: 'https://example.com/avatar4.jpg',
      verified: true,
    },
    product: {
      id: 'prod4',
      name: 'Skincare Routine Set',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://example.com/skincare.jpg',
    },
    likes: 5123,
    comments: 423,
    shares: 1023,
    caption:
      'My daily skincare routine using these amazing products! Your skin will thank you.',
    sound: 'Self Care - Relaxing Music',
    hashtags: ['#skincare', '#beauty', '#selfcare'],
    created_at: '3 hours ago',
  },
]

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [likedItems, setLikedItems] = useState<string[]>([])
  const { addToCart } = useCartStore()
  const { toast } = useAppToast()
  const { user, isAuthenticated } = useAuth()

  const scrollY = useRef(new Animated.Value(0)).current
  const flatListRef = useRef<FlatList>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLike = (itemId: string) => {
    setLikedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )

    // Add heart animation effect
    // In a real app, you would also send this to your backend
  }

  const handleAddToCart = (product: any) => {
    try {
      addToCart(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          color: 'Default',
          size: 'Default',
          image: product.image,
          inStock: true,
          category: 'Featured',
          rating: 4.5,
          estimatedDelivery: '2-3 days',
        },
        1
      )

      toast.show(`${product.name} added to cart!`, {
        type: 'success',
        icon: '🛒',
      })
    } catch (error) {
      console.error('Add to cart error:', error)
    }
  }

  const renderVideoItem = ({ item, index }: { item: any; index: number }) => {
    const inputRange = [
      (index - 1) * height,
      index * height,
      (index + 1) * height,
    ]

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
    })

    return (
      <Animated.View style={[styles.videoContainer, { opacity }]}>
        {/* Video/Image content */}
        <View style={styles.mediaContainer}>
          <Image
            source={{
              uri: item.type === 'image' ? item.contentUrl : item.product.image,
            }}
            style={styles.media}
            resizeMode='cover'
          />

          {item.type !== 'image' && (
            <TouchableOpacity style={styles.playButton} onPress={togglePlay}>
              <Ionicons
                name={isPlaying && index === currentIndex ? 'pause' : 'play'}
                size={40}
                color='rgba(255,255,255,0.8)'
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Product overlay */}
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => handleAddToCart(item.product)}
        >
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

        {/* Right action buttons */}
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={likedItems.includes(item.id) ? 'heart' : 'heart-outline'}
              size={32}
              color={likedItems.includes(item.id) ? '#ff2c55' : '#fff'}
            />
            <Text style={styles.actionCount}>{item.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='chatbubble-outline' size={28} color='#fff' />
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='arrow-redo-outline' size={28} color='#fff' />
            <Text style={styles.actionCount}>{item.shares}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name='bookmark-outline' size={28} color='#fff' />
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

        {/* Bottom content section */}
        <View style={styles.bottomContent}>
          <View style={styles.creatorInfo}>
            <TouchableOpacity style={styles.creator}>
              <Image
                source={{ uri: item.creator.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.creatorName}>{item.creator.name}</Text>
              {item.creator.verified && (
                <MaterialIcons
                  name='verified'
                  size={16}
                  color='#2E8C83'
                  style={styles.verifiedBadge}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followText}>Follow</Text>
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

  return (
    <View style={styles.container}>
      <RNStatusBar
        barStyle='light-content'
        translucent
        backgroundColor='transparent'
      />

      {/* Header */}
      <Animated.View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.headerLogo}>Mukulah</Text>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name='search' size={24} color='#fff' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name='notifications-outline' size={24} color='#fff' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons
              name='chatbubble-ellipses-outline'
              size={24}
              color='#fff'
            />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Feed */}
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

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.footerButtonActive]}
        >
          <Ionicons name='home' size={24} color='#fff' />
          <Text style={styles.footerButtonText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/(shop)/shop')}
        >
          <Ionicons name='search' size={24} color='#999' />
          <Text style={styles.footerButtonText}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/(shop)/cart')}
        >
          <View style={styles.recordButton}>
            <Ionicons name='add' size={32} color='#fff' />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/(shop)/orders')}
        >
          <Ionicons name='cart-outline' size={24} color='#999' />
          <Text style={styles.footerButtonText}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => router.push('/(shop)/profile')}
        >
          <Ionicons name='person-outline' size={24} color='#999' />
          <Text style={styles.footerButtonText}>Profile</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style='light' />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerLogo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 20,
  },
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
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionCount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
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
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  creatorName: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  followButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  followText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 6,
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
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonActive: {
    opacity: 1,
  },
  footerButtonText: {
    color: '#999',
    fontSize: 10,
    marginTop: 4,
  },
  recordButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2E8C83',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
})

export default Home
