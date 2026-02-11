import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';
import { BrowserRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header with title', () => {
    renderWithRouter(<Header cartCount={0} onCartClick={vi.fn()} />);
    
    expect(screen.getByText('FoodDelivery')).toBeTruthy();
  });

  it('should display cart count badge when count > 0', () => {
    renderWithRouter(<Header cartCount={5} onCartClick={vi.fn()} />);
    
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should not display cart count badge when count = 0', () => {
    const { container } = renderWithRouter(<Header cartCount={0} onCartClick={vi.fn()} />);
    
    const badges = container.querySelectorAll('[class*="badge"]');
    expect(badges.length).toBe(0);
  });

  it('should call onCartClick when cart button is clicked', async () => {
    const user = userEvent.setup();
    const onCartClick = vi.fn();
    
    const { container } = renderWithRouter(<Header cartCount={0} onCartClick={onCartClick} />);
    
    const buttons = container.querySelectorAll('button');
    // Cart button is typically the last one with the cart icon
    if (buttons.length > 0) {
      const cartButton = buttons[buttons.length - 1];
      await user.click(cartButton);
      expect(onCartClick).toHaveBeenCalled();
    }
  });

  it('should render Manage button', () => {
    renderWithRouter(<Header cartCount={0} onCartClick={vi.fn()} />);
    
    expect(screen.getByText('Manage')).toBeTruthy();
  });
});
