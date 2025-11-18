import { useMutation } from '@tanstack/react-query'
import { createPost } from '../api/server/createPost'
import { TablesInsert } from '../types/database.types'

export function useCreatePost() {
  return useMutation({
    mutationFn: (post: TablesInsert<'posts'>) => createPost(post),
  })
}
