
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ChefHat, Check } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetupWizard } from "@/components/setup/SetupWizard";

const Pricing = () => {
  const [showSetup, setShowSetup] = useState(false);

  const handleGetStarted = () => {
    setShowSetup(true);
  };

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
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 pt-24">
        <h1 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h1>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Starter</h2>
            <p className="text-3xl font-bold">$49<span className="text-lg text-muted-foreground">/mo</span></p>
            <p className="text-muted-foreground">Perfect for small restaurants getting started</p>
            <ul className="space-y-2">
              {['Up to 5 staff members', 'Basic reporting', 'Menu management', 'Table management'].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={handleGetStarted}>Get Started</Button>
          </div>

          {/* Professional Plan */}
          <div className="border rounded-lg p-6 space-y-4 bg-primary/5 border-primary">
            <h2 className="text-2xl font-semibold">Professional</h2>
            <p className="text-3xl font-bold">$99<span className="text-lg text-muted-foreground">/mo</span></p>
            <p className="text-muted-foreground">For growing restaurants with advanced needs</p>
            <ul className="space-y-2">
              {[
                'Up to 15 staff members',
                'Advanced analytics',
                'Inventory management',
                'Customer feedback system',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={handleGetStarted}>Get Started</Button>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold">Enterprise</h2>
            <p className="text-3xl font-bold">Custom</p>
            <p className="text-muted-foreground">For large restaurants with custom requirements</p>
            <ul className="space-y-2">
              {[
                'Unlimited staff members',
                'Custom reporting',
                'API access',
                'Dedicated support',
                'Custom integrations',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full" onClick={handleGetStarted}>Contact Sales</Button>
          </div>
        </div>
      </main>

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

      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="max-w-4xl">
          <SetupWizard />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
