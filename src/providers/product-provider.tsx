import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './auth-provider'

export interface Product {
  id: string
  name: string
  description?: string
  short_description?: string
  price: number
  original_price?: number
  category_id?: string
  category?: string // For backward compatibility
  brand?: string
  sku?: string
  image_url?: string
  images?: string[]
  in_stock: boolean
  stock_quantity?: number
  is_featured?: boolean
  is_on_sale?: boolean
  rating?: number
  review_count?: number
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image_url?: string
  icon?: string
  color?: string
  is_active?: boolean
  sort_order?: number
  product_count?: number
}

interface ProductContextType {
  products: Product[]
  categories: Category[]
  isLoading: boolean
  error: string | null

  // Product methods
  fetchProducts: (filters?: ProductFilters) => Promise<void>
  fetchProduct: (id: string) => Promise<Product | null>
  searchProducts: (query: string) => Promise<Product[]>

  // Category methods
  fetchCategories: () => Promise<void>
  getProductsByCategory: (categoryId: string) => Product[]

  // Utility methods
  getFeaturedProducts: () => Product[]
  getDiscountedProducts: () => Product[]
  getNewProducts: () => Product[]
  clearError: () => void
}

interface ProductFilters {
  category_id?: string
  category?: string // For backward compatibility
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  featured?: boolean
  onSale?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'oldest' | 'name'
  limit?: number
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

interface ProductProviderProps {
  children: React.ReactNode
}

/**
 * Provides product and category data, loading state, error handling, and utility functions
 * for managing products in an e-commerce application. This provider fetches products and categories
 * from Supabase, supports filtering, sorting, searching, and exposes helpers for featured, discounted,
 * and new products.
 *
 * @param children - React children to be rendered within the provider.
 *
 * @remarks
 * - Uses Supabase for data fetching.
 * - Handles loading and error states.
 * - Exposes context value for use throughout the app.
 *
 * @context
 * ProductContextType:
 * - products: List of fetched products.
 * - categories: List of fetched categories.
 * - isLoading: Indicates if data is being loaded.
 * - error: Error message if any operation fails.
 * - fetchProducts: Fetches products with optional filters and sorting.
 * - fetchProduct: Fetches a single product by ID.
 * - searchProducts: Searches products by name or description.
 * - fetchCategories: Fetches product categories with product count.
 * - getProductsByCategory: Returns products for a given category.
 * - getFeaturedProducts: Returns top-rated, in-stock products.
 * - getDiscountedProducts: Returns products with a discount.
 * - getNewProducts: Returns products added in the last 30 days.
 * - clearError: Clears the error state.
 *
 * @example
 * ```tsx
 * <ProductProvider>
 *   <App />
 * </ProductProvider>
 * ```
 */
export default function ProductProvider({ children }: ProductProviderProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Fetch products with optional filters
  const fetchProducts = async (filters?: ProductFilters) => {
    try {
      setIsLoading(true)
      setError(null)

      let query = supabase.from('products').select(`
        *,
        category:categories(name, icon, color)
      `)

      // Apply filters
      if (filters?.category_id || filters?.category) {
        const categoryFilter = filters.category_id || filters.category
        query = query.eq('category_id', categoryFilter)
      }
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters?.inStockOnly) {
        query = query.eq('in_stock', true).gt('stock_quantity', 0)
      }
      if (filters?.featured) {
        query = query.eq('is_featured', true)
      }
      if (filters?.onSale) {
        query = query.eq('is_on_sale', true)
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'price_asc':
            query = query.order('price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('price', { ascending: false })
            break
          case 'rating':
            query = query.order('rating', { ascending: false })
            break
          case 'newest':
            query = query.order('created_at', { ascending: false })
            break
          case 'oldest':
            query = query.order('created_at', { ascending: true })
            break
          case 'name':
            query = query.order('name', { ascending: true })
            break
        }
      } else {
        // Default sorting: featured first, then by rating
        query = query
          .order('is_featured', { ascending: false })
          .order('rating', { ascending: false })
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch a single product
  const fetchProduct = async (id: string): Promise<Product | null> => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch product')
      return null
    }
  }

  // Search products
  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('in_stock', true)

      if (error) throw error

      return data || []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products')
      return []
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setError(null)
      const { data, error } = await supabase.from('categories').select('*')

      if (error) throw error

      setCategories(data || [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch categories'
      )
    }
  }

  // Get products by category
  const getProductsByCategory = (categoryId: string): Product[] => {
    return products.filter((product) => product.category_id === categoryId)
  }

  // Get featured products (top-rated, in stock)
  const getFeaturedProducts = (): Product[] => {
    return products
      .filter(
        (product) => product.in_stock && product.rating && product.rating >= 4.5
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
  }

  // Get discounted products
  const getDiscountedProducts = (): Product[] => {
    return products.filter(
      (product) =>
        product.original_price && product.price < product.original_price
    )
  }

  // Get new products (added in last 30 days)
  const getNewProducts = (): Product[] => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    return products.filter((product) => {
      if (!product.created_at) return false
      const createdDate = new Date(product.created_at)
      return createdDate >= thirtyDaysAgo
    })
  }

  // Clear error state
  const clearError = () => {
    setError(null)
  }

  // Initial data fetch
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const value: ProductContextType = {
    products,
    categories,
    isLoading,
    error,
    fetchProducts,
    fetchProduct,
    searchProducts,
    fetchCategories,
    getProductsByCategory,
    getFeaturedProducts,
    getDiscountedProducts,
    getNewProducts,
    clearError,
  }

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}
