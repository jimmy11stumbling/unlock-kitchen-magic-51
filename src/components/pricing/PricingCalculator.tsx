
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Users, DollarSign } from "lucide-react";
import type { PlanType } from "@/types/pricing";

interface CalculatorProps {
  onPlanSelect?: (plan: PlanType) => void;
}

export const PricingCalculator = ({ onPlanSelect }: CalculatorProps) => {
  const [staffCount, setStaffCount] = useState<number>(1);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(50);

  const recommendPlan = (): PlanType => {
    if (staffCount > 15 || monthlyBudget > 200) return "enterprise";
    if (staffCount > 5 || monthlyBudget > 80) return "professional";
    return "starter";
  };

  const handleCalculate = () => {
    const recommendedPlan = recommendPlan();
    onPlanSelect?.(recommendedPlan);
  };

  return (
    <Card className="p-6 animate-scale-in">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5" />
        Find Your Perfect Plan
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="staff-count" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Number of Staff Members
          </Label>
          <Input
            id="staff-count"
            type="number"
            min="1"
            value={staffCount}
            onChange={(e) => setStaffCount(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="monthly-budget" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Monthly Budget
          </Label>
          <Input
            id="monthly-budget"
            type="number"
            min="0"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            className="mt-1"
          />
        </div>
        <Button 
          onClick={handleCalculate}
          className="w-full animate-pulse hover:animate-none"
        >
          Calculate Recommended Plan
        </Button>
      </div>
    </Card>
  );
};
