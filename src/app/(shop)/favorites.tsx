import React, { useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesome } from '@expo/vector-icons'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../providers'
import { router } from 'expo-router'

type FavoriteProduct = {
  id: string
  name: string
  price: number
  image_url: string | null
}

export default function FavoritesScreen() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const qc = useQueryClient()

  const { data, isLoading: loadingFavs, error } = useQuery({
    queryKey: ['favorites', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      // Step 1: get product ids from favorites
      const { data: favs, error: favErr } = await supabase
        .from('favorites')
        .select('product_id, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (favErr) throw favErr

      const ids = (favs || [])
        .map((f) => f.product_id)
        .filter((id): id is string => !!id)

      if (ids.length === 0) return [] as FavoriteProduct[]

      // Step 2: fetch product details
      const { data: products, error: prodErr } = await supabase
        .from('products')
        .select('id,name,price,image_url')
        .in('id', ids)

      if (prodErr) throw prodErr

      // preserve order like favorites
      const map = new Map(products?.map((p) => [p.id, p]))
      const ordered = ids
        .map((id) => map.get(id))
        .filter(Boolean) as FavoriteProduct[]
      return ordered
    },
  })

  const favorites = useMemo(() => data ?? [], [data])

  const removeFavorite = async (productId: string) => {
    if (!user?.id) return
    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
    await qc.invalidateQueries({ queryKey: ['favorites', user.id] })
  }

  if (isLoading || loadingFavs) {
    return (
      <View style={styles.centered}> 
        <Text style={styles.muted}>Loading favorites…</Text>
      </View>
    )
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.centered}>
        <FontAwesome name='heart-o' size={42} color='#999' />
        <Text style={styles.title}>Sign in to view favorites</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.ctaText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <FontAwesome name='heart-o' size={42} color='#999' />
        <Text style={styles.title}>Your favorites is empty</Text>
        <Text style={styles.muted}>Browse products and tap the heart.</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/(shop)/shop')}
        >
          <Text style={styles.ctaText}>Discover Products</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>My Favorites</Text>
      <FlatList
        data={favorites}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() => router.push(`/product/${item.id}`)}
              style={styles.imageWrap}
              activeOpacity={0.85}
            >
              <Image
                source={{ uri: item.image_url || 'https://via.placeholder.com/300x300.png?text=Product' }}
                style={styles.image}
                resizeMode='cover'
              />
            </TouchableOpacity>

            <View style={styles.cardInfo}>
              <Text numberOfLines={1} style={styles.productName}>
                {item.name}
              </Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.unfav}
              onPress={() => removeFavorite(item.id)}
            >
              <FontAwesome name='heart' size={18} color='#bf0e40ff' />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
    marginHorizontal: 12,
    marginBottom: 4,
    color: '#111',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: { fontSize: 18, fontWeight: '600', marginTop: 10, color: '#222' },
  muted: { fontSize: 14, color: '#777', marginTop: 6, textAlign: 'center' },
  cta: {
    marginTop: 14,
    backgroundColor: '#2E8C83',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imageWrap: { width: '100%', aspectRatio: 1 },
  image: { width: '100%', height: '100%' },
  cardInfo: { paddingHorizontal: 10, paddingVertical: 8 },
  productName: { fontSize: 14, fontWeight: '600', color: '#222' },
  price: { marginTop: 2, fontSize: 13, color: '#2E8C83', fontWeight: '700' },
  unfav: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
