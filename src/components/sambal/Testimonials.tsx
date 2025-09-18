import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialsProps {
  title: string;
}

const testimonials = [
  {
    name: "Budi Santoso",
    location: "Pecinta Sambal dari Jakarta",
    rating: 5,
    quote: "Sambalnya juara! Pedasnya pas, gurihnya nendang. Nggak bisa makan tanpa sambal ini sekarang. Wajib coba!",
    avatar: "https://i.pravatar.cc/150?u=budi",
  },
  {
    name: "Citra Lestari",
    location: "Ibu Rumah Tangga, Bandung",
    rating: 5,
    quote: "Praktis dan enak banget buat stok di rumah. Anak-anak dan suami semua suka. Rasanya otentik, kayak buatan sendiri.",
    avatar: "https://i.pravatar.cc/150?u=citra",
  },
  {
    name: "Agus Wijaya",
    location: "Mahasiswa, Surabaya",
    rating: 4,
    quote: " penyelamat anak kos! Makan apa aja jadi nikmat kalau ditambah Sambal Maknyuuus. Harganya juga terjangkau.",
    avatar: "https://i.pravatar.cc/150?u=agus",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${
        i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
      }`}
    />
  ));
};

const Testimonials = ({ title }: TestimonialsProps) => {
  return (
    <section id="testimonials" className="bg-white py-20 md:py-28">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-red-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;