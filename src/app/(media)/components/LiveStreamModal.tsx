import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useAuth } from '../../../providers'
import { supabase } from '../../../lib/supabase'
import { router } from 'expo-router'

interface LiveStreamModalProps {
  visible: boolean
  onClose: () => void
}

const { width, height } = Dimensions.get('window')

const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  visible,
  onClose,
}) => {
  const [streamTitle, setStreamTitle] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('entertainment')
  const [isStarting, setIsStarting] = useState(false)
  const [invitedUsers, setInvitedUsers] = useState<any[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [streamQuality, setStreamQuality] = useState('hd')
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const { user, isAuthenticated } = useAuth()

  const categories = [
    { id: 'entertainment', name: 'Entertainment', icon: '🎭' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'cooking', name: 'Cooking', icon: '🍳' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
  ]

  const startLiveStream = async () => {
    if (!streamTitle.trim()) {
      Alert.alert('Error', 'Please enter a stream title')
      return
    }

    if (!isAuthenticated || !user) {
      // Added null check for user
      Alert.alert('Error', 'You must be logged in to go live')
      return
    }

    setIsStarting(true)

    try {
      // Create a new live stream record
      const { data: streamData, error } = await supabase
        .from('live_streams')
        .insert({
          creator_id: user.id,
          title: streamTitle,
          category: selectedCategory,
          is_private: isPrivate,
          quality: streamQuality,
          invited_users: invitedUsers.map((u) => u.id),
          product_ids: selectedProducts.map((p) => p.id),
          status: 'live',
        })
        .select()
        .single()

      if (error) throw error

      // Navigate to the live stream screen - fixed the params type
      router.push({
        pathname: '/live/[id]',
        params: { id: streamData.id, isHost: 'true' }, // Changed true to string 'true'
      })

      onClose()
    } catch (error: any) {
      console.error('Error starting live stream:', error)
      Alert.alert('Error', 'Failed to start live stream. Please try again.')
    } finally {
      setIsStarting(false)
    }
  }

  const simulateUserInvites = () => {
    Alert.alert(
      'Invite Users',
      'In a real implementation, you would select from your followers here.',
      [
        {
          text: 'Add Demo Users',
          onPress: () => {
            setInvitedUsers([
              {
                id: 'user1',
                name: 'Alex Johnson',
                avatar: 'https://example.com/avatar1.jpg',
              },
              {
                id: 'user2',
                name: 'Sam Wilson',
                avatar: 'https://example.com/avatar2.jpg',
              },
            ])
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  const simulateProductSelection = () => {
    Alert.alert(
      'Add Products',
      'Select products to showcase during your stream.',
      [
        {
          text: 'Add Demo Products',
          onPress: () => {
            setSelectedProducts([
              {
                id: 'prod1',
                name: 'Summer Dress',
                image: 'https://example.com/product1.jpg',
              },
              {
                id: 'prod2',
                name: 'Skincare Set',
                image: 'https://example.com/product2.jpg',
              },
            ])
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    )
  }

  if (!visible) return null

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name='close' size={24} color='#000' />
          </TouchableOpacity>
          <Text style={styles.title}>Go Live</Text>
          <TouchableOpacity
            style={[
              styles.goLiveButton,
              !streamTitle.trim() && styles.disabledButton,
            ]}
            onPress={startLiveStream}
            disabled={!streamTitle.trim() || isStarting}
          >
            {isStarting ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text style={styles.goLiveButtonText}>Go Live</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stream Details</Text>
            <View style={styles.creatorRow}>
              <Image
                source={{
                  uri:
                    user?.profile?.avatar_url ||
                    'https://via.placeholder.com/48',
                }}
                style={styles.userAvatar}
              />
              <View style={styles.creatorInfo}>
                <Text style={styles.creatorName}>
                  {user?.profile?.full_name || user?.email?.split('@')[0]}
                </Text>
                <Text style={styles.creatorBadge}>Live Streamer</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Stream Title</Text>
              <TextInput
                style={styles.textInput}
                placeholder='What are you streaming about?'
                value={streamTitle}
                onChangeText={setStreamTitle}
                maxLength={100}
                placeholderTextColor='#999'
              />
              <Text style={styles.charCount}>{streamTitle.length}/100</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id &&
                        styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === category.id &&
                          styles.selectedCategoryText,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stream Settings</Text>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Stream Quality</Text>
                <Text style={styles.settingDescription}>
                  Higher quality uses more data
                </Text>
              </View>
              <View style={styles.qualityButtons}>
                <TouchableOpacity
                  style={[
                    styles.qualityButton,
                    streamQuality === 'sd' && styles.activeQualityButton,
                  ]}
                  onPress={() => setStreamQuality('sd')}
                >
                  <Text
                    style={[
                      styles.qualityButtonText,
                      streamQuality === 'sd' && styles.activeQualityButtonText,
                    ]}
                  >
                    SD
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.qualityButton,
                    streamQuality === 'hd' && styles.activeQualityButton,
                  ]}
                  onPress={() => setStreamQuality('hd')}
                >
                  <Text
                    style={[
                      styles.qualityButtonText,
                      streamQuality === 'hd' && styles.activeQualityButtonText,
                    ]}
                  >
                    HD
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.qualityButton,
                    streamQuality === 'fhd' && styles.activeQualityButton,
                  ]}
                  onPress={() => setStreamQuality('fhd')}
                >
                  <Text
                    style={[
                      styles.qualityButtonText,
                      streamQuality === 'fhd' && styles.activeQualityButtonText,
                    ]}
                  >
                    FHD
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>Privacy</Text>
                <Text style={styles.settingDescription}>
                  {isPrivate
                    ? 'Only invited users can join'
                    : 'Anyone can join your stream'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.switchContainer}
                onPress={() => setIsPrivate(!isPrivate)}
              >
                <Text style={styles.switchLabel}>
                  {isPrivate ? 'Private' : 'Public'}
                </Text>
                <View style={[styles.switch, isPrivate && styles.switchActive]}>
                  <View
                    style={[
                      styles.switchThumb,
                      isPrivate && styles.switchThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {isPrivate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Invite Viewers</Text>
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={simulateUserInvites}
              >
                <Ionicons name='person-add' size={20} color='#2E8C83' />
                <Text style={styles.inviteButtonText}>Invite Users</Text>
              </TouchableOpacity>

              {invitedUsers.length > 0 && (
                <View style={styles.invitedList}>
                  {invitedUsers.map((user) => (
                    <View key={user.id} style={styles.invitedUser}>
                      <Image
                        source={{ uri: user.avatar }}
                        style={styles.invitedUserAvatar}
                      />
                      <Text style={styles.invitedUserName}>{user.name}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity
              style={styles.addProductButton}
              onPress={simulateProductSelection}
            >
              <Ionicons name='cart' size={20} color='#2E8C83' />
              <Text style={styles.addProductButtonText}>Add Products</Text>
            </TouchableOpacity>

            {selectedProducts.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.productsScroll}
              >
                {selectedProducts.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                    />
                    <Text style={styles.productName} numberOfLines={1}>
                      {product.name}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  goLiveButton: {
    backgroundColor: '#FF375F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  goLiveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  creatorInfo: {
    flex: 1,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  creatorBadge: {
    fontSize: 12,
    color: '#FF375F',
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  categoryScroll: {
    marginHorizontal: -4,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#2E8C83',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  qualityButtons: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 2,
  },
  qualityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeQualityButton: {
    backgroundColor: '#2E8C83',
  },
  qualityButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  activeQualityButtonText: {
    color: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
    color: '#333',
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#2E8C83',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    position: 'absolute',
    left: 2,
  },
  switchThumbActive: {
    left: 24,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  inviteButtonText: {
    marginLeft: 8,
    color: '#2E8C83',
    fontWeight: '600',
  },
  invitedList: {
    marginTop: 8,
  },
  invitedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  invitedUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  invitedUserName: {
    fontSize: 14,
    fontWeight: '500',
  },
  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9f8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  addProductButtonText: {
    marginLeft: 8,
    color: '#2E8C83',
    fontWeight: '600',
  },
  productsScroll: {
    marginHorizontal: -4,
  },
  productCard: {
    width: 100,
    marginRight: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 4,
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
  },
})

export default LiveStreamModal
