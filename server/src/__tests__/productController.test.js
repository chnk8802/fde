import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import Product from '../models/productModel.js';

// Mock the Product model
vi.mock('../models/productModel.js');

describe('Product Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
    };
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100, description: 'Desc 1', image: 'img1.jpg' },
        { _id: '2', name: 'Product 2', price: 200, description: 'Desc 2', image: 'img2.jpg' },
      ];

      Product.find.mockResolvedValue(mockProducts);

      await getProducts(req, res);

      expect(Product.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors when fetching products', async () => {
      const error = new Error('Database error');
      Product.find.mockRejectedValue(error);

      await getProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const mockProduct = { _id: '1', name: 'Product 1', price: 100 };
      req.params = { id: '1' };
      Product.findById.mockResolvedValue(mockProduct);

      await getProductById(req, res);

      expect(Product.findById).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      req.params = { id: 'invalid-id' };
      Product.findById.mockResolvedValue(null);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should handle errors when fetching a product', async () => {
      req.params = { id: '1' };
      const error = new Error('Database error');
      Product.findById.mockRejectedValue(error);

      await getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createProduct', () => {
    it('should create a new product and return status 201', async () => {
      const productData = {
        name: 'New Product',
        description: 'New Description',
        price: 150,
        image: 'newimg.jpg',
      };

      req.body = productData;

      const mockSave = vi.fn().mockResolvedValue({ _id: 'new-id', ...productData });
      vi.mocked(Product).mockImplementation(() => ({ save: mockSave }));

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle validation errors when creating a product', async () => {
      req.body = { name: 'Product' }; // Missing required fields
      const error = new Error('Validation error');
      
      const mockSave = vi.fn().mockRejectedValue(error);
      vi.mocked(Product).mockImplementation(() => ({ save: mockSave }));

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateData = { name: 'Updated Product', price: 200 };
      req.params = { id: '1' };
      req.body = updateData;

      const updatedProduct = { _id: '1', ...updateData };
      Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

      await updateProduct(req, res);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('1', updateData, { new: true });
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should handle errors when updating a product', async () => {
      req.params = { id: '1' };
      req.body = { name: 'Updated' };
      const error = new Error('Update error');
      Product.findByIdAndUpdate.mockRejectedValue(error);

      await updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update error' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      req.params = { id: '1' };
      Product.findByIdAndDelete.mockResolvedValue({});

      await deleteProduct(req, res);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.json).toHaveBeenCalledWith({ message: 'Product deleted' });
    });

    it('should handle errors when deleting a product', async () => {
      req.params = { id: '1' };
      const error = new Error('Delete error');
      Product.findByIdAndDelete.mockRejectedValue(error);

      await deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete error' });
    });
  });
});
