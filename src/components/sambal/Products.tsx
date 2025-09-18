import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Promotion } from "@/types/promotion";
import { Input } from "@/components/ui/input";

interface ProductsProps {
  title: string;
  searchPlaceholder: string;
}

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const Products = ({ title, searchPlaceholder }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: true });

      if (productsError) console.error("Error fetching products:", productsError);
      else setProducts(productsData || []);

      const now = new Date().toISOString();
      const { data: promoData, error: promoError } = await supabase
        .from("promotions")
        .select("*")
        .lte('start_date', now)
        .gte('end_date', now)
        .limit(1)
        .single();
      
      if (promoError && promoError.code !== 'PGRST116') { // PGRST116: no rows found
        console.error("Error fetching promotion:", promoError);
      } else {
        setActivePromotion(promoData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const formatPrice = (price: number | null) => {
    if (price === null) return "N/A";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  const calculateDiscountedPrice = (price: number) => {
    if (!activePromotion || !price) return price;
    return price * (1 - activePromotion.discount_percentage / 100);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="products" className="py-20 md:py-28 bg-red-50/95">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-red-900 mb-6"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg mx-auto mb-12 relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-6 text-lg border-red-200 focus:ring-red-500 focus:border-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="text-center border-red-200 shadow-lg flex flex-col h-full overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-3/4 mx-auto mt-2" />
                    <Skeleton className="h-10 w-1/2 mx-auto mt-6" />
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                </Card>
              ))
            : filteredProducts.map((product, index) => {
                const discountedPrice = calculateDiscountedPrice(product.price || 0);
                const productToAdd = { ...product, price: discountedPrice };

                return (
                  <motion.div
                    key={product.id}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.03 }}
                  >
                    <Card className="text-center border-red-200 shadow-lg flex flex-col h-full overflow-hidden relative">
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="absolute top-2 right-2 z-10">Stok Habis</Badge>
                      )}
                      {activePromotion && product.stock > 0 && (
                        <Badge className="absolute top-2 left-2 z-10 bg-red-600">-{activePromotion.discount_percentage}%</Badge>
                      )}
                      <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle className="text-3xl font-bold text-red-600">{product.title}</CardTitle>
                        <p className="text-gray-500">{product.description}</p>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {activePromotion ? (
                          <div className="flex flex-col items-center">
                            <p className="text-2xl text-gray-500 line-through">{formatPrice(product.price)}</p>
                            <p className="text-4xl font-extrabold text-red-800">{formatPrice(discountedPrice)}</p>
                          </div>
                        ) : (
                          <p className="text-4xl font-extrabold text-red-800">{formatPrice(product.price)}</p>
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white" 
                          onClick={() => addToCart(productToAdd)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          {product.stock > 0 ? 'Tambah ke Keranjang' : 'Stok Habis'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
          
          {!loading && filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-10">
              <p className="text-xl text-gray-600">Oops! Produk tidak ditemukan.</p>
              <p className="text-gray-500">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Products;