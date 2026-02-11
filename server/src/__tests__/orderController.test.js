import { describe, it, expect, beforeEach, vi } from 'vitest';
import { placeOrder, getMyOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';
import Order from '../models/orderModel.js';
import { getIO } from '../config/socket.js';

// Mock the Order model and socket
vi.mock('../models/orderModel.js');
vi.mock('../config/socket.js');

describe('Order Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe('placeOrder', () => {
    it('should create a new order with status 201', async () => {
      const orderData = {
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        items: [{ productId: '1', quantity: 2, name: 'Product 1', price: 100 }],
        totalAmount: 200,
      };

      req.body = orderData;

      const mockSave = vi.fn().mockResolvedValue({ _id: 'order-1', ...orderData, status: 'pending' });
      vi.mocked(Order).mockImplementation(() => ({ save: mockSave }));

      await placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should reject orders with empty items', async () => {
      req.body = {
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        items: [],
        totalAmount: 0,
      };

      await placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No items in order' });
    });

    it('should reject orders without items', async () => {
      req.body = {
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        totalAmount: 0,
      };

      await placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'No items in order' });
    });

    it('should handle errors when creating an order', async () => {
      req.body = {
        customerName: 'John Doe',
        address: '123 Main St',
        phone: '1234567890',
        items: [{ productId: '1', quantity: 2 }],
        totalAmount: 200,
      };

      const error = new Error('Database error');
      const mockSave = vi.fn().mockRejectedValue(error);
      vi.mocked(Order).mockImplementation(() => ({ save: mockSave }));

      await placeOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getMyOrders', () => {
    it('should return all orders sorted by creation date', async () => {
      const mockOrders = [
        {
          _id: 'order-1',
          customerName: 'John Doe',
          status: 'pending',
          createdAt: new Date(),
        },
        {
          _id: 'order-2',
          customerName: 'Jane Doe',
          status: 'delivered',
          createdAt: new Date(),
        },
      ];

      Order.find.mockReturnValue({
        sort: vi.fn().mockResolvedValue(mockOrders),
      });

      await getMyOrders(req, res);

      expect(Order.find).toHaveBeenCalledWith();
      expect(res.json).toHaveBeenCalledWith(mockOrders);
    });

    it('should handle errors when fetching orders', async () => {
      const error = new Error('Database error');
      Order.find.mockReturnValue({
        sort: vi.fn().mockRejectedValue(error),
      });

      await getMyOrders(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getOrderById', () => {
    it('should return an order by ID', async () => {
      const mockOrder = {
        _id: 'order-1',
        customerName: 'John Doe',
        status: 'pending',
      };

      req.params = { id: 'order-1' };
      Order.findById.mockResolvedValue(mockOrder);

      await getOrderById(req, res);

      expect(Order.findById).toHaveBeenCalledWith('order-1');
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 if order not found', async () => {
      req.params = { id: 'invalid-id' };
      Order.findById.mockResolvedValue(null);

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('should handle errors when fetching an order', async () => {
      req.params = { id: 'order-1' };
      const error = new Error('Database error');
      Order.findById.mockRejectedValue(error);

      await getOrderById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and emit socket event', async () => {
      const mockOrder = {
        _id: { toString: () => 'order-1' },
        customerName: 'John Doe',
        status: 'confirmed',
      };

      const mockIO = {
        to: vi.fn().mockReturnThis(),
        emit: vi.fn(),
      };

      req.params = { id: 'order-1' };
      req.body = { status: 'confirmed' };

      Order.findByIdAndUpdate.mockResolvedValue(mockOrder);
      getIO.mockReturnValue(mockIO);

      await updateOrderStatus(req, res);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('order-1', { status: 'confirmed' }, { new: true });
      expect(getIO).toHaveBeenCalled();
      expect(mockIO.to).toHaveBeenCalledWith('order-1');
      expect(mockIO.emit).toHaveBeenCalledWith('orderUpdate', mockOrder);
      expect(res.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 if order not found during update', async () => {
      req.params = { id: 'invalid-id' };
      req.body = { status: 'confirmed' };
      Order.findByIdAndUpdate.mockResolvedValue(null);

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });

    it('should handle errors when updating order status', async () => {
      req.params = { id: 'order-1' };
      req.body = { status: 'confirmed' };
      const error = new Error('Database error');
      Order.findByIdAndUpdate.mockRejectedValue(error);

      await updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
