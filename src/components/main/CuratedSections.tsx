// components/main/CuratedSections.tsx
import React from 'react'
import { View, StyleSheet } from 'react-native'
import CuratedSectionCard from './CuratedSectionCard'
import { router } from 'expo-router'

type Props = {
  activeCategory: string
}

const CuratedSections: React.FC<Props> = ({ activeCategory }) => {
  const sections = [
    {
      key: 'for-you',
      title: `For You • ${activeCategory}`,
      subtitle:
        'Curated products, videos, jobs and offers based on what you love. The feed learns from your clicks.',
      badge: 'Personal Feed',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      route: '/(shop)',
    },
    {
      key: 'commerce',
      title: 'Smart Marketplace',
      subtitle:
        'Discover new brands, second-hand deals and local sellers. Built for creators and small businesses.',
      badge: 'Marketplace',
      imageUrl:
        'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=300&q=80',
      route: '/(shop)',
    },
    {
      key: 'media',
      title: 'Media & Stories',
      subtitle:
        'Short videos, live rooms and story-style posts. Built to drive sales, not just likes.',
      badge: 'Media',
      imageUrl:
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=300&q=80',
      route: '/(media)',
    },
    {
      key: 'jobs',
      title: 'Jobs & Opportunities',
      subtitle:
        'Side gigs, remote work and talent requests from the Mukulah ecosystem and beyond.',
      badge: 'Jobs',
      imageUrl:
        'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=300&q=80',
      route: '/jobs',
    },
    {
      key: 'services',
      title: 'Services Around You',
      subtitle:
        'From builders and designers to tutors and drivers. One place to offer and request services.',
      badge: 'Services',
      imageUrl:
        'https://images.unsplash.com/photo-1520607162513-4c8b1a1d9ad9?auto=format&fit=crop&w=300&q=80',
      route: '/services',
    },
    {
      key: 'sports-crypto',
      title: 'Sports & Crypto Pulse',
      subtitle:
        'Live scores, odds and crypto market snapshots so you never miss a move on or off the pitch.',
      badge: 'Live Pulse',
      imageUrl:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
      route: '/sports-live',
    },
  ]

  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <CuratedSectionCard
          key={section.key}
          title={section.title}
          subtitle={section.subtitle}
          badge={section.badge}
          imageUrl={section.imageUrl}
          onPress={() => router.push(section.route as any)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
})

export default CuratedSections
