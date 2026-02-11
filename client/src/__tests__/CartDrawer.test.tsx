import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartDrawer from '@/components/CartDrawer';

describe('CartDrawer Component', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnCheckout = vi.fn();

  const mockCart = [
    {
      _id: '1',
      name: 'Pizza',
      price: 299.99,
      quantity: 2,
      image: 'pizza.jpg',
    },
    {
      _id: '2',
      name: 'Burger',
      price: 149.99,
      quantity: 1,
      image: 'burger.jpg',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render CartDrawer with title', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={[]}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.getByText('Your Order')).toBeTruthy();
  });

  it('should display empty cart message when no items', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={[]}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.getByText('Your cart is empty')).toBeTruthy();
    expect(screen.getByText(/Add some tasty items/i)).toBeTruthy();
  });

  it('should display cart items', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCart}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.getByText('Pizza')).toBeTruthy();
    expect(screen.getByText('Burger')).toBeTruthy();
    expect(screen.getByText(/299.99 x 2/)).toBeTruthy();
    expect(screen.getByText(/149.99 x 1/)).toBeTruthy();
  });

  it('should calculate and display correct total', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCart}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    // Total should be: 299.99 * 2 + 149.99 * 1 = 749.97
    expect(screen.getByText(/749.97/)).toBeTruthy();
  });

  it('should call onUpdate when increment button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCart}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    const buttons = container.querySelectorAll('button');
    // Find the + button for the first item
    const incrementButtons = Array.from(buttons).filter(b => b.textContent === '+');
    
    if (incrementButtons.length > 0) {
      await user.click(incrementButtons[0]);
      expect(mockOnUpdate).toHaveBeenCalled();
    }
  });

  it('should display checkout button when cart has items', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCart}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.getByRole('button', { name: /Proceed to Checkout/i })).toBeTruthy();
  });

  it('should call onCheckout when checkout button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={mockCart}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
    await user.click(checkoutButton);
    expect(mockOnCheckout).toHaveBeenCalled();
  });

  it('should not display checkout button when cart is empty', () => {
    render(
      <CartDrawer
        isOpen={true}
        onClose={mockOnClose}
        cart={[]}
        onUpdate={mockOnUpdate}
        onCheckout={mockOnCheckout}
      />
    );

    expect(screen.queryByRole('button', { name: /Proceed to Checkout/i })).toBeFalsy();
  });
});
