import React from "react";
import { useParams, Link } from "react-router";
import { StorefrontHeader } from "../components/qrstore/headers";
import { TrustLayer } from "../components/qrstore/trust-badges";
import { ProductPriceDisplay } from "../components/qrstore/price-input";
import { Button } from "../components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import { useSoundEffects } from "../hooks/use-sound-effects";
import { motion } from "motion/react";

// Mock data for demo
const MOCK_MERCHANT = {
  name: "Bella's Coffee",
  slug: "demo-shop",
  logo: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop",
  verified: true,
  salesCount: 245,
  category: "Cafe",
  city: "Amsterdam",
  currency: "EUR",
};

const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Cappuccino",
    price: "3.50",
    vatRate: 9,
    vatIncluded: true,
    image: "https://images.unsplash.com/photo-1513876585916-61d40895c50e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "2",
    name: "Croissant",
    price: "2.80",
    vatRate: 9,
    vatIncluded: true,
    image: "https://images.unsplash.com/photo-1753826366766-b2aa6daba141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "3",
    name: "Avocado Toast",
    price: "7.50",
    vatRate: 9,
    vatIncluded: true,
    image: "https://images.unsplash.com/photo-1580321719479-412d4a41e9ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: "4",
    name: "Fresh Orange Juice",
    price: "4.20",
    vatRate: 9,
    vatIncluded: true,
    image: "https://images.unsplash.com/photo-1650292390827-51240d74eb0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
];

export default function StorefrontPage() {
  const { merchantSlug } = useParams();
  const { playClick, playPop } = useSoundEffects();
  const [cartCount, setCartCount] = React.useState(2);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop();
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <StorefrontHeader 
        merchantName={MOCK_MERCHANT.name}
        cartCount={cartCount}
        className="sticky top-0 z-40 bg-background/80 backdrop-blur-md"
      />

      {/* Main content */}
      <main className="container mx-auto px-6 py-8 max-w-md">
        
        {/* Trust Layer - Integrated cleanly */}
        <div className="mb-8">
           <TrustLayer
            merchantName={MOCK_MERCHANT.name}
            // merchantLogo={MOCK_MERCHANT.logo} // Already in header
            verified={MOCK_MERCHANT.verified}
            salesCount={MOCK_MERCHANT.salesCount}
            className="p-0"
          />
        </div>

        {/* Products - Minimal List */}
        <div className="space-y-0 divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {MOCK_PRODUCTS.map((product) => (
            <div key={product.id} className="group flex gap-4 py-4 items-center cursor-pointer hover:bg-stone-50 transition-colors px-4 -mx-4 rounded-3xl" onClick={playClick}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 relative border border-black/5 ring-1 ring-black/5 shadow-sm">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="font-medium text-base text-neutral-900 mb-1">{product.name}</h3>
                <div className="flex items-center gap-2 text-sm text-neutral-600 font-commerce">
                  <span>{MOCK_MERCHANT.currency} {product.price}</span>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="h-9 w-9 rounded-full border border-neutral-200 text-neutral-600 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors flex items-center justify-center shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
          ))}
        </div>
      </main>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-neutral-200 z-50">
        <div className="container mx-auto max-w-md">
          <Link to="/checkout/demo-order-123" onClick={playClick}>
            <Button size="lg" className="w-full text-base font-medium h-12 shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]">
              View Order <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
