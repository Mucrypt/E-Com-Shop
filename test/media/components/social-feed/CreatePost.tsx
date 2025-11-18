import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { supabase } from '../../../../src/lib/supabase'
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
  Animated,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from '@react-native-community/blur'
import { Picker } from 'emoji-mart-native'
import { useCreatePost } from '../../../../src/hooks/useCreatePost'
import { useAuth } from '../../../../src/contexts/AuthContext'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'react-native-haptic-feedback'

const friendsList = ['alice', 'bob', 'charlie', 'diana', 'eve']

export default function CreatePost({
  onPostCreated,
}: {
  onPostCreated?: () => void
}) {
  const [content, setContent] = useState('')
  const [media, setMedia] = useState<Array<{ uri: string; type: string }>>([])
  const [uploading, setUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [fadeAnim] = useState(new Animated.Value(0))
  const { user } = useAuth()
  const createPostMutation = useCreatePost()

  // Animate in
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  // Pick image or video
  const handleMediaPick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Allow access to your media library.')
      return
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      videoQuality: 1,
      selectionLimit: 4,
    })
    if (pickerResult.canceled || !pickerResult.assets?.length) return
    setMedia([
      ...media,
      ...pickerResult.assets
        .filter((a) => a.uri && a.type)
        .map((a) => ({ uri: a.uri, type: String(a.type || 'image') })),
    ])
    Haptics.trigger('impactLight')
  }

  // Remove media
  const handleRemoveMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index))
    Haptics.trigger('notificationWarning')
  }

  // Emoji picker
  const handleEmojiSelect = (emoji: any) => {
    setContent(content + emoji.native)
    setShowEmojiPicker(false)
    Haptics.trigger('impactLight')
  }

  // Location tagging
  const handleLocationTag = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.')
      return
    }
    let loc = await Location.getCurrentPositionAsync({})
    let address = await Location.reverseGeocodeAsync(loc.coords)
    if (address.length) {
      setLocation(`${address[0].city}, ${address[0].country}`)
      Haptics.trigger('impactLight')
    }
  }

  // Tag friends
  const handleTagInput = (text: string) => {
    setTagInput(text)
    if (friendsList.includes(text.toLowerCase()) && !tags.includes(text)) {
      setTags([...tags, text])
      setTagInput('')
      Haptics.trigger('impactLight')
    }
  }

  // Upload all media and create post
  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) return
    if (!user?.id) return
    setUploading(true)
    try {
      let mediaUrls: string[] = []
      for (const m of media) {
        const response = await fetch(m.uri)
        const blob = await response.blob()
        const ext = m.uri.split('.').pop()
        const fileName = `post-media-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`
        const { error } = await supabase.storage
          .from('media')
          .upload(fileName, blob, {
            cacheControl: '3600',
            upsert: false,
          })
        if (error) throw error
        const { data: publicUrlData } = supabase.storage
          .from('media')
          .getPublicUrl(fileName)
        if (publicUrlData?.publicUrl) mediaUrls.push(publicUrlData.publicUrl)
      }
      createPostMutation.mutate(
        {
          user_id: user.id,
          content,
          media_url: mediaUrls.join(','),
        },
        {
          onSuccess: () => {
            setContent('')
            setMedia([])
            setLocation(null)
            setTags([])
            onPostCreated?.()
            Alert.alert('Success', 'Your post was published!')
            Haptics.trigger('notificationSuccess')
          },
        }
      )
    } catch (err: any) {
      Alert.alert('Upload failed', err.message)
      Haptics.trigger('notificationError')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#e0e7ff', '#fff']}
        style={StyleSheet.absoluteFill}
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType='light'
        blurAmount={8}
      />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Create a Post</Text>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={500}
        />
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowEmojiPicker(true)}
          >
            <FontAwesome name='smile-o' size={24} color='#2E8C83' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleLocationTag}>
            <Ionicons name='location' size={24} color='#2E8C83' />
          </TouchableOpacity>
          <Text style={styles.location}>
            {location ? `📍 ${location}` : ''}
          </Text>
        </View>
        {showEmojiPicker && (
          <Picker
            onSelect={handleEmojiSelect}
            theme='light'
            style={{ marginBottom: 12 }}
          />
        )}
        <View style={styles.tagRow}>
          <TextInput
            style={styles.tagInput}
            placeholder='Tag friends...'
            value={tagInput}
            onChangeText={handleTagInput}
          />
          <View style={styles.tags}>
            {tags.map((t, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>@{t}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mediaPreview}>
          {media.map((m, i) => (
            <View key={i} style={styles.mediaItem}>
              {m.type === 'video' ? (
                <Ionicons name='videocam' size={32} color='#2E8C83' />
              ) : (
                <Image source={{ uri: m.uri }} style={styles.media} />
              )}
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => handleRemoveMedia(i)}
              >
                <FontAwesome name='close' size={18} color='#fff' />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.mediaButton}
            onPress={handleMediaPick}
          >
            <Text style={styles.mediaButtonText}>Add Media</Text>
          </TouchableOpacity>
          <Button
            title={uploading ? 'Posting...' : 'Post'}
            onPress={handleSubmit}
            disabled={uploading || (!content.trim() && media.length === 0)}
          />
        </View>
        {createPostMutation.isError && (
          <Text style={styles.error}>
            Error: {createPostMutation.error?.message}
          </Text>
        )}
        {uploading && <ActivityIndicator style={{ marginTop: 8 }} />}
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    minHeight: 80,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBtn: {
    marginRight: 12,
    padding: 8,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
  },
  location: {
    fontSize: 15,
    color: '#2E8C83',
    marginLeft: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 15,
    backgroundColor: '#fafafa',
    marginRight: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  tagText: {
    color: '#2E8C83',
    fontWeight: 'bold',
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#2E8C83',
    borderRadius: 12,
    padding: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  mediaButton: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  mediaButtonText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
})
