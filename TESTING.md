# Testing Guide

This project includes comprehensive tests for both the backend server and frontend client applications.

## Backend Tests (Server)

The backend uses **Jest** for testing with **Supertest** for API route testing.

### Running Server Tests

```bash
cd server

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a specific test file
npm run test:single -- src/__tests__/productController.test.js
```

### Server Test Files

- **`src/__tests__/productController.test.js`** - Tests for product CRUD operations
  - GET all products
  - GET product by ID
  - CREATE new product
  - UPDATE product
  - DELETE product
  - Error handling

- **`src/__tests__/orderController.test.js`** - Tests for order management
  - Place new order
  - Get all orders
  - Get order by ID
  - Update order status
  - Socket.io integration
  - Validation and error handling

- **`src/__tests__/models.test.js`** - Placeholder for model tests
  - Can be enabled for integration testing with a test database
  - Includes examples for Product and Order model validation

### Server Test Coverage

Current test coverage includes:
- ✅ HTTP status codes (201, 200, 400, 404, 500)
- ✅ Request/response validation
- ✅ Error handling
- ✅ Socket.io event emission
- ✅ Database operations (mocked)

## Frontend Tests (Client)

The frontend uses **Vitest** with **React Testing Library** for component and integration testing.

### Running Client Tests

```bash
cd client

# Install dependencies
npm install

# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Client Test Files

- **`src/__tests__/setup.ts`** - Test environment configuration

- **`src/__tests__/CartContext.test.tsx`** - Tests for Cart context
  - Add items to cart
  - Update quantities
  - Calculate totals
  - Clear cart
  - Open/close cart drawer

- **`src/__tests__/ProductCard.test.tsx`** - Tests for ProductCard component
  - Render product information
  - Display price and description
  - Add to cart functionality
  - Quantity updates

- **`src/__tests__/CartControl.test.tsx`** - Tests for CartControl component
  - Increment quantity
  - Decrement quantity
  - Delete item (quantity = 1)
  - Display correct quantity

- **`src/__tests__/Header.test.tsx`** - Tests for Header component
  - Navigation
  - Cart count display
  - Cart button functionality
  - Manage orders button

- **`src/__tests__/api.test.ts`** - Tests for API services
  - Fetch all products
  - Fetch product by ID
  - Create order
  - Fetch orders
  - Error handling

### Client Test Coverage

Current test coverage includes:
- ✅ Component rendering
- ✅ User interactions (clicks, input)
- ✅ State management
- ✅ API calls (mocked)
- ✅ Error scenarios
- ✅ Edge cases

## Configuration Files

### Server Configuration
- **`jest.config.js`** - Jest configuration for Node.js testing environment
- **`package.json`** - Updated with Jest and Supertest dependencies

### Client Configuration
- **`vitest.config.ts`** - Vitest configuration with JSDOM and React support
- **`package.json`** - Updated with Vitest and React Testing Library dependencies

## Test Commands Summary

### Server
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
```

### Client
```bash
npm test                    # Run all tests
npm run test:ui            # Run tests with UI
npm run test:coverage      # Generate coverage report
```

## Writing New Tests

### Server Test Template
```javascript
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('Feature Name', () => {
  let mockData;

  beforeEach(() => {
    // Setup
    mockData = {};
  });

  it('should do something', async () => {
    // Arrange
    const input = mockData;
    
    // Act
    const result = await functionUnderTest(input);
    
    // Assert
    expect(result).toEqual(expected);
  });
});
```

### Client Test Template
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Component from '@/components/Component';

describe('Component Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('expected text')).toBeTruthy();
  });
});
```

## Mocking

### Server Mocking
- Models are mocked using `jest.mock()`
- Database operations return controlled responses
- Socket.io is mocked to test event emissions

### Client Mocking
- API calls are mocked using `vi.mock()`
- Router functions are mocked with `vi.fn()`
- External services are isolated from tests

## Troubleshooting

### Server Tests
- **Module not found**: Ensure you're using ES6 imports in server code
- **Async errors**: Use `async/await` and proper error handling
- **Mock not working**: Ensure mock is declared before import

### Client Tests
- **Component not rendering**: Check if context providers are included
- **User events not working**: Ensure `userEvent.setup()` is called
- **Import errors**: Verify path aliases in `vitest.config.ts`

## Continuous Integration

To integrate tests into CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run server tests
  run: cd server && npm install && npm test

- name: Run client tests
  run: cd client && npm install && npm test
```

## Next Steps

1. Run tests locally to verify setup
2. Add more test cases as features are developed
3. Aim for 80%+ code coverage
4. Integrate tests into your CI/CD pipeline
5. Run tests before committing code

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
