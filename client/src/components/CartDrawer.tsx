import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";

export default function CartDrawer({ isOpen, onClose, cart, foodItems, onUpdate }: any) {
  const cartItems = cart.map((c: any) => ({
    ...foodItems.find((f: any) => f.id === c.id),
    quantity: c.quantity
  }));

  const total = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Your Order</SheetTitle>
        </SheetHeader>
        
        <Separator className="my-4" />

        <ScrollArea className="flex-1 pr-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-2 py-20">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Add some tasty items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)} x {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onUpdate(item.id, -1)}>-</Button>
                    <span className="w-4 text-center">{item.quantity}</span>
                    <Button variant="outline" size="sm" onClick={() => onUpdate(item.id, 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <SheetFooter className="mt-auto flex-col pt-6">
            <div className="flex w-full justify-between py-4 text-lg font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Button className="w-full h-12 text-lg">
              Proceed to Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}