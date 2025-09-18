import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
};

const CartItemCard = ({ item }: { item: CartItem }) => {
    const { updateQuantity, removeFromCart } = useCart();
    return (
        <div className="flex items-center gap-4 py-4">
            <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
            <div className="flex-grow">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-500">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
        </div>
    );
};

export const CartSheet = ({ isOpen, onOpenChange }: CartSheetProps) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const total = getCartTotal();

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "6282366669961";
    let message = "Halo, saya tertarik dengan Sambal Maknyuuus dan ingin memesan:\n\n";
    
    cartItems.forEach(item => {
        message += `- ${item.title} (${item.quantity}x) : ${formatPrice(item.price)}\n`;
    });

    message += `\n*Total Pesanan: ${formatPrice(total)}*`;
    message += "\n\nMohon informasinya untuk langkah selanjutnya. Terima kasih!";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Keranjang Belanja Anda</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <div className="flex-grow overflow-y-auto -mx-6 px-6">
              {cartItems.map(item => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </div>
            <Separator />
            <SheetFooter className="mt-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handleWhatsAppCheckout}>
                  Pesan via WhatsApp
                </Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                  Kosongkan Keranjang
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold">Keranjang Anda kosong</p>
            <p className="text-sm text-gray-500 mt-2">Ayo tambahkan beberapa sambal lezat!</p>
            <SheetClose asChild>
                <Button className="mt-4">Lanjut Belanja</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};