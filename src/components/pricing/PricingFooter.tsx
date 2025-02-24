
import { ChefHat } from "lucide-react";

export const PricingFooter = () => {
  return (
    <footer className="border-t mt-20">
      <div className="container flex flex-col md:flex-row justify-between items-center py-8 px-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <ChefHat className="w-6 h-6 text-primary animate-float" />
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-gray-400 animate-pulse duration-[3000ms]">
            MaestroAI
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          © 2024 MaestroAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
