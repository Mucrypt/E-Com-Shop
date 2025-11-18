import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Link, Stack } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

export default function CategoryNotFound() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Category Not Found',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2E8C83',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        <View style={styles.content}>
          <FontAwesome name='folder-open' size={80} color='#ff6b6b' />

          <Text style={styles.title}>Category Not Found</Text>
          <Text style={styles.subtitle}>
            Sorry, the category you're looking for doesn't exist.
          </Text>
          <Text style={styles.description}>
            This category might have been moved, renamed, or is temporarily
            unavailable.
          </Text>

          <View style={styles.actions}>
            <Link href='/(shop)' style={styles.primaryButton} asChild>
              <TouchableOpacity style={styles.primaryButtonContainer}>
                <FontAwesome name='home' size={18} color='#fff' />
                <Text style={styles.primaryButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </Link>

            <Link href='/(shop)/shop' style={styles.secondaryButton} asChild>
              <TouchableOpacity style={styles.secondaryButtonContainer}>
                <FontAwesome name='shopping-bag' size={18} color='#2E8C83' />
                <Text style={styles.secondaryButtonText}>
                  Browse All Products
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.categories}>
            <Text style={styles.categoriesTitle}>Available Categories:</Text>
            <View style={styles.categoryGrid}>
              <Link href='/categories/electronics' asChild>
                <TouchableOpacity style={styles.categoryCard}>
                  <FontAwesome name='laptop' size={24} color='#2E8C83' />
                  <Text style={styles.categoryCardText}>Electronics</Text>
                </TouchableOpacity>
              </Link>
              <Link href='/categories/fashion' asChild>
                <TouchableOpacity style={styles.categoryCard}>
                  <FontAwesome name='shopping-bag' size={24} color='#2E8C83' />
                  <Text style={styles.categoryCardText}>Fashion</Text>
                </TouchableOpacity>
              </Link>
              <Link href='/categories/home' asChild>
                <TouchableOpacity style={styles.categoryCard}>
                  <FontAwesome name='home' size={24} color='#2E8C83' />
                  <Text style={styles.categoryCardText}>Home</Text>
                </TouchableOpacity>
              </Link>
              <Link href='/categories/sports' asChild>
                <TouchableOpacity style={styles.categoryCard}>
                  <FontAwesome name='futbol-o' size={24} color='#2E8C83' />
                  <Text style={styles.categoryCardText}>Sports</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 350,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  actions: {
    width: '100%',
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    width: '100%',
  },
  primaryButtonContainer: {
    backgroundColor: '#2E8C83',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  secondaryButton: {
    width: '100%',
  },
  secondaryButtonContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E8C83',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2E8C83',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  categories: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  categoryCard: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 70,
  },
  categoryCardText: {
    color: '#2E8C83',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
})
