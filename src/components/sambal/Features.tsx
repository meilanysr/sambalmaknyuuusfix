import { Flame, Leaf, UtensilsCrossed, Truck } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturesProps {
  title: string;
}

const features = [
  {
    icon: <Flame className="w-10 h-10 text-red-500" />,
    title: "Pedasnya Pas",
    description: "Nggak cuma pedas, tapi juga enak dan gurih banget!",
  },
  {
    icon: <Leaf className="w-10 h-10 text-green-500" />,
    title: "100% Alami",
    description: "Dibuat dari bahan-bahan segar pilihan tanpa pengawet.",
  },
  {
    icon: <UtensilsCrossed className="w-10 h-10 text-yellow-500" />,
    title: "Cocok Untuk Semua",
    description: "Sempurna untuk makan sehari-hari atau masakan spesial.",
  },
  {
    icon: <Truck className="w-10 h-10 text-blue-500" />,
    title: "Pengiriman Cepat & Aman",
    description: "Pesanan sampai ke rumah Anda dengan aman dan cepat!",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Features = ({ title }: FeaturesProps) => {
  return (
    <section id="features" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center text-red-900 mb-12"
        >
          {title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 bg-red-50 rounded-lg shadow-md"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-red-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;