import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatNumber } from '../../../utils/formatters'

interface CommentsModalProps {
  visible: boolean
  post: any
  onClose: () => void
  user: any
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  visible,
  post,
  onClose,
  user,
}) => {
  const [commentText, setCommentText] = useState('')
  const commentInputRef = useRef<TextInput>(null)

  const addComment = () => {
    if (!commentText.trim()) return
    // Add comment logic
    setCommentText('')
    commentInputRef.current?.blur()
  }

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{item.user.name}</Text>
        <Text style={styles.commentText}>{item.comment}</Text>
        <View style={styles.commentMeta}>
          <Text style={styles.commentTime}>{item.created_at}</Text>
          <Text style={styles.commentLikes}>
            {formatNumber(item.likes)} likes
          </Text>
          <TouchableOpacity>
            <Text style={styles.commentReply}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.commentLikeBtn}>
        <Ionicons name='heart-outline' size={16} color='#666' />
      </TouchableOpacity>
    </View>
  )

  if (!visible) return null

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>
            {post?.comments || 0} Comments
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name='close' size={24} color='#000' />
          </TouchableOpacity>
        </View>

        <FlatList
          data={post?.commentsList || []}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          style={styles.commentsList}
          ListEmptyComponent={
            <Text style={styles.noCommentsText}>No comments yet</Text>
          }
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.commentInputContainer}
        >
          <Image
            source={{
              uri: user?.avatar_url || 'https://example.com/default-avatar.jpg',
            }}
            style={styles.userAvatarSmall}
          />
          <TextInput
            ref={commentInputRef}
            style={styles.commentInput}
            placeholder='Add a comment...'
            value={commentText}
            onChangeText={setCommentText}
            placeholderTextColor='#999'
          />
          <TouchableOpacity
            style={[
              styles.postCommentButton,
              !commentText.trim() && styles.disabledButton,
            ]}
            onPress={addComment}
            disabled={!commentText.trim()}
          >
            <Text style={styles.postCommentText}>Post</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
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
  commentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  commentsList: {
    flex: 1,
  },
  noCommentsText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
  commentItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    marginBottom: 6,
    lineHeight: 18,
  },
  commentMeta: {
    flexDirection: 'row',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  commentLikes: {
    fontSize: 12,
    color: '#999',
    marginRight: 12,
  },
  commentReply: {
    fontSize: 12,
    color: '#2E8C83',
    fontWeight: '600',
  },
  commentLikeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  userAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  postCommentButton: {
    backgroundColor: '#2E8C83',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  postCommentText: {
    color: '#fff',
    fontWeight: '600',
  },
})

export default CommentsModal
