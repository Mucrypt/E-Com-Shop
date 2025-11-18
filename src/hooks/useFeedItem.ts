import { useState, useCallback } from 'react'
import { useCart } from './useCart'
import { supabase } from '../lib/supabase'

export const useFeedItem = (itemId: string) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const { addToCart } = useCart()

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const toggleLike = useCallback(async () => {
    try {
      // Optimistic update
      setIsLiked((prev) => !prev)

      // Update in database
      const { error } = await supabase.from('feed_likes').upsert({
        feed_item_id: itemId,
        liked: !isLiked,
      })

      if (error) {
        // Revert if error
        setIsLiked((prev) => !prev)
        throw error
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }, [itemId, isLiked])

  const toggleBookmark = useCallback(async () => {
    try {
      setIsBookmarked((prev) => !prev)

      const { error } = await supabase.from('feed_bookmarks').upsert({
        feed_item_id: itemId,
        bookmarked: !isBookmarked,
      })

      if (error) throw error
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      setIsBookmarked((prev) => !prev)
    }
  }, [itemId, isBookmarked])

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev)
  }, [])

  const handleAddToCart = useCallback(
    (product: any) => {
      addToCart(product)
    },
    [addToCart]
  )

  return {
    isPlaying,
    isLiked,
    isBookmarked,
    showComments,
    togglePlay,
    toggleLike,
    toggleBookmark,
    toggleComments,
    handleAddToCart,
  }
}
