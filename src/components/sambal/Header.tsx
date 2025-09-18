import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { CartSheet } from "@/components/cart/CartSheet";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { session } = useAuth();
  const { getItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-red-100">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a href="/" className="text-xl sm:text-2xl font-bold text-red-800">
            Sambal Maknyuuus
          </a>
          <nav className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                  {itemCount}
                </Badge>
              )}
            </Button>
            {session ? (
              <Button asChild variant="outline">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link to="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>
      <CartSheet isOpen={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  );
};

export default Header;