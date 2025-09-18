import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroProps {
  title: string;
  description: string;
}

const Hero = ({ title, description }: HeroProps) => {
  return (
    <section id="home">
      <div className="bg-black/70">
        <div className="container mx-auto px-6 py-20 md:py-32 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          >
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center"
          >
            
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-6 transform hover:scale-105 transition-transform"
            >
              <a href="#products">Lihat Produk Kami</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;