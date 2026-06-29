import { createClient } from '@supabase/supabase-js'

// The Supabase client is created ONCE here and imported everywhere else.
// Never instantiate createClient() inline in a component.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Consuming features (Contact form, Login) can check this to render a
// disabled/error state instead of throwing when env vars are absent.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  // Graceful fallback: warn loudly, do not crash the app.
  console.warn(
    'Supabase env vars missing — contact form and admin features disabled. ' +
      'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (local) and in ' +
      'GitHub Actions secrets (deploy).',
  )
}

// A single shared instance, or null when not configured.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
