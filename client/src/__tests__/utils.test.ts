import { describe, it, expect } from 'vitest';
import { clsx } from 'clsx';

describe('Utility Functions', () => {
  describe('clsx - conditional classname utility', () => {
    it('should combine multiple class names', () => {
      const result = clsx('class1', 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const result = clsx('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('should ignore falsy values', () => {
      const result = clsx('base', false && 'hidden', null, undefined, 'visible');
      expect(result).toContain('base');
      expect(result).toContain('visible');
      expect(result).not.toContain('hidden');
    });

    it('should handle object syntax', () => {
      const result = clsx({
        'class-a': true,
        'class-b': false,
        'class-c': true,
      });
      expect(result).toContain('class-a');
      expect(result).toContain('class-c');
      expect(result).not.toContain('class-b');
    });
  });

  describe('Number formatting', () => {
    it('should format price correctly to 2 decimal places', () => {
      const price = 299.9;
      expect(price.toFixed(2)).toBe('299.90');
    });

    it('should handle large prices', () => {
      const price = 9999.999;
      expect(parseFloat(price.toFixed(2))).toBe(10000.00);
    });

    it('should handle small prices', () => {
      const price = 0.1;
      expect(price.toFixed(2)).toBe('0.10');
    });
  });

  describe('Array operations', () => {
    it('should find item in array by ID', () => {
      const items = [
        { _id: '1', name: 'Pizza' },
        { _id: '2', name: 'Burger' },
      ];
      const found = items.find(i => i._id === '1');
      expect(found?.name).toBe('Pizza');
    });

    it('should filter array correctly', () => {
      const items = [
        { _id: '1', quantity: 1 },
        { _id: '2', quantity: 0 },
        { _id: '3', quantity: 2 },
      ];
      const filtered = items.filter(i => i.quantity > 0);
      expect(filtered).toHaveLength(2);
    });

    it('should map array correctly', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];
      const totals = items.map(i => i.price * i.quantity);
      expect(totals).toEqual([200, 50]);
    });

    it('should reduce array to sum', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
      ];
      const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      expect(total).toBe(250);
    });
  });

  describe('String operations', () => {
    it('should validate email format', () => {
      const email = 'test@example.com';
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(true);
    });

    it('should validate phone number (10 digits)', () => {
      const phone = '1234567890';
      const isValid = /^\d{10}$/.test(phone);
      expect(isValid).toBe(true);
    });

    it('should reject invalid phone number', () => {
      const phone = '123';
      const isValid = /^\d{10}$/.test(phone);
      expect(isValid).toBe(false);
    });

    it('should trim whitespace from strings', () => {
      const str = '  hello world  ';
      expect(str.trim()).toBe('hello world');
    });
  });

  describe('Object operations', () => {
    it('should create new object with updated field', () => {
      const obj = { name: 'Pizza', price: 100 };
      const updated = { ...obj, price: 150 };
      expect(updated.price).toBe(150);
      expect(obj.price).toBe(100); // original unchanged
    });

    it('should merge two objects', () => {
      const obj1 = { name: 'Pizza', price: 100 };
      const obj2 = { quantity: 2, category: 'Veg' };
      const merged = { ...obj1, ...obj2 };
      expect(merged).toEqual({
        name: 'Pizza',
        price: 100,
        quantity: 2,
        category: 'Veg',
      });
    });
  });
});
