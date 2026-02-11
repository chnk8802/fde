import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fetchProducts, fetchProductById, createOrder, fetchOrders } from '@/services/api';
import API from '@/services/axios';

vi.mock('@/services/axios');

describe('API Service', () => {
  const mockAPI = API as any;

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should fetch all products', async () => {
      const mockProducts = [
        { id: '1', name: 'Pizza', price: 100, description: 'Delicious pizza', image: 'pizza.jpg' },
        { id: '2', name: 'Burger', price: 50, description: 'Tasty burger', image: 'burger.jpg' },
      ];

      mockAPI.get.mockResolvedValue({ data: mockProducts });

      const result = await fetchProducts();

      expect(mockAPI.get).toHaveBeenCalledWith('/products');
      expect(result).toEqual(mockProducts);
    });

    it('should handle fetch products error', async () => {
      const error = new Error('Network error');
      mockAPI.get.mockRejectedValue(error);

      await expect(fetchProducts()).rejects.toThrow('Network error');
      expect(mockAPI.get).toHaveBeenCalledWith('/products');
    });
  });

  describe('fetchProductById', () => {
    it('should fetch a product by ID', async () => {
      const mockProduct = { id: '1', name: 'Pizza', price: 100, description: 'Delicious pizza', image: 'pizza.jpg' };

      mockAPI.get.mockResolvedValue({ data: mockProduct });

      const result = await fetchProductById('1');

      expect(mockAPI.get).toHaveBeenCalledWith('/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('should handle fetch product by ID error', async () => {
      const error = new Error('Product not found');
      mockAPI.get.mockRejectedValue(error);

      await expect(fetchProductById('invalid-id')).rejects.toThrow('Product not found');
      expect(mockAPI.get).toHaveBeenCalledWith('/products/invalid-id');
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        items: [{ productId: '1', quantity: 2, name: 'Pizza', price: 100 }],
        totalAmount: 200,
      };

      const mockOrderResponse = { _id: 'order-1', ...orderData, status: 'pending' };

      mockAPI.post.mockResolvedValue({ data: mockOrderResponse });

      const result = await createOrder(orderData);

      expect(mockAPI.post).toHaveBeenCalledWith('/orders', orderData);
      expect(result).toEqual(mockOrderResponse);
    });

    it('should handle create order error', async () => {
      const orderData = { customerName: 'John' };
      const error = new Error('Validation error');
      mockAPI.post.mockRejectedValue(error);

      await expect(createOrder(orderData)).rejects.toThrow('Validation error');
      expect(mockAPI.post).toHaveBeenCalledWith('/orders', orderData);
    });
  });

  describe('fetchOrders', () => {
    it('should fetch orders as array', async () => {
      const mockOrders = [
        { _id: 'order-1', customerName: 'John', status: 'pending' },
        { _id: 'order-2', customerName: 'Jane', status: 'delivered' },
      ];

      mockAPI.get.mockResolvedValue({ data: mockOrders });

      const result = await fetchOrders();

      expect(mockAPI.get).toHaveBeenCalledWith('/orders');
      expect(result).toEqual(mockOrders);
    });

    it('should handle orders response with orders property', async () => {
      const mockOrders = [
        { _id: 'order-1', customerName: 'John', status: 'pending' },
      ];

      mockAPI.get.mockResolvedValue({ data: { orders: mockOrders } });

      const result = await fetchOrders();

      expect(result).toEqual(mockOrders);
    });

    it('should handle fetch orders error', async () => {
      const error = new Error('Server error');
      mockAPI.get.mockRejectedValue(error);

      await expect(fetchOrders()).rejects.toThrow('Server error');
      expect(mockAPI.get).toHaveBeenCalledWith('/orders');
    });
  });
});
