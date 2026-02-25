import { motion } from "motion/react";
import { Link } from "react-router";
import { Smartphone, Store, Building2, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

const demos = [
  {
    title: "Client App",
    description: "Experience the customer payment flow. Scan a code, pay with Apple Pay, and get a receipt.",
    path: "/client",
    icon: Smartphone,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    badge: "Consumer"
  },
  {
    title: "Seller App",
    description: "The merchant point of sale. Accept payments, manage orders, and view daily stats.",
    path: "/seller",
    icon: Store,
    color: "bg-green-50 text-green-600 border-green-100",
    badge: "Merchant"
  },
  {
    title: "Owner Dashboard",
    description: "Manage business settings, team members, and financial reports from the back office.",
    path: "/owner",
    icon: Building2,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    badge: "Admin"
  },
  {
    title: "Platform Admin",
    description: "Super-admin view for platform oversight, user management, and global settings.",
    path: "/admin",
    icon: ShieldCheck,
    color: "bg-gray-100 text-gray-800 border-gray-200",
    badge: "Internal"
  },
  {
    title: "Storefront Demo",
    description: "Public-facing merchant profile page seen by customers on the web.",
    path: "/storefront/demo-merchant",
    icon: ExternalLink,
    color: "bg-orange-50 text-orange-600 border-orange-100",
    badge: "Public"
  }
];

export function DemoLinks() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200/50 text-gray-600 font-semibold text-xs mb-6 uppercase tracking-wider">
            Internal Preview
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Explore the Ecosystem
          </h2>
          <p className="text-lg text-gray-600">
            Navigate through the different applications that power the QrStore platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                to={demo.path}
                className="group flex flex-col h-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-2xl text-[10px] font-bold uppercase tracking-wider ${demo.color}`}>
                  {demo.badge}
                </div>

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${demo.color} border`}>
                  <demo.icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#006241] transition-colors">
                  {demo.title}
                </h3>
                
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  {demo.description}
                </p>
                
                <div className="flex items-center text-sm font-semibold text-[#006241] mt-auto">
                  Launch Demo
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
