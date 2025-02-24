
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { PricingTier } from "@/components/pricing/PricingTier";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingFooter } from "@/components/pricing/PricingFooter";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingCalculator } from "@/components/pricing/PricingCalculator";
import type { PricingTierData, PlanType } from "@/types/pricing";

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
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const handleGetStarted = () => {
    setShowSetup(true);
  };

  const handlePlanSelect = (plan: PlanType) => {
    setSelectedPlan(plan);
    const element = document.getElementById(`plan-${plan}`);
    element?.scrollIntoView({ behavior: 'smooth' });
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

        <div className="max-w-xl mx-auto mb-16">
          <PricingCalculator onPlanSelect={handlePlanSelect} />
        </div>
        
        <div 
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
          role="region"
          aria-label="Pricing tiers"
        >
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              id={`plan-${tier.name.toLowerCase()}`}
              className={`transition-all duration-300 transform ${
                selectedPlan === tier.name.toLowerCase()
                  ? 'scale-105 ring-2 ring-primary rounded-lg'
                  : 'scale-100'
              }`}
            >
              <PricingTier
                {...tier}
                onGetStarted={handleGetStarted}
              />
            </div>
          ))}
        </div>

        <section className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8 animate-fade-in">
            Compare Features
          </h2>
          <PricingComparison />
        </section>
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
