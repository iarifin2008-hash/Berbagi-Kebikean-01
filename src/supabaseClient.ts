import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jxzbkjvlutfhyzxjrint.supabase.co'

const supabaseAnonKey = 'sb_publishable_vfyaDKBkddjlyVzFAfejSQ_Yddg4uWO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
