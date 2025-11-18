import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Tables, TablesInsert, TablesUpdate } from '../../types/database.types'

// CATEGORIES API
/**
 * Custom hook to fetch active and non-deleted categories from the Supabase database.
 *
 * Utilizes React Query's `useQuery` to asynchronously retrieve category data,
 * filtering for categories where `is_active` is true and `is_deleted` is false,
 * and orders the results by `sort_order` in ascending order.
 *
 * @returns {UseQueryResult<Tables<'categories'>[]>} The query result containing an array of category objects.
 *
 * @throws {Error} Throws an error if the Supabase query fails.
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        throw new Error(error.message)
      }
      return data as Tables<'categories'>[]
    },
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data as Tables<'categories'>
    },
    enabled: !!id,
  })
}

/**
 * Custom React Query hook to fetch a single category by its slug from the Supabase 'categories' table.
 *
 * @param slug - The unique slug identifier for the category to fetch.
 * @returns A React Query result containing the category data or an error if the fetch fails.
 *
 * @remarks
 * - The query is enabled only if a valid slug is provided.
 * - Throws an error if the Supabase query fails.
 */
export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw new Error(error.message)
      return data as Tables<'categories'>
    },
    enabled: !!slug,
  })
}

/**
 * Custom React Query hook to fetch active products for a given category from Supabase.
 *
 * @param categoryId - The ID of the category to filter products by.
 * @returns A React Query result containing an array of active products belonging to the specified category.
 *
 * The hook uses Supabase to query the 'products' table, filtering by `category_id` and `is_active` fields,
 * and orders the results by `created_at` in descending order.
 * The query is enabled only when a valid `categoryId` is provided.
 *
 * @throws {Error} If the Supabase query returns an error.
 */
export const useCategoryProducts = (categoryId: string) => {
  return useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data as Tables<'products'>[]
    },
    enabled: !!categoryId,
  })
}

// PRODUCTS API
/**
 * Custom hook to fetch products from the Supabase database with optional filters.
 *
 * @param options - Optional filters for querying products.
 * @param options.featured - If true, fetch only featured products.
 * @param options.onSale - If true, fetch only products that are on sale.
 * @param options.inStock - If true or undefined, fetch only products that are in stock. If false, do not filter by stock.
 * @param options.limit - Limit the number of products returned.
 * @param options.categoryId - Fetch products belonging to a specific category.
 * @returns A React Query result containing an array of products matching the specified filters.
 *
 * @throws {Error} If there is an error fetching products from Supabase.
 */
export const useProducts = (options?: {
  featured?: boolean
  onSale?: boolean
  inStock?: boolean
  limit?: number
  categoryId?: string
}) => {
  return useQuery({
    queryKey: ['products', options],
    queryFn: async () => {
      let query = supabase.from('products').select('*').eq('is_active', true)

      if (options?.featured) {
        query = query.eq('is_featured', true)
      }
      if (options?.onSale) {
        query = query.eq('is_on_sale', true)
      }
      if (options?.inStock !== false) {
        query = query.eq('in_stock', true)
      }
      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw new Error(error.message)
      return data as Tables<'products'>[]
    },
  })
}

/**
 * Custom hook to fetch a single product by its ID using React Query and Supabase.
 *
 * @param id - The unique identifier of the product to fetch.
 * @returns A React Query result object containing the product data, loading, and error states.
 *
 * @remarks
 * - The query is enabled only if a valid `id` is provided.
 * - Throws an error if the Supabase query fails.
 */
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw new Error(error.message)
      return data as Tables<'products'>
    },
    enabled: !!id,
  })
}

export const useSearchProducts = (searchTerm: string) => {
  return useQuery({
    queryKey: ['search-products', searchTerm],
    queryFn: async () => {
      if (!searchTerm.trim()) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('in_stock', true)
        .or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
        )
        .limit(20)

      if (error) throw new Error(error.message)
      return data as Tables<'products'>[]
    },
    enabled: !!searchTerm.trim(),
  })
}

export const useFeaturedProducts = (limit: number = 10) => {
  return useProducts({ featured: true, limit })
}

export const useSaleProducts = (limit: number = 10) => {
  return useProducts({ onSale: true, limit })
}

// USERS API
export const useUserProfile = (userId?: string) => {
  return useQuery({
    queryKey: ['user-profile', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw new Error(error.message)
      return data as Tables<'users'>
    },
    enabled: !!userId,
  })
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      updates: Partial<TablesUpdate<'users'>> & { id: string }
    ) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', data.id] })
    },
  })
}

// FAVORITES/WISHLIST API (assuming you have a favorites table)
export const useUserFavorites = (userId: string) => {
  return useQuery({
    queryKey: ['user-favorites', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId,
  })
}

// CART API (assuming you have a cart table)
export const useUserCart = (userId: string) => {
  return useQuery({
    queryKey: ['user-cart', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId,
  })
}

// ORDERS API
export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: ['user-orders', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!userId,
  })
}

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', orderId)
        .single()

      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!orderId,
  })
}

// Helper functions for direct usage (not React Query)
export const productsApi = {
  // Get all products with filters
  getProducts: async (filters?: {
    categoryId?: string
    featured?: boolean
    onSale?: boolean
    inStock?: boolean
    limit?: number
  }) => {
    let query = supabase.from('products').select('*').eq('is_active', true)

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId)
    }
    if (filters?.featured) {
      query = query.eq('is_featured', true)
    }
    if (filters?.onSale) {
      query = query.eq('is_on_sale', true)
    }
    if (filters?.inStock !== false) {
      query = query.eq('in_stock', true)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error
    return data as Tables<'products'>[]
  },

  // Get single product
  getProduct: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Tables<'products'>
  },

  // Search products
  searchProducts: async (searchTerm: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .eq('in_stock', true)
      .or(
        `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`
      )
      .limit(20)

    if (error) throw error
    return data as Tables<'products'>[]
  },
}

export const categoriesApi = {
  // Get all categories
  getCategories: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .eq('is_deleted', false)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data as Tables<'categories'>[]
  },

  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data as Tables<'categories'>
  },

  // Get category products
  getCategoryProducts: async (categoryId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Tables<'products'>[]
  },
}
