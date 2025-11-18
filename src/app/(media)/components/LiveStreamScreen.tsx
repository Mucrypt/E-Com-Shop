import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  TextInput, // Added import
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useLocalSearchParams, router } from 'expo-router'
import { useAuth } from '../../../providers'
import { supabase } from '../../../lib/supabase'

const { width, height } = Dimensions.get('window')

const LiveStreamScreen = () => {
  const params = useLocalSearchParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id // Handle string | string[]
  const isHost = Array.isArray(params.isHost)
    ? params.isHost[0] === 'true'
    : params.isHost === 'true' // Handle string | string[]

  const [stream, setStream] = useState<any>(null)
  const [viewers, setViewers] = useState(0)
  const [messages, setMessages] = useState<any[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isFrontCamera, setIsFrontCamera] = useState(true)
  const [showProducts, setShowProducts] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [comment, setComment] = useState('')

  const { user } = useAuth()
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!id) return

    fetchStream()
    startPulseAnimation()

    // Set up realtime subscription for viewer count and messages
    const subscription = supabase
      .channel('live-stream-' + id)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_streams',
        },
        (payload) => {
          if (payload.new && payload.new.id === id) {
            setStream(payload.new)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [id])

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }

  const fetchStream = async () => {
    try {
      const { data, error } = await supabase
        .from('live_streams')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setStream(data)
    } catch (error) {
      console.error('Error fetching stream:', error)
      Alert.alert('Error', 'Could not load stream')
    }
  }

  const sendMessage = () => {
    if (!comment.trim() || !user) return // Check if user exists

    // In a real app, this would send the message to your backend
    const newMessage = {
      id: Date.now().toString(),
      user: {
        id: user.id,
        name:
          user.profile?.full_name ||
          user.email?.split('@')[0] ||
          'Unknown User',
        avatar: user.profile?.avatar_url,
      },
      message: comment,
      timestamp: new Date(),
    }

    setMessages((prev) => [newMessage, ...prev])
    setComment('')
  }

  const endStream = async () => {
    try {
      await supabase
        .from('live_streams')
        .update({ status: 'ended' })
        .eq('id', id)

      router.back()
    } catch (error) {
      console.error('Error ending stream:', error)
    }
  }

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!stream) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading stream...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Stream Video Content - Would be replaced with actual video component */}
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: 'https://example.com/stream-placeholder.jpg' }}
          style={styles.video}
          resizeMode='cover'
        />

        {/* Live Badge */}
        <View style={styles.liveBadge}>
          <Animated.View
            style={[styles.pulse, { transform: [{ scale: pulseAnim }] }]}
          />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Viewer Count */}
        <View style={styles.viewerCount}>
          <Ionicons name='people' size={16} color='#fff' />
          <Text style={styles.viewerCountText}>{viewers.toLocaleString()}</Text>
        </View>

        {/* Top Controls */}
        <SafeAreaView style={styles.topControls}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name='arrow-back' size={24} color='#fff' />
          </TouchableOpacity>

          <View style={styles.streamInfo}>
            <Text style={styles.streamTitle} numberOfLines={1}>
              {stream.title}
            </Text>
            <Text style={styles.creatorName}>
              {stream.creator?.full_name || 'Unknown Creator'}
            </Text>
          </View>
        </SafeAreaView>

        {/* Host Controls */}
        {isHost && (
          <View style={styles.hostControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCamera}
            >
              <Ionicons name='camera-reverse' size={24} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={24}
                color='#fff'
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowProducts(!showProducts)}
            >
              <Ionicons name='cart' size={24} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowInvite(!showInvite)}
            >
              <Ionicons name='person-add' size={24} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity style={styles.endButton} onPress={endStream}>
              <Text style={styles.endButtonText}>End</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.message}>
              <Image
                source={{ uri: msg.user.avatar }}
                style={styles.messageAvatar}
              />
              <View style={styles.messageContent}>
                <Text style={styles.messageUser}>{msg.user.name}</Text>
                <Text style={styles.messageText}>{msg.message}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder='Send a message...'
            value={comment}
            onChangeText={setComment}
            placeholderTextColor='#999'
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name='send' size={20} color='#2E8C83' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Panel */}
      {showProducts && stream.products && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Featured Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {stream.products.map((product: any) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <Text style={styles.productName} numberOfLines={1}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Invite Panel */}
      {showInvite && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Invite Viewers</Text>
          {/* List of followers to invite would go here */}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  videoContainer: {
    width,
    height: height * 0.7,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  liveBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF375F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pulse: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FF375F',
    borderRadius: 4,
    opacity: 0.5,
  },
  liveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  viewerCount: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewerCountText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  streamInfo: {
    flex: 1,
  },
  streamTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  creatorName: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  hostControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'center',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  endButton: {
    backgroundColor: '#FF375F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  endButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  message: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContent: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 12,
  },
  messageUser: {
    color: '#2E8C83',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    color: '#fff',
    fontSize: 14,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  commentInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#fff',
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  panelTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  productCard: {
    width: 120,
    marginRight: 12,
  },
  productImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  productPrice: {
    color: '#2E8C83',
    fontSize: 14,
    fontWeight: 'bold',
  },
})

export default LiveStreamScreen
