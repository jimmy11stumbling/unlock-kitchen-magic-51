
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { PricingTier } from "@/components/pricing/PricingTier";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingFooter } from "@/components/pricing/PricingFooter";

interface PricingTierData {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingTiers: PricingTierData[] = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small restaurants getting started",
    features: [
      "Up to 5 staff members",
      "Basic reporting",
      "Menu management",
      "Table management",
    ],
  },
  {
    name: "Professional",
    price: "$99",
    description: "For growing restaurants with advanced needs",
    features: [
      "Up to 15 staff members",
      "Advanced analytics",
      "Inventory management",
      "Customer feedback system",
      "Priority support",
    ],
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large restaurants with custom requirements",
    features: [
      "Unlimited staff members",
      "Custom reporting",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

const Pricing = () => {
  const [showSetup, setShowSetup] = useState(false);

  const handleGetStarted = () => {
    setShowSetup(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PricingHeader />

      <main className="flex-1 container mx-auto px-4 pt-24">
        <h1 
          className="text-4xl font-bold text-center mb-12 animate-fade-in"
          aria-label="Pricing plans"
        >
          Simple, Transparent Pricing
        </h1>
        
        <div 
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          role="region"
          aria-label="Pricing tiers"
        >
          {pricingTiers.map((tier) => (
            <PricingTier
              key={tier.name}
              {...tier}
              onGetStarted={handleGetStarted}
            />
          ))}
        </div>
      </main>

      <PricingFooter />

      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent className="max-w-4xl">
          <SetupWizard />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Pricing;
