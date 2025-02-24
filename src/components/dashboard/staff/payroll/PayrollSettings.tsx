
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";

interface PayrollSettingsProps {
  selectedStaffId: number | null;
  onUpdatePayrollSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

export const PayrollSettings = ({
  selectedStaffId,
  onUpdatePayrollSettings,
}: PayrollSettingsProps) => {
  const { toast } = useToast();
  const [payPeriod, setPayPeriod] = useState<"weekly" | "biweekly" | "monthly">("biweekly");
  const [paymentMethod, setPaymentMethod] = useState<"direct_deposit" | "check">("direct_deposit");
  const [federalTax, setFederalTax] = useState(22);
  const [stateTax, setStateTax] = useState(8);
  const [localTax, setLocalTax] = useState(2);
  const [insurance, setInsurance] = useState(5);
  const [retirement, setRetirement] = useState(6);

  const handleSaveSettings = async () => {
    if (!selectedStaffId) {
      toast({
        title: "Error",
        description: "Please select a staff member first",
        variant: "destructive",
      });
      return;
    }

    try {
      await onUpdatePayrollSettings(selectedStaffId, {
        payPeriod,
        paymentMethod,
        taxWithholding: {
          federal: federalTax / 100,
          state: stateTax / 100,
          local: localTax / 100,
        },
        benefits: {
          insurance: insurance / 100,
          retirement: retirement / 100,
        },
      });

      toast({
        title: "Success",
        description: "Payroll settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payroll settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Payroll Settings</h3>
        {selectedStaffId ? (
          <>
            <div>
              <label className="text-sm font-medium">Pay Period</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value as "weekly" | "biweekly" | "monthly")}
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Payment Method</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as "direct_deposit" | "check")}
              >
                <option value="direct_deposit">Direct Deposit</option>
                <option value="check">Check</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tax Withholding</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="text-xs text-muted-foreground">Federal (%)</label>
                  <Input 
                    type="number" 
                    value={federalTax}
                    onChange={(e) => setFederalTax(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">State (%)</label>
                  <Input 
                    type="number" 
                    value={stateTax}
                    onChange={(e) => setStateTax(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Local (%)</label>
                  <Input 
                    type="number" 
                    value={localTax}
                    onChange={(e) => setLocalTax(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Benefits</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="text-xs text-muted-foreground">Insurance (%)</label>
                  <Input 
                    type="number" 
                    value={insurance}
                    onChange={(e) => setInsurance(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Retirement (%)</label>
                  <Input 
                    type="number" 
                    value={retirement}
                    onChange={(e) => setRetirement(Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </>
        ) : (
          <Card className="p-4">
            <p className="text-muted-foreground">Please select a staff member to configure payroll settings.</p>
          </Card>
        )}
      </div>
    </div>
  );
};
