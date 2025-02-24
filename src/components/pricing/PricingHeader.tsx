
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";

export const PricingHeader = () => {
  return (
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
      </div>
    </header>
  );
};
