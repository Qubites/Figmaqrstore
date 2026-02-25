import { motion } from "motion/react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Star } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Owner, East London Coffee",
    image: "https://images.unsplash.com/photo-1753351052363-53ce102830eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBiYXJpc3RhJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxODcxNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I forgot my card reader, signed up for QrStore on my phone, and was taking payments 2 minutes later. Absolute lifesaver.",
  },
  {
    name: "Marcus Thorne",
    role: "Event Organizer, Horizon Festivals",
    image: "https://images.unsplash.com/photo-1753351055062-55b6bc51bb4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY2FmZSUyMG93bmVyfGVufDF8fHx8MTc3MTg3MTk2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    text: "We deployed QrStore to 40 volunteer staff members in 10 minutes. No hardware to distribute, no training, just smooth fast queues all weekend.",
  },
  {
    name: "Elena Rodriguez",
    role: "Founder, Elena's Pop-up Bakery",
    image: "https://images.unsplash.com/photo-1758887261865-a2b89c0f7ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMGJ1c2luZXNzJTIwb3duZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE3ODY2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    text: "The 3% flat fee with no monthly subscriptions means I finally know exactly what I'm paying. Plus, my customers love paying with Apple Pay right from the QR.",
  },
  {
    name: "James & Tom",
    role: "Weekend Market Traders",
    text: "Setup was literally under 20 seconds. We thought it was a gimmick until we took our first payment. Incredible.",
  },
  {
    name: "David Chen",
    role: "Food Truck Operator",
    image: "https://images.unsplash.com/photo-1768314845819-2f015b7f3b1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwdHJ1Y2slMjBvd25lciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTg2ODE3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    text: "I used to lose signal on my old card machine constantly. Now customers just scan the code, and their own 5G does the work. It's brilliant.",
  },
  {
    name: "Emma L.",
    role: "Freelance Florist",
    text: "I don't sell every day, so paying £29/mo for a merchant account was crazy. QrStore is exactly what I needed. Simple, fast, beautiful.",
  },
];

export function WallOfLove() {
  return (
    <section id="wall-of-love" className="w-full bg-[#F7F5EF] py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1 text-yellow-500 mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </motion.div>
          
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Loved by independent sellers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of merchants who ditched the plastic card readers and switched to instant, zero-hardware payments.
          </p>
        </div>

        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 768: 2, 1024: 3 }}
        >
          <Masonry gutter="1.5rem">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100/50 flex flex-col gap-6 group"
              >
                <div className="flex gap-1 text-[#006241]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  "{t.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto pt-4">
                  {t.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm bg-gray-100">
                      <ImageWithFallback 
                        src={t.image} 
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#006241]/10 text-[#006241] flex items-center justify-center font-bold text-lg">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  );
}
