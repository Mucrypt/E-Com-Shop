import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { useCategories } from '../../api/server/api'
import { FontAwesome } from '@expo/vector-icons'
import { router } from 'expo-router'

const CategoriesListScreen = () => {
  const { data: categories = [], isLoading, error } = useCategories()

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/categories/${item.CategorySlug}`)}
    >
      <View
        style={[
          styles.categoryIcon,
          { backgroundColor: item.color || '#2E8C83' },
        ]}
      >
        <FontAwesome name={item.icon || 'tag'} size={32} color='#fff' />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Categories</Text>
      {isLoading ? (
        <Text style={styles.loading}>Loading categories...</Text>
      ) : error ? (
        <Text style={styles.error}>Error loading categories</Text>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2E8C83',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
  },
  error: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  list: {
    paddingBottom: 30,
  },
  categoryItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
})

export default CategoriesListScreen
