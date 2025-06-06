import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseToken = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const client = createClient(supabaseUrl, supabaseToken,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        }
    });