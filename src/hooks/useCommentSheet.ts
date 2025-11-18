import { useState, useRef, useEffect } from 'react'
import { Animated } from 'react-native'

export interface User {
  id: string
  name: string
  avatar: string
  verified: boolean
}

export interface Comment {
  id: string
  user: User
  text: string
  likes: number
  createdAt: string
  isLiked: boolean
}

export function useCommentSheet(
  isVisible: boolean,
  itemId: string,
  initialComments: Comment[]
) {
  const [comments, setComments] = useState<Comment[]>(initialComments || [])
  const [opacity] = useState<Animated.Value>(
    new Animated.Value(isVisible ? 1 : 0)
  )
  const [translateY] = useState<Animated.Value>(
    new Animated.Value(isVisible ? 0 : 500)
  )

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start()
    Animated.timing(translateY, {
      toValue: isVisible ? 0 : 500,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }, [isVisible, opacity, translateY])

  const addComment = (text: string) => {
    setComments((prev: Comment[]) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        user: {
          id: 'current',
          name: 'You',
          avatar: 'https://example.com/current-user-avatar.jpg',
          verified: false,
        },
        text,
        likes: 0,
        createdAt: 'now',
        isLiked: false,
      },
    ])
  }

  const likeComment = (id: string) => {
    setComments((prev: Comment[]) =>
      prev.map((c: Comment) =>
        c.id === id
          ? {
              ...c,
              isLiked: !c.isLiked,
              likes: c.isLiked ? c.likes - 1 : c.likes + 1,
            }
          : c
      )
    )
  }

  return { comments, addComment, likeComment, translateY, opacity }
}
