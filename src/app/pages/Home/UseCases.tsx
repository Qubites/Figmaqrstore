import { motion } from "motion/react";
import { Music, Coffee, ShoppingBag, Users } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

export function UseCases() {
  const cases = [
    {
      title: "Events & Concerts",
      icon: <Music className="w-6 h-6 text-[#006241]" />,
      description: "Equip dozens of volunteers or staff instantly. Everyone gets their own QR code on their own device.",
      image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2R8ZW58MXx8fHwxNzcxODQwNTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Pop-up Shops",
      icon: <ShoppingBag className="w-6 h-6 text-[#006241]" />,
      description: "No hardware to pack or power to find. Start selling anywhere from a smartphone or tablet.",
      image: "https://images.unsplash.com/photo-1768661608162-6e1ab80f81cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwb3AlMjB1cCUyMHN0YW5kfGVufDF8fHx8MTc3MTg2NzE4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Restaurants",
      icon: <Coffee className="w-6 h-6 text-[#006241]" />,
      description: "Let servers collect payments at the table by showing a simple QR on their phone.",
      image: "https://images.unsplash.com/photo-1763867641258-c8ea40860f7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwc2VydmVyJTIwdGFibGV0fGVufDF8fHx8MTc3MTg2NzE4N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Large Teams",
      icon: <Users className="w-6 h-6 text-[#006241]" />,
      description: "Manage multiple sellers and devices securely without buying expensive card terminals for each.",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc3MTg1MjIzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <section id="use-cases" className="w-full bg-[#F7F5EF] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Built for anywhere
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're selling coffee from a van or running a major music festival, QrStore scales instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-default flex flex-col"
            >
              <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                <ImageWithFallback 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300">
                  {useCase.icon}
                </div>
              </div>
              <div className="p-8 flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{useCase.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
