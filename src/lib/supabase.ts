import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Use anon key for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Upload image to Supabase storage
export const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `resources/${fileName}`

  // Try upload with upsert option to bypass some RLS issues
  const { data, error } = await supabase.storage
    .from('afrifek')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Supabase storage error:', error)
    throw new Error(`Upload failed: ${error.message}. Please check bucket permissions.`)
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('afrifek')
    .getPublicUrl(filePath)

  return publicUrl
}