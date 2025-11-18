import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useFeed = () => {
  const [feedData, setFeedData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchFeed = useCallback(
    async (pageNum: number, isRefreshing = false) => {
      try {
        if (isRefreshing) {
          setIsLoading(true)
        }

        const { data, error } = await supabase
          .from('social_feed')
          .select(
            `
          *,
          creator:creator_id(*),
          product:product_id(*),
          comments:feed_comments(count)
        `
          )
          .order('created_at', { ascending: false })
          .range(pageNum * 10, (pageNum + 1) * 10 - 1)

        if (error) throw error

        if (data) {
          if (isRefreshing) {
            setFeedData(data)
          } else {
            setFeedData((prev) => [...prev, ...data])
          }
          setHasMore(data.length === 10)
        }
      } catch (error) {
        console.error('Error fetching feed:', error)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchFeed(nextPage)
    }
  }, [page, isLoading, hasMore, fetchFeed])

  const refresh = useCallback(() => {
    setPage(0)
    setHasMore(true)
    fetchFeed(0, true)
  }, [fetchFeed])

  useEffect(() => {
    fetchFeed(0)
  }, [fetchFeed])

  return {
    feedData,
    isLoading,
    loadMore,
    refresh,
    hasMore,
  }
}
