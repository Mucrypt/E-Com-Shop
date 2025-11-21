// Global Deno stubs for TypeScript editor (Supabase Edge Functions runtime)
// These are minimal and NOT full implementations.

declare const Deno: {
  env: { get(name: string): string | undefined }
  serve: (handler: (req: Request) => Response | Promise<Response>) => void
}

// Remote module shim so tsserver resolves types; forwards to installed package if present.
declare module 'https://esm.sh/@supabase/supabase-js@2' {
  export * from '@supabase/supabase-js'
}
