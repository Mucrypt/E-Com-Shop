import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../../../providers'
import { supabase } from '../../../lib/supabase'
import NetInfo from '@react-native-community/netinfo'


interface CreatePostModalProps {
  visible: boolean
  onClose: () => void
  onOpenLiveStream?: () => void
}

// Add the getMimeType helper function outside the component
const getMimeType = (extension: string): string => {
  const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    webm: 'video/webm',
  }
  return mimeTypes[extension] || 'application/octet-stream'
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onOpenLiveStream,
}) => {
  const [newPostCaption, setNewPostCaption] = useState('')
  const [newPostType, setNewPostType] = useState<'video' | 'image'>('image')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  )

  // Use the auth hook correctly
  const { user: authUser, isAuthenticated } = useAuth()

  // Add authentication check
  React.useEffect(() => {
    if (visible && !isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to create a post', [
        {
          text: 'OK',
          onPress: onClose,
        },
      ])
    }
  }, [visible, isAuthenticated, onClose])

const pickMedia = async () => {
  try {
    let result: ImagePicker.ImagePickerResult

    if (newPostType === 'image') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60, // Limit to 60 seconds
      })
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]

      // Check file size (optional)
      if (asset.fileSize && asset.fileSize > 50 * 1024 * 1024) {
        // 50MB limit
        Alert.alert('File too large', 'Please select a file smaller than 50MB')
        return
      }

      setSelectedMedia(asset.uri)
    }
  } catch (error) {
    console.error('Error picking media:', error)
    Alert.alert('Error', 'Failed to pick media')
  }
}

  const uploadMedia = async (uri: string): Promise<string> => {
    try {
      if (!authUser?.id) {
        throw new Error('User not authenticated')
      }

      console.log('Starting media upload from URI:', uri)

      // Extract file extension
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg'
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `posts/${authUser.id}/${fileName}`

      // For React Native, we use fetch to get the file and upload it
      const response = await fetch(uri)
      const blob = await response.blob()

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('posts')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: getMimeType(fileExt),
        })

      if (error) {
        console.error('Supabase upload error:', error)

        // Check if it's a storage policy error
        if (
          error.message.includes('policy') ||
          error.message.includes('permission')
        ) {
          throw new Error(
            'Storage permissions not configured. Please contact support.'
          )
        }

        // Check if it's a network error
        if (error.message.includes('Network')) {
          throw new Error(
            'Network error. Please check your internet connection.'
          )
        }

        throw error
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('posts').getPublicUrl(filePath)
      console.log('Upload successful. Public URL:', publicUrl)

      return publicUrl
    } catch (error: any) {
      console.error('Error uploading media:', error)
      throw new Error(`Failed to upload media: ${error.message}`)
    }
  }



