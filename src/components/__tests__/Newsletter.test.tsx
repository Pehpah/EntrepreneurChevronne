import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Newsletter } from '../Newsletter';
import { useNewsletter } from '../../hooks/useNewsletter';

// Mock the hook
vi.mock('../../hooks/useNewsletter');

const mockUseNewsletter = {
  subscribe: vi.fn(),
  isSubscribing: false,
  message: null,
  clearMessage: vi.fn(),
  getSubscriberCount: vi.fn(() => 42),
};

beforeEach(() => {
  (useNewsletter as any).mockReturnValue(mockUseNewsletter);
});

describe('Newsletter Component', () => {
  it('renders newsletter form correctly', () => {
    render(<Newsletter />);
    
    expect(screen.getByText('Rejoignez notre communauté')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Votre email professionnel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
  });

  it('displays subscriber count', () => {
    render(<Newsletter />);
    
    expect(screen.getByText('42 entrepreneurs déjà inscrits')).toBeInTheDocument();
  });

  it('handles form submission with valid email', async () => {
    const user = userEvent.setup();
    mockUseNewsletter.subscribe.mockResolvedValue(true);
    
    render(<Newsletter />);
    
    const emailInput = screen.getByPlaceholderText('Votre email professionnel');
    const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);
    
    expect(mockUseNewsletter.subscribe).toHaveBeenCalledWith('test@example.com');
  });

  it('does not submit with empty email', async () => {
    const user = userEvent.setup();
    
    render(<Newsletter />);
    
    const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
    await user.click(submitButton);
    
    expect(mockUseNewsletter.subscribe).not.toHaveBeenCalled();
  });

  it('displays success message', () => {
    mockUseNewsletter.message = {
      type: 'success',
      text: 'Merci ! Vous êtes maintenant inscrit(e) à notre newsletter.'
    };
    
    render(<Newsletter />);
    
    expect(screen.getByText(/merci ! vous êtes maintenant inscrit/i)).toBeInTheDocument();
  });

  it('displays error message', () => {
    mockUseNewsletter.message = {
      type: 'error',
      text: 'Cette adresse email est déjà inscrite'
    };
    
    render(<Newsletter />);
    
    expect(screen.getByText(/cette adresse email est déjà inscrite/i)).toBeInTheDocument();
  });

  it('shows loading state during subscription', () => {
    mockUseNewsletter.isSubscribing = true;
    
    render(<Newsletter />);
    
    expect(screen.getByText('Inscription...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /inscription/i })).toBeDisabled();
  });

  it('clears message when close button is clicked', async () => {
    const user = userEvent.setup();
    mockUseNewsletter.message = {
      type: 'success',
      text: 'Success message'
    };
    
    render(<Newsletter />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // X button
    await user.click(closeButton);
    
    expect(mockUseNewsletter.clearMessage).toHaveBeenCalled();
  });
});