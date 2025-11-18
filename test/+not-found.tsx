import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Link, Stack } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: true }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <FontAwesome name='exclamation-triangle' size={80} color='#ff6b6b' />

          <Text style={styles.title}>Page Not Found</Text>
          <Text style={styles.subtitle}>
            Sorry, we couldn't find the page you're looking for.
          </Text>
          <Text style={styles.description}>
            The page you requested might have been moved, deleted, or doesn't
            exist.
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
                <Text style={styles.secondaryButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.helpSection}>
            <Text style={styles.helpTitle}>Need help?</Text>
            <Text style={styles.helpText}>
              If you think this is an error, please contact our support team.
            </Text>
            <Link href='/(shop)/profile' style={styles.contactLink} asChild>
              <TouchableOpacity style={styles.contactButton}>
                <FontAwesome name='headphones' size={16} color='#2E8C83' />
                <Text style={styles.contactText}>Contact Support</Text>
              </TouchableOpacity>
            </Link>
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
    marginBottom: 40,
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
  helpSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    width: '100%',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  contactLink: {
    alignSelf: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8f7',
    borderRadius: 20,
  },
  contactText: {
    color: '#2E8C83',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
})
