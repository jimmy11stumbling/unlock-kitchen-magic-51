
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, ChefHat } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
              <ChefHat className="w-6 h-6 text-primary animate-float" />
            </div>
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms]">
              MaestroAI
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms] hover:scale-105 transition-transform">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms] hover:scale-105 transition-transform">
              About
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <div className="pt-16">
          <Hero />
          <Features showViewAllButton={true} />
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center py-8 px-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">MaestroAI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MaestroAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Index;
