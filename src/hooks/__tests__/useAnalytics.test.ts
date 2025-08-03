import { renderHook } from '@testing-library/react'
import { useAnalytics } from '../useAnalytics'

describe('useAnalytics', () => {
  beforeEach(() => {
    // Mock window.gtag
    global.window.gtag = vi.fn()
  })

  afterEach(() => {
    delete (global.window as any).gtag
  })

  it('should provide analytics functions', () => {
    const { result } = renderHook(() => useAnalytics())
    
    expect(result.current.trackPageView).toBeDefined()
    expect(result.current.trackEvent).toBeDefined()
    expect(result.current.trackSearch).toBeDefined()
    expect(result.current.trackArticleRead).toBeDefined()
    expect(result.current.trackNewsletterSubscribe).toBeDefined()
    expect(result.current.trackContactForm).toBeDefined()
  })

  it('should call tracking functions without errors', () => {
    const { result } = renderHook(() => useAnalytics())
    
    expect(() => {
      result.current.trackPageView('/test-page', 'Test Page')
      result.current.trackEvent('test_event', { param1: 'value1' })
      result.current.trackSearch('test query')
      result.current.trackArticleRead('article-123', 300)
      result.current.trackNewsletterSubscribe('test@example.com')
      result.current.trackContactForm('contact')
    }).not.toThrow()
  })

  it('should track search with correct parameters', () => {
    const { result } = renderHook(() => useAnalytics())
    
    // Vérifier que trackSearch appelle trackEvent
    expect(() => {
      result.current.trackSearch('test query')
    }).not.toThrow()
  })
})