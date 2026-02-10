import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import CartControl from "./CartControl";

interface ProductProps {
  item: { id: string; name: string; price: number; description: string; image: string };
  quantity: number;
  onUpdate: (id: string, delta: number) => void;
}

export function ProductCard({ item, quantity, onUpdate }: ProductProps) {
  return (
    <Card className="overflow-hidden border shadow-sm transition-hover hover:shadow-md">
      <img src={item.image} alt={item.name} className="aspect-video object-cover w-full" />
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <p className="text-xl font-bold mt-2">₹ {item.price.toFixed(2)}</p>
      </CardHeader>

      <CardFooter className="p-4 pt-0">
        {quantity === 0 ? (
          <Button onClick={() => onUpdate(item.id, 1)} className="w-full">
            Add to Cart
          </Button>
        ) : (
          <CartControl 
            quantity={quantity} 
            onIncrease={() => onUpdate(item.id, 1)} 
            onDecrease={() => onUpdate(item.id, -1)} 
          />
        )}
      </CardFooter>
    </Card>
  );
}