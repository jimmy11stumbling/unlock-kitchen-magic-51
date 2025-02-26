// src/components/dashboard/staff/payroll/PayrollSettings.tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface PayrollSettingsProps {
  staffId: number;
  onUpdateSettings: (settings: {
    payPeriod?: string;
    paymentMethod?: string;
    taxWithholding?: { federal: string; state: string };
    benefits?: { insurance: string; retirement: string };
  }) => Promise<void>;
}

export const PayrollSettings = ({ staffId, onUpdateSettings }: PayrollSettingsProps) => {
  const [settings, setSettings] = useState({
    benefits: {
      insurance: "Standard Health Plan",
      retirement: "401(k)",
    },
  });

  const handleUpdateSettings = async () => {
    await onUpdateSettings({
      benefits: {
        insurance: settings.benefits?.insurance || "Standard Health Plan",
        retirement: settings.benefits?.retirement || "401(k)",
      },
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">Payroll Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Insurance Plan</label>
          <Input
            type="text"
            placeholder="Insurance Plan"
            value={settings.benefits?.insurance || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                benefits: { ...prev.benefits, insurance: e.target.value },
              }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Retirement Plan</label>
          <Input
            type="text"
            placeholder="Retirement Plan"
            value={settings.benefits?.retirement || ""}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                benefits: { ...prev.benefits, retirement: e.target.value },
              }))
            }
          />
        </div>
        <button onClick={handleUpdateSettings}>Update Settings</button>
      </div>
    </Card>
  );
};
