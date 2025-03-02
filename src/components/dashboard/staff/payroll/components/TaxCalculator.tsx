
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(50000);
  const [federalRate, setFederalRate] = useState<number>(15);
  const [stateRate, setStateRate] = useState<number>(5);
  const [otherDeductions, setOtherDeductions] = useState<number>(7);

  const federalTax = income * (federalRate / 100);
  const stateTax = income * (stateRate / 100);
  const otherDeductionsAmount = income * (otherDeductions / 100);
  const totalDeductions = federalTax + stateTax + otherDeductionsAmount;
  const netIncome = income - totalDeductions;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Calculator</CardTitle>
        <CardDescription>Estimate taxes and take-home pay</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="income">Annual Income</Label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">$</span>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="federal-tax">Federal Tax ({federalRate}%)</Label>
              <span>${federalTax.toFixed(2)}</span>
            </div>
            <Slider
              id="federal-tax"
              min={0}
              max={40}
              step={0.5}
              value={[federalRate]}
              onValueChange={(values) => setFederalRate(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="state-tax">State Tax ({stateRate}%)</Label>
              <span>${stateTax.toFixed(2)}</span>
            </div>
            <Slider
              id="state-tax"
              min={0}
              max={15}
              step={0.5}
              value={[stateRate]}
              onValueChange={(values) => setStateRate(values[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="other-deductions">Other Deductions ({otherDeductions}%)</Label>
              <span>${otherDeductionsAmount.toFixed(2)}</span>
            </div>
            <Slider
              id="other-deductions"
              min={0}
              max={25}
              step={0.5}
              value={[otherDeductions]}
              onValueChange={(values) => setOtherDeductions(values[0])}
            />
          </div>
        </div>
        
        <div className="rounded-lg bg-muted p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gross Income:</span>
              <span>${income.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Deductions:</span>
              <span className="text-red-500">-${totalDeductions.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Net Income:</span>
              <span className="text-green-600">${netIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full">Generate Detailed Report</Button>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
