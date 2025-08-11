import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Link, Stack } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

export default function ProductNotFound() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Product Not Found',
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
          <FontAwesome name='search' size={80} color='#ff6b6b' />

          <Text style={styles.title}>Product Not Found</Text>
          <Text style={styles.subtitle}>
            Sorry, the product you're looking for doesn't exist or has been
            removed.
          </Text>
          <Text style={styles.description}>
            This might be because the product is out of stock, discontinued, or
            the link is incorrect.
          </Text>

          <View style={styles.actions}>
            <Link href='/(shop)/shop' style={styles.primaryButton} asChild>
              <TouchableOpacity style={styles.primaryButtonContainer}>
                <FontAwesome name='shopping-bag' size={18} color='#fff' />
                <Text style={styles.primaryButtonText}>
                  Browse All Products
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href='/(shop)' style={styles.secondaryButton} asChild>
              <TouchableOpacity style={styles.secondaryButtonContainer}>
                <FontAwesome name='home' size={18} color='#2E8C83' />
                <Text style={styles.secondaryButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>You might also like:</Text>
            <View style={styles.suggestionButtons}>
              <Link href='/categories/electronics' asChild>
                <TouchableOpacity style={styles.categoryButton}>
                  <FontAwesome name='laptop' size={16} color='#2E8C83' />
                  <Text style={styles.categoryButtonText}>Electronics</Text>
                </TouchableOpacity>
              </Link>
              <Link href='/categories/fashion' asChild>
                <TouchableOpacity style={styles.categoryButton}>
                  <FontAwesome name='shopping-bag' size={16} color='#2E8C83' />
                  <Text style={styles.categoryButtonText}>Fashion</Text>
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
  suggestions: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  suggestionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryButtonText: {
    color: '#2E8C83',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
})
