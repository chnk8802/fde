import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import Checkout from "./Checkout";
import { fetchProducts, createOrder } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";

export default function ProductListing() {
  const navigate = useNavigate();
  const { isCartOpen, setIsCartOpen, items, updateQuantity, getCartCount, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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

  const handleCheckout = async (orderData: any) => {
    try {
      const result = await createOrder(orderData);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      clearCart();
      navigate("/manage")
    } catch (error: any) {
      console.error("Error creating order:", error);
      alert("Failed to create order: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {!isCheckoutOpen ? (
        <>
          <Header cartCount={getCartCount()} onCartClick={() => setIsCartOpen(true)} />

          <main className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-extrabold tracking-tight">Our Menu</h2>
              <p className="text-muted-foreground mt-2">
                Authentic vegetarian dishes delivered fresh.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-xl font-medium">
                Loading Delicious Food...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    item={product}
                    quantity={items.find((i) => i._id === product._id)?.quantity || 0}
                    onUpdate={(id, delta) => updateQuantity(product, delta)}
                  />
                ))}
              </div>
            )}
          </main>

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={items}
            onUpdate={(id:string, delta:number) => {
              const product = products.find((p: any) => p._id === id);
              if (product) updateQuantity(product, delta);
            }}
            onCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
        </>
      ) : (
        <Checkout
          cart={items}
          onBack={() => setIsCheckoutOpen(false)}
          onSubmit={handleCheckout}
        />
      )}
    </div>
  );
}