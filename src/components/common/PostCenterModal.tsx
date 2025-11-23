import React from 'react'
import { Modal, View, StyleSheet, StatusBar } from 'react-native'
import { usePostCenter } from '../../hooks/usePostCenter'
import PostCenter from '../post/PostCenter'
import { Colors } from '../../constants'

interface PostCenterModalProps {
  // Optional props for customization
}

const PostCenterModal: React.FC<PostCenterModalProps> = () => {
  const { isVisible, closePostCenter } = usePostCenter()

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      presentationStyle="pageSheet"
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background.primary} />
      <View style={styles.container}>
        <PostCenter onClose={closePostCenter} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
})

export default PostCenterModal