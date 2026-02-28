import { Hero } from "./Home/Hero";
import { ProductDemoVideo } from "./Home/ProductDemoVideo";
import { HowItWorks } from "./Home/HowItWorks";
import { FeeCalculator } from "./Home/FeeCalculator";
import { Pricing } from "./Home/Pricing";
import { UseCases } from "./Home/UseCases";
import { Trust } from "./Home/Trust";
import { WallOfLove } from "./Home/WallOfLove";
import { DashboardSneakPeek } from "./Home/DashboardSneakPeek";
import { FAQ } from "./Home/FAQ";
import { Contact } from "./Home/Contact";
import { FinalCTA } from "./Home/FinalCTA";
import { DemoLinks } from "./Home/DemoLinks";

export function Home() {
  return (
    <div className="flex flex-col gap-24 lg:gap-32 w-full pb-24 overflow-x-hidden">
      <Hero />
      <ProductDemoVideo />
      <HowItWorks />
      <DashboardSneakPeek />
      <UseCases />
      <FeeCalculator />
      <Pricing />
      <Trust />
      <WallOfLove />
      <FAQ />
      <Contact />
      <FinalCTA />
      <DemoLinks />
    </div>
  );
}
