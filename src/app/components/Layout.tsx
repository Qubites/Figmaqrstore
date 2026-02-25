import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen bg-[#F7F5EF] text-gray-900 font-sans selection:bg-[#006241]/20">
      <Header />
      <main className="pt-24 min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
