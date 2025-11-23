import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

type BlogItem = {
  key: string
  title: string
  category: string
  readTime: string
  imageUrl: string
  route: string
}

const blogItems: BlogItem[] = [
  {
    key: 'vision',
    title: 'Why Mukulah is more than an app',
    category: 'Vision',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1520607162513-4c8b1a1d9ad9?auto=format&fit=crop&w=300&q=80',
    route: '/blog/mukulah-vision',
  },
  {
    key: 'creators',
    title: 'Turning followers into real customers',
    category: 'Creators',
    readTime: '3 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&q=80',
    route: '/blog/creator-commerce',
  },
  {
    key: 'africa',
    title: 'Building digital infrastructure for Africa & beyond',
    category: 'Ecosystem',
    readTime: '5 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300&q=80',
    route: '/blog/africa-internet',
  },
]

const BlogHighlights: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Mukulah Journal</Text>
        <TouchableOpacity onPress={() => router.push('/blog')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {blogItems.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={styles.card}
          activeOpacity={0.9}
          onPress={() => router.push(item.route as any)}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode='cover'
          />
          <View style={styles.textBlock}>
            <View style={styles.metaRow}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.readTime}>{item.readTime}</Text>
            </View>
            <Text style={styles.postTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  seeAll: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#0B0F1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
  },
  textBlock: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  category: {
    fontSize: 10,
    color: '#F5C451',
  },
  dot: {
    fontSize: 10,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  readTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  postTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
})

export default BlogHighlights