const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  } catch (error) {
    console.error('Error checking network:', error);
    return false;
  }

};



  const uploadPost = async () => {
    // Check authentication first
    if (!isAuthenticated || !authUser?.id) {
      Alert.alert('Error', 'You must be logged in to create a post')
      return
    }

    if (!newPostCaption.trim()) {
      Alert.alert('Error', 'Please write a caption')
      return
    }

    if (!selectedMedia) {
      Alert.alert('Error', 'Please select media to post')
      return
    }

    setIsUploading(true)

    try {
      // Upload media first
      const mediaUrl = await uploadMedia(selectedMedia)

      // Insert post into social_feed table
      const { data: postData, error: postError } = await supabase
        .from('social_feed')
        .insert({
          creator_id: authUser.id,
          media_url: mediaUrl,
          media_type: newPostType,
          caption: newPostCaption.trim(),
          product_id: selectedProductId,
        })
        .select()
        .single()

      if (postError) {
        console.error('Supabase error:', postError)
        throw postError
      }

      Alert.alert('Success', 'Post created successfully!')
      onClose()
      setNewPostCaption('')
      setSelectedMedia(null)
      setSelectedProductId(null)
    } catch (error: any) {
      console.error('Error creating post:', error)

      let errorMessage = 'Failed to create post'
      if (error.message.includes('null value in column "creator_id"')) {
        errorMessage = 'Authentication error. Please log in again.'
      } else if (error.message.includes('User not authenticated')) {
        errorMessage = 'You must be logged in to create a post'
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (
        error.message.includes('policy') ||
        error.message.includes('permission')
      ) {
        errorMessage = 'Storage permissions issue. Please contact support.'
      } else {
        errorMessage = error.message || errorMessage
      }

      Alert.alert('Error', errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  const simulateProductSelection = () => {
    Alert.alert(
      'Product Selection',
      'In a real implementation, you would select a product here. Using demo product for testing.',
      [
        {
          text: 'Use Demo Product',
          onPress: () => setSelectedProductId('demo-product-id'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  if (!visible) return null

  // Show loading or auth message if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.createHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name='close' size={24} color='#000' />
            </TouchableOpacity>
            <Text style={styles.createTitle}>Create Post</Text>
          </View>
          <View style={styles.authMessageContainer}>
            <Text style={styles.authMessage}>
              Please log in to create posts
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.createHeader}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name='close' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.createTitle}>Create Post</Text>
          <TouchableOpacity
            style={[
              styles.postButton,
              (!newPostCaption.trim() || !selectedMedia) &&
                styles.disabledButton,
            ]}
            onPress={uploadPost}
            disabled={!newPostCaption.trim() || !selectedMedia || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text style={styles.postButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.createContent}>
          {/* Create Type Selector */}
          <View style={styles.createTypeSelector}>
            <TouchableOpacity style={styles.createTypeButton}>
              <View style={styles.createTypeButtonContent}>
                <Feather name="edit-3" size={24} color="#2E8C83" />
                <Text style={styles.createTypeButtonText}>Create Post</Text>
                <Text style={styles.createTypeButtonSubtext}>Share photos, videos and thoughts</Text>
              </View>
            </TouchableOpacity>
            
            {onOpenLiveStream && (
              <TouchableOpacity 
                style={styles.createTypeButton}
                onPress={() => {
                  onClose()
                  onOpenLiveStream()
                }}
              >
                <View style={styles.createTypeButtonContent}>
                  <Feather name="video" size={24} color="#FF375F" />
                  <Text style={[styles.createTypeButtonText, { color: '#FF375F' }]}>Go Live</Text>
                  <Text style={styles.createTypeButtonSubtext}>Start a live stream</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.creatorRow}>
            <Image
              source={{
                uri:
                  authUser?.profile?.avatar_url ||
                  'https://via.placeholder.com/48',
              }}
              style={styles.userAvatar}
            />
            <View>
              <Text style={styles.creatorNameCreate}>
                {authUser?.profile?.full_name || authUser?.email?.split('@')[0]}
              </Text>
              <View style={styles.postTypeSelector}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newPostType === 'video' && styles.activeTypeButton,
                  ]}
                  onPress={() => setNewPostType('video')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newPostType === 'video' && styles.activeTypeButtonText,
                    ]}
                  >
                    Video
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    newPostType === 'image' && styles.activeTypeButton,
                  ]}
                  onPress={() => setNewPostType('image')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      newPostType === 'image' && styles.activeTypeButtonText,
                    ]}
                  >
                    Image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TextInput
            style={styles.captionInput}
            placeholder='Write a caption...'
            value={newPostCaption}
            onChangeText={setNewPostCaption}
            multiline
            numberOfLines={4}
            placeholderTextColor='#999'
          />

          <TouchableOpacity style={styles.uploadArea} onPress={pickMedia}>
            {selectedMedia ? (
              <Image
                source={{ uri: selectedMedia }}
                style={styles.selectedMedia}
                resizeMode='cover'
              />
            ) : (
              <>
                <Feather name='upload' size={40} color='#2E8C83' />
                <Text style={styles.uploadText}>
                  {newPostType === 'video'
                    ? 'Select a video'
                    : 'Select an image'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  {newPostType === 'video'
                    ? 'MP4, MOV • Up to 5 minutes'
                    : 'JPG, PNG • Up to 20MB'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={simulateProductSelection}
            >
              <Feather name='shopping-bag' size={20} color='#333' />
              <Text style={styles.optionText}>
                {selectedProductId ? 'Product Selected' : 'Add Product'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Feather name='map-pin' size={20} color='#333' />
              <Text style={styles.optionText}>Add Location</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity style={styles.optionButton}>
              <Feather name='hash' size={20} color='#333' />
              <Text style={styles.optionText}>Add Hashtags</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Feather name='music' size={20} color='#333' />
              <Text style={styles.optionText}>Add Sound</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  createHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  createTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  postButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  createContent: {
    flex: 1,
    padding: 16,
  },
  createTypeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  createTypeButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  createTypeButtonContent: {
    alignItems: 'center',
  },
  createTypeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8C83',
    marginTop: 8,
    marginBottom: 4,
  },
  createTypeButtonSubtext: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  creatorRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  creatorNameCreate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postTypeSelector: {
    flexDirection: 'row',
    backgroundColor: '##f0f0f0',
    borderRadius: 20,
    padding: 4,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeTypeButton: {
    backgroundColor: '#2E8C83',
  },
  authMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  typeButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#2E8C83',
    borderRadius: 12,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  selectedMedia: {
    width: '100%',
    height: '100%',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E8C83',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#999',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 6,
  },
  optionText: {
    marginLeft: 8,
    fontWeight: '500',
  },
})

export default CreatePostModal
