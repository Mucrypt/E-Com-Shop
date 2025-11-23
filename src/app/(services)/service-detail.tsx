// app/(services)/service-detail.tsx
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function ServiceDetailScreen() {
  const router = useRouter()

  return (
    <View style={styles.root}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.categoryLabel}>Branding & Logo Design</Text>
          <Text style={styles.title}>
            I will design a modern luxury logo for your brand
          </Text>

          <View style={styles.sellerRow}>
            <Image
              source={{ uri: 'https://picsum.photos/seed/mukulah-seller/80' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>Mukulah Studio</Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>4.9</Text>
                <Text style={styles.ratingMuted}>(328 reviews)</Text>
              </View>
              <Text style={styles.sellerMeta}>Pro • Florence, Italy</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>TOP RATED</Text>
            </View>
          </View>
        </View>

        {/* Preview image */}
        <Image
          source={{ uri: 'https://picsum.photos/seed/logo-showcase/600/360' }}
          style={styles.previewImage}
        />

        {/* Tabs row (static for now) */}
        <View style={styles.tabsRow}>
          <Text style={[styles.tabLabel, styles.tabLabelActive]}>Overview</Text>
          <Text style={styles.tabLabel}>Packages</Text>
          <Text style={styles.tabLabel}>Reviews</Text>
          <Text style={styles.tabLabel}>About seller</Text>
        </View>

        {/* Overview */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About this service</Text>
          <Text style={styles.sectionText}>
            A world-class logo that feels premium, minimal and timeless. Perfect
            for tech startups, e-commerce, luxury brands and creators who want
            to stand out on every platform – from Mukulah apps to social media.
          </Text>
          <Text style={[styles.sectionText, { marginTop: 8 }]}>
            You get 3 unique concepts, unlimited revisions during the active
            order and full commercial rights.
          </Text>
        </View>

        {/* Package snapshot */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Standard package</Text>
          <Text style={styles.price}>€149</Text>
          <Text style={styles.packageMeta}>3 days delivery • 3 revisions</Text>
          <View style={styles.bulletRow}>
            <FontAwesome name="check" size={13} color="#10B981" />
            <Text style={styles.bulletText}>3 logo concepts</Text>
          </View>
          <View style={styles.bulletRow}>
            <FontAwesome name="check" size={13} color="#10B981" />
            <Text style={styles.bulletText}>Source files (AI, SVG, PNG)</Text>
          </View>
          <View style={styles.bulletRow}>
            <FontAwesome name="check" size={13} color="#10B981" />
            <Text style={styles.bulletText}>Brand color palette & typography</Text>
          </View>
        </View>

        {/* FAQ / extra */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Why work with me?</Text>
          <Text style={styles.sectionText}>
            8+ years of design for startups, fintech, crypto and e-commerce.
            Every project is handled like a real brand, not just a quick logo.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>From</Text>
          <Text style={styles.bottomPrice}>€149</Text>
        </View>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => router.back()}
        >
          <Text style={styles.bottomButtonText}>Continue (demo)</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050509',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  heroCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 12,
  },
  categoryLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    marginBottom: 4,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  sellerName: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    color: '#F9FAFB',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '600',
  },
  ratingMuted: {
    color: '#9CA3AF',
    fontSize: 11,
    marginLeft: 4,
  },
  sellerMeta: {
    color: '#9CA3AF',
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#F5C451',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#050509',
  },
  previewImage: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 18,
    marginBottom: 10,
  },
  tabLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  tabLabelActive: {
    color: '#F9FAFB',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#0B0F1A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#F9FAFB',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionText: {
    color: '#D1D5DB',
    fontSize: 12,
    lineHeight: 18,
  },
  price: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  packageMeta: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  bulletText: {
    color: '#D1D5DB',
    fontSize: 12,
    marginLeft: 6,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#111827',
    backgroundColor: '#050509',
  },
  bottomLabel: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  bottomPrice: {
    color: '#F9FAFB',
    fontSize: 18,
    fontWeight: '800',
  },
  bottomButton: {
    flex: 1,
    marginLeft: 16,
    backgroundColor: '#F5C451',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  bottomButtonText: {
    color: '#050509',
    fontWeight: '700',
    fontSize: 13,
  },
})
