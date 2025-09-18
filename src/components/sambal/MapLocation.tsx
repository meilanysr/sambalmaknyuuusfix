import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface MapLocationProps {
  title: string;
  description: string;
  iframeSrc: string;
}

const MapLocation = ({ title, description, iframeSrc }: MapLocationProps) => {
  return (
    <section id="location" className="bg-red-50/95 py-20 md:py-28">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-red-900 mb-4 flex items-center justify-center gap-2"
        >
          <MapPin className="w-8 h-8" /> {title}
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden rounded-lg shadow-xl border-4 border-white"
        >
          <iframe
            src={iframeSrc}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Sambal Maknyuuus"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
};

export default MapLocation;