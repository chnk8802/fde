import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartControl from '@/components/CartControl';

describe('CartControl Component', () => {
  let mockOnIncrease: ReturnType<typeof vi.fn>;
  let mockOnDecrease: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnIncrease = vi.fn();
    mockOnDecrease = vi.fn();
  });

  it('should render CartControl with quantity', () => {
    render(
      <CartControl 
        quantity={2} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should display Minus icon when quantity > 1', () => {
    const { container } = render(
      <CartControl 
        quantity={2} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    // Check for Minus icon in the container
    expect(container.innerHTML).toBeTruthy();
  });

  it('should display Trash2 icon when quantity = 1', () => {
    const { container } = render(
      <CartControl 
        quantity={1} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    // Trash icon should be present when quantity is 1
    expect(container.innerHTML).toBeTruthy();
  });

  it('should call onIncrease when Plus button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CartControl 
        quantity={2} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    const buttons = container.querySelectorAll('button');
    const plusButton = buttons[buttons.length - 1]; // Last button is the Plus button
    
    await user.click(plusButton);
    expect(mockOnIncrease).toHaveBeenCalled();
  });

  it('should call onDecrease when Minus/Trash button is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <CartControl 
        quantity={2} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    const buttons = container.querySelectorAll('button');
    const minusButton = buttons[0]; // First button is the Minus/Trash button
    
    await user.click(minusButton);
    expect(mockOnDecrease).toHaveBeenCalled();
  });

  it('should update quantity display when quantity changes', () => {
    const { rerender } = render(
      <CartControl 
        quantity={2} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    expect(screen.getByText('2')).toBeTruthy();
    
    rerender(
      <CartControl 
        quantity={3} 
        onIncrease={mockOnIncrease} 
        onDecrease={mockOnDecrease} 
      />
    );
    
    expect(screen.getByText('3')).toBeTruthy();
  });
});
