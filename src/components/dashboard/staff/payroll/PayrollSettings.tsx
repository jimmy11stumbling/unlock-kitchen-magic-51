
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { StaffMember } from "@/types/staff";

interface PayrollSettingsProps {
  selectedStaffId: number | null;
  onUpdatePayrollSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

export const PayrollSettings = ({
  selectedStaffId,
  onUpdatePayrollSettings
}: PayrollSettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Payroll Settings</h3>
      {selectedStaffId && (
        <div className="grid gap-4">
          <div>
            <label className="text-sm font-medium">Pay Period</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <select className="w-full mt-1 p-2 border rounded-md">
              <option value="direct_deposit">Direct Deposit</option>
              <option value="check">Check</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Tax Withholding</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input type="number" placeholder="Federal %" />
              <Input type="number" placeholder="State %" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Benefits</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input type="number" placeholder="Insurance %" />
              <Input type="number" placeholder="Retirement %" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
