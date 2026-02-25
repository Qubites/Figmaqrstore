import React, { useState } from "react";
import { Link } from "react-router";
import { AwningHeader, AwningIcon } from "../components/qrstore/headers";
import { Button } from "../components/ui/button";
import { ArrowRight, ShoppingBag, Store, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header with awning stripe */}
      <AwningHeader className="bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AwningIcon variant="filled" size={24} className="text-primary" />
            <span className="font-semibold tracking-tight text-lg">QrStore</span>
          </div>
          <Link to="/storefront/demo-shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Demo
          </Link>
        </div>
      </AwningHeader>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-6 py-12 flex flex-col items-center justify-center max-w-md">
        
        <div className="w-full space-y-8 mb-12">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              Commerce, <br/>
              <span className="text-muted-foreground">simplified.</span>
            </h1>
            <p className="text-base text-muted-foreground font-light">
              Turn your phone into a shop.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Link to="/seller" className="group">
              <div className="p-6 rounded-3xl border-none shadow-sm ring-1 ring-black/5 bg-card hover:shadow-md hover:ring-black/10 transition-all duration-300 flex items-center justify-between group-hover:bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-lg">Sell</h3>
                    <p className="text-sm text-muted-foreground">Create a sale</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link to="/backoffice" className="group">
              <div className="p-6 rounded-3xl border-none shadow-sm ring-1 ring-black/5 bg-card hover:shadow-md hover:ring-black/10 transition-all duration-300 flex items-center justify-between group-hover:bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:scale-110 transition-transform">
                    <Store className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-lg">Manage</h3>
                    <p className="text-sm text-muted-foreground">Backoffice & settings</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Link>

            {/* Admin Console — separate section */}
            <div className="border-t border-border/40 pt-4 mt-0">
              <p className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest mb-3 text-center">Internal</p>
              <Link to="/admin" className="group">
                <div className="p-5 rounded-3xl border-none shadow-sm ring-1 ring-black/5 bg-card hover:shadow-md hover:ring-black/10 transition-all duration-300 flex items-center justify-between group-hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-base">Admin Console</h3>
                      <p className="text-xs text-muted-foreground">V2 ops dashboard</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Link to="/design-system" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Design System
          </Link>
          <span className="text-muted-foreground/40 mx-2 text-xs">·</span>
          <Link to="/error-states" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Error States
          </Link>
          <span className="text-muted-foreground/40 mx-2 text-xs">·</span>
          <Link to="/admin/gaps" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            Repo Gaps
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            Scan. Pay. Done.
          </p>
        </div>
      </footer>
    </div>
  );
}