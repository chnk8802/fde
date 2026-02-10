import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

export default function CartControl({ quantity, onIncrease, onDecrease }: { quantity: number; onIncrease: () => void; onDecrease: () => void }) {
  return (
    <div className="flex items-center justify-between w-full border rounded-md p-1 bg-slate-50">
      <Button variant="ghost" size="icon" onClick={onDecrease} className="h-8 w-8 text-destructive">
        {quantity === 1 ? <Trash2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </Button>
      <span className="font-bold text-sm">{quantity}</span>
      <Button variant="ghost" size="icon" onClick={onIncrease} className="h-8 w-8 text-primary">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}