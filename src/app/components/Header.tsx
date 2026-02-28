import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Globe, ChevronDown, User, ShoppingBag, BarChart3, Code, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "./ui/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Client", href: "/client", icon: <User className="w-4 h-4" /> },
    { name: "Seller", href: "/seller", icon: <ShoppingBag className="w-4 h-4" /> },
    { name: "Owner", href: "/owner", icon: <BarChart3 className="w-4 h-4" /> },
    { name: "Developer", href: "/dev", icon: <Code className="w-4 h-4" /> },
    { name: "Contact", href: "/contact", icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F7F5EF]/80 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        {/* Top bar for Language/Country */}
        <div className={cn(
          "border-b border-gray-900/5 transition-all duration-300 overflow-hidden",
          scrolled ? "h-0 opacity-0" : "h-8 opacity-100"
        )}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end items-center h-full">
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
              >
                <Globe className="w-3 h-3" />
                <span>US / EN</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", langOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-2 min-w-[140px] z-[60]"
                  >
                    {["US / EN", "DE / DE", "FR / FR", "SE / SV"].map((lang) => (
                      <button 
                        key={lang}
                        className="w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 hover:text-[#006241] rounded-lg transition-colors"
                        onClick={() => setLangOpen(false)}
                      >
                        {lang}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-[#006241] flex items-center justify-center shadow-lg shadow-[#006241]/10 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl">Q</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight leading-none">QrStore</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#006241] mt-0.5">Payments</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-white/50 shadow-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-[#006241] hover:bg-white transition-all duration-200"
                >
                  <span className="opacity-50 group-hover:opacity-100">{link.icon}</span>
                  <span className="font-bold text-[11px] uppercase tracking-widest">{link.name}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="text-[11px] font-bold uppercase tracking-widest text-gray-700 hover:text-gray-900 transition-colors px-4"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-[#006241] text-white px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#004e34] hover:shadow-xl shadow-[#006241]/20 transition-all active:scale-95"
              >
                Get started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 bg-white rounded-xl border border-gray-100 shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-8 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl text-gray-900 hover:bg-gray-50 font-bold text-sm uppercase tracking-widest"
                  >
                    <span className="text-[#006241]">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl border border-gray-100 text-sm font-bold uppercase tracking-widest"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-[#006241] text-white text-sm font-bold uppercase tracking-widest"
                  >
                    Join
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      
      {/* Background overlay for mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

