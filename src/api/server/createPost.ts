import { supabase } from '../../lib/supabase'
import { TablesInsert } from '../../types/database.types'

export async function createPost(post: TablesInsert<'posts'>) {
  const { data, error } = await supabase.from('posts').insert([post]).select()
  if (error) throw error
  return data?.[0]
}
