
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { PayrollSettings } from "@/types/staff";
import type { StaffMember } from "@/types/staff";

export interface PayrollSettingsProps {
  selectedStaffId: number;
  staff: StaffMember[];
  onUpdateSettings: (staffId: number, settings: PayrollSettings) => Promise<void>;
}

export const PayrollSettings = ({ selectedStaffId, staff, onUpdateSettings }: PayrollSettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PayrollSettings>({
    taxRate: 15,
    overtimeThreshold: 40,
    overtimeMultiplier: 1.5,
    deductionRates: {
      insurance: 5,
      retirement: 4
    },
    paySchedule: "biweekly"
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedStaffId) {
      toast({
        title: "Error",
        description: "No staff member selected",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      await onUpdateSettings(selectedStaffId, {
        ...settings,
        taxRate: Number(settings.taxRate),
        overtimeThreshold: Number(settings.overtimeThreshold)
      });
      
      toast({
        title: "Settings Updated",
        description: "Payroll settings have been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Settings for {selectedStaff?.name || "Selected Employee"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({...settings, taxRate: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overtimeThreshold">Overtime Threshold (Hours)</Label>
            <Input
              id="overtimeThreshold"
              type="number"
              value={settings.overtimeThreshold}
              onChange={(e) => setSettings({...settings, overtimeThreshold: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="overtimeMultiplier">Overtime Multiplier</Label>
            <Input
              id="overtimeMultiplier"
              type="number"
              step="0.1"
              value={settings.overtimeMultiplier}
              onChange={(e) => setSettings({...settings, overtimeMultiplier: Number(e.target.value)})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paySchedule">Pay Schedule</Label>
            <Select 
              value={settings.paySchedule} 
              onValueChange={(value) => setSettings({...settings, paySchedule: value as 'weekly' | 'biweekly' | 'monthly'})}
            >
              <SelectTrigger id="paySchedule">
                <SelectValue placeholder="Select pay schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-3">Deduction Rates</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="insuranceRate">Insurance (%)</Label>
              <Input
                id="insuranceRate"
                type="number"
                value={settings.deductionRates.insurance}
                onChange={(e) => setSettings({
                  ...settings, 
                  deductionRates: {
                    ...settings.deductionRates,
                    insurance: Number(e.target.value)
                  }
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="retirementRate">Retirement (%)</Label>
              <Input
                id="retirementRate"
                type="number"
                value={settings.deductionRates.retirement}
                onChange={(e) => setSettings({
                  ...settings, 
                  deductionRates: {
                    ...settings.deductionRates,
                    retirement: Number(e.target.value)
                  }
                })}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
