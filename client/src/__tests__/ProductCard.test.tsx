import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard Component', () => {
  const mockItem = {
    id: '1',
    name: 'Delicious Pizza',
    price: 299.99,
    description: 'A delicious cheese and tomato pizza',
    image: 'https://example.com/pizza.jpg',
  };

  let mockOnUpdate: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnUpdate = vi.fn();
  });

  it('should render product card with item details', () => {
    render(<ProductCard item={mockItem} quantity={0} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText('Delicious Pizza')).toBeTruthy();
    expect(screen.getByText('A delicious cheese and tomato pizza')).toBeTruthy();
    expect(screen.getByText(/299.99/)).toBeTruthy();
  });

  it('should display Add to Cart button when quantity is 0', () => {
    render(<ProductCard item={mockItem} quantity={0} onUpdate={mockOnUpdate} />);
    
    const addButton = screen.getByRole('button', { name: /Add to Cart/i });
    expect(addButton).toBeTruthy();
  });

  it('should call onUpdate with correct parameters when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard item={mockItem} quantity={0} onUpdate={mockOnUpdate} />);
    
    const addButton = screen.getByRole('button', { name: /Add to Cart/i });
    await user.click(addButton);
    
    expect(mockOnUpdate).toHaveBeenCalledWith('1', 1);
  });

  it('should display CartControl when quantity > 0', () => {
    const { container } = render(
      <ProductCard item={mockItem} quantity={2} onUpdate={mockOnUpdate} />
    );
    
    const quantityDisplay = screen.getByText('2');
    expect(quantityDisplay).toBeTruthy();
  });

  it('should render product image with correct alt text', () => {
    render(<ProductCard item={mockItem} quantity={0} onUpdate={mockOnUpdate} />);
    
    const image = screen.getByAltText('Delicious Pizza') as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.src).toBe('https://example.com/pizza.jpg');
  });

  it('should display correct price formatting', () => {
    render(<ProductCard item={mockItem} quantity={0} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText(/₹ 299.99/)).toBeTruthy();
  });
});
