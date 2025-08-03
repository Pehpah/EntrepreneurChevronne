import { renderHook, waitFor } from '@testing-library/react'
import { useSupabaseStorage, useArticles } from '../useSupabase'

// Mock Supabase
const mockSupabase = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null }))
      })),
      order: vi.fn(() => Promise.resolve({ data: [], error: null }))
    })),
    upsert: vi.fn(() => Promise.resolve({ error: null })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
      }))
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null }))
        }))
      }))
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }))
}

vi.mock('../lib/supabase', () => ({
  supabase: mockSupabase
}))

describe('useSupabaseStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default value', async () => {
    const { result } = renderHook(() => 
      useSupabaseStorage('test_table', 'test_key', 'default_value')
    )

    expect(result.current.loading).toBe(true)
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.value).toBe('default_value')
  })

  it('should handle setValue correctly', async () => {
    const { result } = renderHook(() => 
      useSupabaseStorage('test_table', 'test_key', 'default_value')
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await result.current.setValue('new_value')

    expect(mockSupabase.from).toHaveBeenCalledWith('test_table')
  })
})

describe('useArticles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch articles on mount', async () => {
    const { result } = renderHook(() => useArticles())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('articles')
    expect(result.current.articles).toEqual([])
  })

  it('should create article', async () => {
    const { result } = renderHook(() => useArticles())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const newArticle = {
      title: 'Test Article',
      content: 'Test content',
      category: 'test'
    }

    await result.current.createArticle(newArticle)

    expect(mockSupabase.from).toHaveBeenCalledWith('articles')
  })
})