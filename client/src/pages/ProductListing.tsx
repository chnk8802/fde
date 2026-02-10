import { useState, useEffect } from 'react'; // Added useEffect
import { ProductCard } from '@/components/ProductCard';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CartDrawer from '@/components/CartDrawer';
import { fetchProducts } from '@/services/api';

export default function ProductListing() {
  const [products, setProducts] = useState([]); 
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        return newQuantity <= 0 
          ? prev.filter((item) => item.id !== id) 
          : prev.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item);
      }
      return delta > 0 ? [...prev, { id, quantity: 1 }] : prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold tracking-tight text-primary">FoodDelivery</h1>
          <Button variant="outline" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-2 -top-2 px-2 py-0.5 text-xs">{cartCount}</Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-10 px-4 max-w-6xl">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight">Our Menu</h2>
          <p className="text-muted-foreground mt-2">Authentic vegetarian dishes delivered fresh.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl font-medium">Loading Delicious Food...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((item: any) => (
              <ProductCard
                key={item._id}
                item={item}
                quantity={cart.find((c) => c.id === item._id)?.quantity || 0}
                onUpdate={(id, delta) => updateQuantity(item._id, delta)}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        foodItems={products}
        onUpdate={updateQuantity}
      />
    </div>
  );
}