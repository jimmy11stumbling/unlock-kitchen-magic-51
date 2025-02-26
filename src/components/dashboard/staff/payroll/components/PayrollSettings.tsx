
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { StaffMember } from "@/types/staff";

interface PayrollSettingsProps {
  staff: StaffMember[];
  selectedStaffId: number | null;
  onUpdateSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

export const PayrollSettings = ({
  staff,
  selectedStaffId,
  onUpdateSettings
}: PayrollSettingsProps) => {
  const selectedStaff = staff.find(s => s.id === selectedStaffId);
  const [paymentMethod, setPaymentMethod] = useState<"direct_deposit" | "check">("direct_deposit");
  const [federalTax, setFederalTax] = useState(20);
  const [stateTax, setStateTax] = useState(5);
  const [localTax, setLocalTax] = useState(2);

  const handleSaveSettings = async () => {
    if (!selectedStaffId) return;

    const settings: StaffMember['payrollSettings'] = {
      paymentMethod,
      taxWithholding: {
        federal: federalTax,
        state: stateTax,
        local: localTax
      },
      benefits: {
        insurance: "Standard",
        retirement: "401k",
        other: []
      }
    };

    await onUpdateSettings(selectedStaffId, settings);
  };

  if (!selectedStaff) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">Please select a staff member to view settings</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Payment Settings</h3>
        <Select value={paymentMethod} onValueChange={(value: "direct_deposit" | "check") => setPaymentMethod(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="direct_deposit">Direct Deposit</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tax Withholding</h3>
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Federal Tax (%)</label>
            <Input
              type="number"
              value={federalTax}
              onChange={(e) => setFederalTax(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">State Tax (%)</label>
            <Input
              type="number"
              value={stateTax}
              onChange={(e) => setStateTax(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Local Tax (%)</label>
            <Input
              type="number"
              value={localTax}
              onChange={(e) => setLocalTax(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Button onClick={handleSaveSettings} className="w-full">
        Save Settings
      </Button>
    </Card>
  );
};
