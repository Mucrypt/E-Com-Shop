import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useCommentSheet } from '../../../../src/hooks/useCommentSheet'
import ProgressiveImage from '../ui/ProgressiveImage'
import AnimatedButton from '../ui/AnimatedButton'
import { styles } from '../../../../src/styles/CommentSheet.styles'

const { height } = Dimensions.get('window')

interface Comment {
  id: string
  user: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  text: string
  likes: number
  createdAt: string
  isLiked: boolean
}

interface CommentSheetProps {
  isVisible: boolean
  onClose: () => void
  itemId: string
  comments: Comment[]
}

const CommentSheet: React.FC<CommentSheetProps> = ({
  isVisible,
  onClose,
  itemId,
  comments: initialComments,
}) => {
  const [newComment, setNewComment] = useState('')
  const { comments, addComment, likeComment, translateY, opacity } =
    useCommentSheet(isVisible, itemId, initialComments)

  const handleSubmitComment = useCallback(() => {
    if (newComment.trim()) {
      addComment(newComment.trim())
      setNewComment('')
    }
  }, [newComment, addComment])

  const renderComment = useCallback(
    ({ item }: { item: Comment }) => (
      <View style={styles.commentContainer}>
        <ProgressiveImage
          source={{ uri: item.user.avatar }}
          style={styles.commentAvatar}
          resizeMode='cover'
        />

        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUsername}>{item.user.name}</Text>
            {item.user.verified && (
              <Ionicons
                name='checkmark-circle'
                size={14}
                color='#2E8C83'
                style={styles.verifiedBadge}
              />
            )}
            <Text style={styles.commentTime}>{item.createdAt}</Text>
          </View>

          <Text style={styles.commentText}>{item.text}</Text>

          <View style={styles.commentActions}>
            <AnimatedButton
              onPress={() => likeComment(item.id)}
              style={styles.commentActionButton}
              scaleTo={0.9}
            >
              <Ionicons
                name={item.isLiked ? 'heart' : 'heart-outline'}
                size={14}
                color={item.isLiked ? '#ff2c55' : '#666'}
              />
              <Text
                style={[
                  styles.commentActionText,
                  item.isLiked && styles.likedActionText,
                ]}
              >
                {item.likes > 0 ? item.likes : ''}
              </Text>
            </AnimatedButton>

            <AnimatedButton
              onPress={() => {}}
              style={styles.commentActionButton}
              scaleTo={0.9}
            >
              <Text style={styles.commentActionText}>Reply</Text>
            </AnimatedButton>
          </View>
        </View>
      </View>
    ),
    [likeComment]
  )

  if (!isVisible) return null

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </Text>
          <AnimatedButton onPress={onClose} style={styles.closeButton}>
            <Ionicons name='close' size={24} color='#000' />
          </AnimatedButton>
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.commentsList}
          keyboardDismissMode='interactive'
          keyboardShouldPersistTaps='handled'
        />

        {/* Comment Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >
          <ProgressiveImage
            source={{ uri: 'https://example.com/current-user-avatar.jpg' }}
            style={styles.inputAvatar}
            resizeMode='cover'
          />
          <TextInput
            style={styles.input}
            placeholder='Add a comment...'
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <AnimatedButton
            onPress={handleSubmitComment}
            style={[
              styles.sendButton,
              !newComment.trim() && styles.sendButtonDisabled,
            ]}
            disabled={!newComment.trim()}
          >
            <Ionicons
              name='send'
              size={20}
              color={newComment.trim() ? '#2E8C83' : '#ccc'}
            />
          </AnimatedButton>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  )
}

export default CommentSheet
