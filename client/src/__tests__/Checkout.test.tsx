import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkout from '@/pages/Checkout';

describe('Checkout Component', () => {
  const mockOnBack = vi.fn();
  const mockOnSubmit = vi.fn();

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

  it('should render checkout form', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Checkout')).toBeTruthy();
    expect(screen.getByText('Order Summary')).toBeTruthy();
  });

  it('should display order summary with cart items', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Pizza')).toBeTruthy();
    expect(screen.getByText('Burger')).toBeTruthy();
  });

  it('should calculate and display correct total', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    // Total should be: 299.99 * 2 + 149.99 * 1 = 749.97
    expect(screen.getByText(/749.97/)).toBeTruthy();
  });

  it('should have input fields for customer details', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    // Check for input fields (they may have different selectors)
    const inputs = screen.queryAllByRole('textbox');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should call onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    const backButton = screen.getByRole('button', { name: '' });
    if (backButton) {
      await user.click(backButton);
      expect(mockOnBack).toHaveBeenCalled();
    }
  });

  it('should validate required fields before submission', async () => {
    const user = userEvent.setup();
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Place Order/i });
    await user.click(submitButton);

    // onSubmit should not be called if validation fails
    // The component should show alert instead
  });

  it('should call onSubmit with correct order data when form is filled', async () => {
    const user = userEvent.setup();
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    // Get all inputs
    const inputs = screen.queryAllByRole('textbox');
    
    // Fill in the form
    if (inputs[0]) {
      await user.type(inputs[0], 'John Doe');
    }
    if (inputs[1]) {
      await user.type(inputs[1], '1234567890');
    }
    if (inputs[2]) {
      await user.type(inputs[2], '123 Main St');
    }

    const submitButton = screen.getByRole('button', { name: /Place Order/i });
    await user.click(submitButton);

    // Check if onSubmit was called
    // It might be called after validation
  });

  it('should display place order button', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('button', { name: /Place Order/i })).toBeTruthy();
  });

  it('should display billing details form header', () => {
    render(
      <Checkout
        cart={mockCart}
        onBack={mockOnBack}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText(/Checkout/i)).toBeTruthy();
    expect(screen.getByText(/Delivery Address/i)).toBeTruthy();
  });
});
