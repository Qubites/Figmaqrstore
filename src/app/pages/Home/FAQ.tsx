import { motion } from "motion/react";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "How long does it take to get setup?",
      answer: "Under 20 seconds. You log in, create a product with a name and price, and instantly receive a QR code to start accepting payments.",
    },
    {
      question: "Do I need any special hardware?",
      answer: "None. All you need is a smartphone, tablet, or laptop to display your QR code. Your customers scan it using their own smartphone camera to pay.",
    },
    {
      question: "Are there any monthly fees or hidden costs?",
      answer: "No subscriptions, no startup fees. We charge a simple, flat 3% transaction fee on every successful payment. If you don't sell anything, you pay nothing.",
    },
    {
      question: "How do I receive my money?",
      answer: "Funds are automatically paid out to your linked local bank account. Currently, we support direct payouts to UK banks.",
    },
    {
      question: "Can I manage multiple staff members?",
      answer: "Yes! You can easily manage multiple sellers. Each staff member logs into the dashboard and gets their own QR code, letting you run large events without hardware costs.",
    },
  ];

  return (
    <section className="w-full bg-[#F7F5EF] py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-gray-900 text-center mb-16">
          Frequently asked questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-6 py-5 flex items-center justify-between font-semibold text-gray-900 focus:outline-none"
      >
        <span>{question}</span>
        <span className="text-gray-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-50 pt-4"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
}
