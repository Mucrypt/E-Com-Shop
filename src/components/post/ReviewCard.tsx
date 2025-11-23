import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { Colors, Typography, Spacing, CommonStyles } from '../../constants'

interface ReviewCardProps {
  data: {
    title?: string
    description?: string
    price?: number
    images?: any[]
    location?: {
      address?: string
      city?: string
      country?: string
    }
    category?: string
    [key: string]: any
  }
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ data }) => {
  const {
    title = 'Untitled',
    description = 'No description provided',
    price,
    images = [],
    location = {},
    category,
    ...otherFields
  } = data

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Review Your Post</Text>
      
      {/* Main Content */}
      <View style={styles.card}>
        {/* Images */}
        {images.length > 0 && (
          <View style={styles.imageSection}>
            <Text style={styles.fieldLabel}>Images ({images.length})</Text>
            <View style={styles.imageGrid}>
              {images.slice(0, 4).map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={image} style={styles.image} />
                  {index === 3 && images.length > 4 && (
                    <View style={styles.imageOverlay}>
                      <Text style={styles.imageCount}>+{images.length - 4}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Title</Text>
          <Text style={styles.fieldValue}>{title}</Text>
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Description</Text>
          <Text style={styles.fieldValue} numberOfLines={3}>
            {description}
          </Text>
        </View>

        {/* Price */}
        {price && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Price</Text>
            <Text style={[styles.fieldValue, styles.priceText]}>
              ${price.toLocaleString()}
            </Text>
          </View>
        )}

        {/* Location */}
        {(location.address || location.city) && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Location</Text>
            <Text style={styles.fieldValue}>
              {[location.address, location.city, location.country]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        )}

        {/* Category */}
        {category && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
        )}

        {/* Other Fields */}
        {Object.entries(otherFields).map(([key, value]) => {
          if (!value || key === 'images' || key === 'location' || key === 'price') return null
          
          return (
            <View key={key} style={styles.field}>
              <Text style={styles.fieldLabel}>
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              </Text>
              <Text style={styles.fieldValue}>
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: Spacing[4],
  },
  card: {
    ...CommonStyles.card,
    padding: Spacing[4],
  },
  imageSection: {
    marginBottom: Spacing[4],
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Spacing[2],
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: Spacing[2],
    marginBottom: Spacing[2],
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay.dark70,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCount: {
    color: Colors.text.primary,
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as const,
  },
  field: {
    marginBottom: Spacing[4],
  },
  fieldLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
    marginBottom: Spacing[1],
  },
  fieldValue: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeights.relaxed,
  },
  priceText: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700' as const,
    color: Colors.primary[500],
  },
  categoryBadge: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '600' as const,
    color: Colors.background.primary,
  },
})

export default ReviewCard