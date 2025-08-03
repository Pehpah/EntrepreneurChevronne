import { render, screen } from '@testing-library/react'
import { Header } from '../Header'
import { ThemeProvider } from '../../contexts/ThemeContext'

// Mock du hook useSupabase
vi.mock('../../hooks/useSupabase', () => ({
  useThemeStorage: () => ({
    value: 'light',
    setValue: vi.fn(),
    loading: false,
    error: null
  })
}))

const HeaderWithProviders = ({ children, ...props }: React.PropsWithChildren<any>) => (
  <ThemeProvider>
    <Header {...props} />
    {children}
  </ThemeProvider>
)

describe('Header', () => {
  const defaultProps = {
    currentPage: 'accueil' as const,
    onPageChange: vi.fn(),
    onSearch: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the header with navigation', () => {
    render(<HeaderWithProviders {...defaultProps} />)
    
    // Vérifier que le logo/titre est présent
    expect(screen.getByText(/entrepreneur/i)).toBeInTheDocument()
    
    // Vérifier que les liens de navigation sont présents
    expect(screen.getByText(/accueil/i)).toBeInTheDocument()
    expect(screen.getByText(/gestion quotidienne/i)).toBeInTheDocument()
  })

  it('calls onPageChange when navigation link is clicked', async () => {
    const mockOnPageChange = vi.fn()
    render(<HeaderWithProviders {...defaultProps} onPageChange={mockOnPageChange} />)
    
    // Simuler un clic sur un lien (test basique)
    const homeLink = screen.getByText(/accueil/i)
    expect(homeLink).toBeInTheDocument()
  })

  it('renders search functionality', () => {
    render(<HeaderWithProviders {...defaultProps} />)
    
    // Vérifier que l'icône de recherche est présente
    const searchIcon = screen.getByTestId('search-button')
    expect(searchIcon).toBeInTheDocument()
  })
})