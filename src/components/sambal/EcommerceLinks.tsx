import { Button } from "@/components/ui/button";
import { Instagram, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface EcommerceLinksProps {
  title: string;
  description: string;
}

// TODO: Ganti tautan placeholder dengan tautan toko Anda yang sebenarnya
const ecommercePlatforms = [
  { name: "Tokopedia", link: "https://www.tokopedia.com/your-store", color: "bg-green-500 hover:bg-green-600", icon: <ShoppingCart className="mr-2 h-5 w-5" /> },
  { name: "Shopee", link: "https://shopee.co.id/your-store", color: "bg-orange-500 hover:bg-orange-600", icon: <ShoppingCart className="mr-2 h-5 w-5" /> },
  { name: "Lazada", link: "https://www.lazada.co.id/shop/your-store", color: "bg-blue-500 hover:bg-blue-600", icon: <ShoppingCart className="mr-2 h-5 w-5" /> },
  { name: "Instagram", link: "https://www.instagram.com/sambalmaknyuuus", color: "bg-pink-600 hover:bg-pink-700", icon: <Instagram className="mr-2 h-5 w-5" /> },
];

const EcommerceLinks = ({ title, description }: EcommerceLinksProps) => {
  return (
    <section id="ecommerce" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-red-900 mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600 mb-10 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        <div className="flex flex-wrap justify-center gap-4">
          {ecommercePlatforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            >
              <Button asChild size="lg" className={`${platform.color} text-white text-lg px-8 py-6 font-bold`}>
                <a href={platform.link} target="_blank" rel="noopener noreferrer">
                  {platform.icon} {platform.name}
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcommerceLinks;