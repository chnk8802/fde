import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '@/context/CartContext';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => 
  React.createElement(CartProvider, null, children);

describe('CartContext', () => {
  it('should provide cart context', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.items).toEqual([]);
    expect(result.current.getCartCount()).toBe(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.updateQuantity(
        { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' },
        1
      );
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]._id).toBe('1');
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should increase item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    
    act(() => {
      result.current.updateQuantity(product, 1);
      result.current.updateQuantity(product, 1);
    });
    
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should decrease item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    
    act(() => {
      result.current.updateQuantity(product, 1);
      result.current.updateQuantity(product, 1);
      result.current.updateQuantity(product, -1);
    });
    
    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should remove item when quantity reaches 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const product = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    
    act(() => {
      result.current.updateQuantity(product, 1);
      result.current.updateQuantity(product, -1);
    });
    
    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate correct cart total', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const pizza = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    const burger = { _id: '2', name: 'Burger', price: 50, image: 'burger.jpg' };
    
    act(() => {
      result.current.updateQuantity(pizza, 1);
      result.current.updateQuantity(burger, 1);
      result.current.updateQuantity(burger, 1);
    });
    
    // 100 * 1 + 50 * 2 = 200
    expect(result.current.getCartTotal()).toBe(200);
  });

  it('should calculate correct cart count', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const pizza = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    const burger = { _id: '2', name: 'Burger', price: 50, image: 'burger.jpg' };
    
    act(() => {
      result.current.updateQuantity(pizza, 1);
      result.current.updateQuantity(burger, 1);
      result.current.updateQuantity(burger, 1);
    });
    
    // 1 + 2 = 3
    expect(result.current.getCartCount()).toBe(3);
  });

  it('should toggle cart open state', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    expect(result.current.isCartOpen).toBe(false);
    
    act(() => {
      result.current.setIsCartOpen(true);
    });
    
    expect(result.current.isCartOpen).toBe(true);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    act(() => {
      result.current.updateQuantity({ _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' }, 1);
      result.current.updateQuantity({ _id: '2', name: 'Burger', price: 50, image: 'burger.jpg' }, 1);
    });
    
    expect(result.current.items).toHaveLength(2);
    
    act(() => {
      result.current.clearCart();
    });
    
    expect(result.current.items).toHaveLength(0);
    expect(result.current.getCartTotal()).toBe(0);
  });

  it('should handle multiple products with different quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    
    const pizza = { _id: '1', name: 'Pizza', price: 100, image: 'pizza.jpg' };
    const burger = { _id: '2', name: 'Burger', price: 50, image: 'burger.jpg' };
    const fries = { _id: '3', name: 'Fries', price: 30, image: 'fries.jpg' };
    
    act(() => {
      // Add 2 pizzas
      result.current.updateQuantity(pizza, 1);
      result.current.updateQuantity(pizza, 1);
      // Add 3 burgers
      result.current.updateQuantity(burger, 1);
      result.current.updateQuantity(burger, 1);
      result.current.updateQuantity(burger, 1);
      // Add 1 fries
      result.current.updateQuantity(fries, 1);
    });
    
    expect(result.current.items).toHaveLength(3);
    expect(result.current.getCartCount()).toBe(6); // 2 + 3 + 1
    expect(result.current.getCartTotal()).toBe(380); // 100*2 + 50*3 + 30*1
  });
});
