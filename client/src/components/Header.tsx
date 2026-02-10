import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Header({ cartCount = 0, onCartClick }: any) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-bold tracking-tight text-primary cursor-pointer hover:opacity-80 transition-opacity"
        >
          FoodDelivery
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate('/manage')}
            title="Manage Orders"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Manage</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -right-2 -top-2 px-2 py-0.5 text-xs">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
