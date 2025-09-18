import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CtaProps {
  title: string;
  description: string;
  buttonText: string;
  whatsappLink: string;
}

const Cta = ({ title, description, buttonText, whatsappLink }: CtaProps) => {
  return (
    <section id="order" className="bg-red-800 text-white py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-red-100 mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button asChild size="lg" className="bg-white text-red-700 hover:bg-red-100 text-lg px-8 py-6 font-bold transform hover:scale-105 transition-transform">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              {buttonText}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;