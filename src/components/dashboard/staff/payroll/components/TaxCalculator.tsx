
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState<string>('');
  const [federalRate, setFederalRate] = useState<string>('22');
  const [stateRate, setStateRate] = useState<string>('5');
  const [results, setResults] = useState<null | {
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    totalTaxes: number;
    netIncome: number;
  }>(null);

  const calculateTaxes = () => {
    const grossIncome = parseFloat(income);
    if (isNaN(grossIncome)) return;

    const fedRate = parseFloat(federalRate) / 100;
    const stRate = parseFloat(stateRate) / 100;
    
    const federalTax = grossIncome * fedRate;
    const stateTax = grossIncome * stRate;
    const socialSecurity = grossIncome * 0.062; // 6.2%
    const medicare = grossIncome * 0.0145; // 1.45%
    
    const totalTaxes = federalTax + stateTax + socialSecurity + medicare;
    const netIncome = grossIncome - totalTaxes;
    
    setResults({
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTaxes,
      netIncome
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Tax Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="income">Gross Income</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter gross income"
              />
            </div>
            <div>
              <Label htmlFor="federal-rate">Federal Tax Rate (%)</Label>
              <Input
                id="federal-rate"
                type="number"
                value={federalRate}
                onChange={(e) => setFederalRate(e.target.value)}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="state-rate">State Tax Rate (%)</Label>
              <Input
                id="state-rate"
                type="number"
                value={stateRate}
                onChange={(e) => setStateRate(e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <Button onClick={calculateTaxes} className="w-full">Calculate Taxes</Button>
          
          {results && (
            <div className="mt-4 border rounded-md p-4 space-y-2">
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Federal Tax:</span>
                <span className="font-medium">${results.federalTax.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">State Tax:</span>
                <span className="font-medium">${results.stateTax.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Social Security:</span>
                <span className="font-medium">${results.socialSecurity.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-600">Medicare:</span>
                <span className="font-medium">${results.medicare.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 border-t pt-2 font-semibold">
                <span>Total Taxes:</span>
                <span>${results.totalTaxes.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 border-t pt-2 font-semibold">
                <span>Net Income:</span>
                <span>${results.netIncome.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxCalculator;
