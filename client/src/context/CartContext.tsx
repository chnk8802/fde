import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  items: CartItem[];
  updateQuantity: (item: any, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const updateQuantity = useCallback((product: any, delta: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          return prev.filter((i) => i._id !== product._id);
        }
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: newQuantity } : i
        );
      }
      if (delta > 0) {
        return [...prev, { 
          _id: product._id, 
          name: product?.name, 
          price: product?.price, 
          quantity: 1,
          image: product?.image
        }];
      }
      return prev;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getCartTotal = () => items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const getCartCount = () => items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ isCartOpen, setIsCartOpen, items, updateQuantity, clearCart, getCartTotal, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};