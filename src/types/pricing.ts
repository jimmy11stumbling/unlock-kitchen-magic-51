
export interface PricingFeature {
  name: string;
  description?: string;
  included: {
    starter: boolean;
    professional: boolean;
    enterprise: boolean;
  };
}

export interface PricingTierData {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export type PlanType = "starter" | "professional" | "enterprise";
