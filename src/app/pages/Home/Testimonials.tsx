import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Owner, East London Coffee",
      image: "https://images.unsplash.com/photo-1667725335393-3f5d14d45e6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwYmFyaXN0YSUyMGZhY2V8ZW58MXx8fHwxNzcxODY4MDA3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "I forgot my card reader for a Saturday pop-up. Signed up for QrStore on my phone and was taking payments 2 minutes later. Absolute lifesaver."
    },
    {
      name: "Marcus Chen",
      role: "Director, SoundWave Festivals",
      image: "https://images.unsplash.com/photo-1589754293549-4c0585a12de5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwZXZlbnQlMjBvcmdhbml6ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzE4NjgwMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "We used to rent 30 terminals for our merch tents. Now, every volunteer just uses their own phone. The cost savings are unbelievable."
    },
    {
      name: "Elena Rodriguez",
      role: "Founder, Artisan Markets",
      image: "https://images.unsplash.com/photo-1752650732081-8f61e81813ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWlsaW5nJTIwc21hbGwlMjBidXNpbmVzcyUyMG93bmVyJTIwZmVtYWxlfGVufDF8fHx8MTc3MTg2ODAxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      quote: "The dashboard is so clean, and seeing payments hit my local bank account the next day without any hidden monthly fees is exactly what my small business needed."
    }
  ];

  return (
    <section className="w-full bg-[#006241] py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-green-500/20 rounded-full blur-3xl mix-blend-screen" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-green-900/40 rounded-full blur-3xl mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Loved by independent sellers
          </h2>
          <p className="text-lg text-green-100/80 max-w-2xl mx-auto">
            Join hundreds of merchants who ditched the hardware and moved to instant QR payments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="bg-white rounded-[2rem] p-8 shadow-xl relative"
            >
              <div className="absolute -top-6 -right-2 opacity-10 text-[#006241]">
                <Quote size={80} />
              </div>
              
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-gray-700 text-lg mb-8 relative z-10 font-medium leading-relaxed">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
                <ImageWithFallback 
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
