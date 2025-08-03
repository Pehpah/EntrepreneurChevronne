import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Hook générique pour les préférences utilisateur
export function useSupabaseStorage<T>(
  table: string,
  key: string,
  initialValue: T,
  userId?: string
) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Générer un ID utilisateur temporaire si pas d'authentification
  const tempUserId = userId || 'anonymous-user'

  useEffect(() => {
    const fetchValue = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('user_id', tempUserId)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error
        }

        if (data && data[key] !== undefined) {
          setStoredValue(data[key])
        }
      } catch (err) {
        console.error(`Error fetching ${key} from ${table}:`, err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchValue()
  }, [table, key, tempUserId])

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      const { error } = await supabase
        .from(table)
        .upsert({
          user_id: tempUserId,
          [key]: valueToStore,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    } catch (err) {
      console.error(`Error setting ${key} in ${table}:`, err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  return { value: storedValue, setValue, loading, error }
}

// Hook spécifique pour le thème
export function useThemeStorage(userId?: string) {
  return useSupabaseStorage('user_preferences', 'theme', 'light' as 'light' | 'dark', userId)
}

// Hook pour les articles (CRUD complet)
export function useArticles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createArticle = async (article: any) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select()
        .single()

      if (error) throw error
      setArticles(prev => [data, ...prev])
      return data
    } catch (err) {
      console.error('Error creating article:', err)
      throw err
    }
  }

  const updateArticle = async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setArticles(prev => prev.map(article => 
        article.id === id ? data : article
      ))
      return data
    } catch (err) {
      console.error('Error updating article:', err)
      throw err
    }
  }

  const deleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      setArticles(prev => prev.filter(article => article.id !== id))
    } catch (err) {
      console.error('Error deleting article:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  return {
    articles,
    loading,
    error,
    createArticle,
    updateArticle,
    deleteArticle,
    refetch: fetchArticles
  }
}