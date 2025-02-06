// ~/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { env } from '~/config/env'

export function createServerSupabase() {
  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      // Since we're only using it for file uploads and not auth
      // we can use minimal cookie implementation
      getAll: () => [],
      setAll: () => {},
    },
  })

  return { supabase }
}
