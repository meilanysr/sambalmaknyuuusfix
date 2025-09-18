import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Package, Smile, Star } from "lucide-react";

interface StatsProps {
  title: string;
}

const stats = [
  {
    icon: <Package className="w-12 h-12 text-red-500" />,
    value: 1500,
    label: "Produk Terjual",
  },
  {
    icon: <Smile className="w-12 h-12 text-yellow-500" />,
    value: 500,
    label: "Pelanggan Puas",
  },
  {
    icon: <Star className="w-12 h-12 text-green-500" />,
    value: 250,
    label: "Ulasan Bintang 5",
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat("id-ID").format(
            Math.round(latest)
          );
        }
      }),
    [springValue]
  );

  return <span ref={ref} />;
}

const Stats = ({ title }: StatsProps) => {
  return (
    <section id="stats" className="bg-white py-20 md:py-28">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center p-6 bg-red-50 rounded-lg shadow-md"
            >
              <div className="mb-4">{stat.icon}</div>
              <p className="text-4xl md:text-5xl font-extrabold text-red-800">
                <AnimatedNumber value={stat.value} />+
              </p>
              <p className="text-lg text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;