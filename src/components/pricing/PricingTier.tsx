
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  onGetStarted: () => void;
}

export const PricingTier = ({
  name,
  price,
  description,
  features,
  isPopular,
  onGetStarted,
}: PricingTierProps) => {
  return (
    <div 
      className={`border rounded-lg p-6 space-y-4 transition-all duration-300 hover:scale-105 ${
        isPopular ? "bg-primary/5 border-primary" : ""
      }`}
      role="article"
      aria-label={`${name} pricing tier`}
    >
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="text-3xl font-bold">
        {price}
        <span className="text-lg text-muted-foreground">/mo</span>
      </p>
      <p className="text-muted-foreground">{description}</p>
      <ul className="space-y-2" role="list" aria-label={`${name} features`}>
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className="w-full animate-fade-in" 
        onClick={onGetStarted}
        aria-label={`Get started with ${name} plan`}
      >
        {name === "Enterprise" ? "Contact Sales" : "Get Started"}
      </Button>
    </div>
  );
};
