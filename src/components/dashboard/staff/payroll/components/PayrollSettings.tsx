import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PayrollSettings } from "@/types/staff";

interface PayrollSettingsProps {
  settings: PayrollSettings;
  onSave: (settings: PayrollSettings) => void;
}

export function PayrollSettings({ settings, onSave }: PayrollSettingsProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleInputChange = (key: string, value: string) => {
    const updates = { ...localSettings };
    
    if (key === 'federal' || key === 'state' || key === 'local') {
      updates.taxWithholding[key] = Number(value);
    } else if (key === 'insurance' || key === 'retirement') {
      updates.benefits[key] = Number(value);
    } else {
      (updates as any)[key] = value;
    }
    
    setLocalSettings(updates);
    onSave(updates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="payPeriod">Pay Period</Label>
          <Input
            id="payPeriod"
            value={localSettings.payPeriod}
            onChange={(e) => handleInputChange("payPeriod", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Input
            id="paymentMethod"
            value={localSettings.paymentMethod}
            onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
          />
        </div>
        <div>
          <Label>Tax Withholding</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="federal">Federal</Label>
              <Input
                id="federal"
                value={String(localSettings.taxWithholding.federal)}
                onChange={(e) => handleInputChange("federal", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={String(localSettings.taxWithholding.state)}
                onChange={(e) => handleInputChange("state", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={String(localSettings.taxWithholding.local)}
                onChange={(e) => handleInputChange("local", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div>
          <Label>Benefits</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="insurance">Insurance</Label>
              <Input
                id="insurance"
                value={String(localSettings.benefits.insurance)}
                onChange={(e) => handleInputChange("insurance", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="retirement">Retirement</Label>
              <Input
                id="retirement"
                value={String(localSettings.benefits.retirement)}
                onChange={(e) => handleInputChange("retirement", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
