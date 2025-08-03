import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface Deployment {
  id: string
  user_id: string
  project_name: string
  platform: 'vercel' | 'netlify'
  status: 'pending' | 'in_progress' | 'success' | 'failed'
  preview_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}