import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Tables } from '../../types/database.types'

export const useSortOptions = () => {
  return useQuery({
    queryKey: ['sort-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sort_options')
        .select('*')
        .order('created_at', { ascending: true }) // Use created_at since sort_order might not exist

      if (error) throw new Error(error.message)
      return data as Tables<'sort_options'>[]
    },
  })
}
