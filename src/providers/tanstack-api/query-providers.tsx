// This file must use the .tsx extension to support JSX syntax in the QueryProvider component.
// QueryClientProvider must be used as a JSX component, not as a type.
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
} from '@tanstack/react-query'
import { QueryClientProvider,  } from '@tanstack/react-query'

import { PropsWithChildren } from 'react'

// Create a QueryClient instance for React Query
const queryClient = new QueryClient()

/**
 * Provides the TanStack Query client context to its child components.
 *
 * Wrap your application or component tree with this provider to enable
 * React Query features such as caching, background updates, and request deduplication.
 *
 * @param children - The React node(s) that will have access to the QueryClient context.
 * @returns The QueryClientProvider wrapping the provided children.
 */
export default function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
