import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          excerpt: string
          content: string
          category: string
          author: string
          published_at: string
          read_time: number
          image: string
          tags: string[]
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          excerpt: string
          content: string
          category: string
          author: string
          published_at?: string
          read_time: number
          image: string
          tags: string[]
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          excerpt?: string
          content?: string
          category?: string
          author?: string
          published_at?: string
          read_time?: number
          image?: string
          tags?: string[]
          featured?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme: 'light' | 'dark'
          created_at?: string
          updated_at?: string
        }
        Update: {
          theme?: 'light' | 'dark'
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          subscribed_at: string
          active: boolean
        }
        Insert: {
          id?: string
          email: string
          subscribed_at?: string
          active?: boolean
        }
        Update: {
          email?: string
          active?: boolean
        }
      }
    }
  }
}