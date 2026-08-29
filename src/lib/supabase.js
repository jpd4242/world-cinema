import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  )

// import { createClient } from '@supabase/supabase-js'

// console.log(
//   'Supabase URL:',
//   import.meta.env.VITE_SUPABASE_URL
// )

// console.log(
//   'Supabase key exists:',
//   !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
// )

// const supabaseUrl =
//   import.meta.env.VITE_SUPABASE_URL

// const supabaseKey =
//   import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// export const supabase =
//   createClient(
//     supabaseUrl,
//     supabaseKey
//   )