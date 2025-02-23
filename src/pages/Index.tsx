
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <span className="font-bold">MaestroAI</span>
        </Link>
        <nav className="ml-auto">
          <Link to="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
            Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <Hero />
      </main>
      <footer className="flex py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 MaestroAI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
