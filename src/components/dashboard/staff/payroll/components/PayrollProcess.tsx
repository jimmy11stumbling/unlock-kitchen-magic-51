import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember, PayrollEntry } from "@/types/staff";

interface PayrollProcessProps {
  staff: StaffMember[];
  selectedStaffId: number | null;
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
}

export const PayrollProcess = ({
  staff,
  selectedStaffId,
  onGeneratePayroll,
}: PayrollProcessProps) => {
  const { toast } = useToast();
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [regularHours, setRegularHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [internalSelectedStaffId, setInternalSelectedStaffId] = useState<number | null>(selectedStaffId);

  const selectedStaff = staff.find(s => s.id === internalSelectedStaffId);

  const calculateGrossPay = () => {
    if (!selectedStaff) return 0;
    const regularPay = regularHours * (selectedStaff.hourlyRate || selectedStaff.salary / 2080);
    const overtimePay = overtimeHours * ((selectedStaff.hourlyRate || selectedStaff.salary / 2080) * 1.5);
    return regularPay + overtimePay;
  };

  const calculateNetPay = (grossPay: number) => {
    const taxRate = 0.2; // Example tax rate
    const deductions = {
      insurance: grossPay * 0.05,
      retirement: grossPay * 0.06
    };
    return grossPay - (grossPay * taxRate) - deductions.insurance - deductions.retirement;
  };

  const handleGeneratePayroll = async () => {
    if (!internalSelectedStaffId || !payPeriodStart || !payPeriodEnd) {
      toast({
        title: "Error",
        description: "Please select a staff member and pay period dates",
        variant: "destructive",
      });
      return;
    }

    const grossPay = calculateGrossPay();
    const netPay = calculateNetPay(grossPay);

    try {
      await onGeneratePayroll(internalSelectedStaffId, payPeriodStart, payPeriodEnd);
      toast({
        title: "Success",
        description: `Payroll generated: Gross Pay $${grossPay.toFixed(2)}, Net Pay $${netPay.toFixed(2)}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate payroll",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Select Staff Member</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={internalSelectedStaffId || ""}
            onChange={(e) => setInternalSelectedStaffId(Number(e.target.value))}
          >
            <option value="">Select staff member...</option>
            {staff.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} - {member.role}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Pay Period Start</label>
          <Input
            type="date"
            value={payPeriodStart}
            onChange={(e) => setPayPeriodStart(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Pay Period End</label>
          <Input
            type="date"
            value={payPeriodEnd}
            onChange={(e) => setPayPeriodEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Regular Hours</label>
          <Input
            type="number"
            value={regularHours}
            onChange={(e) => setRegularHours(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Overtime Hours</label>
          <Input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
          />
        </div>
      </div>

      {selectedStaff && (
        <Card className="p-4 bg-muted">
          <h3 className="text-lg font-semibold mb-4">Pay Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Gross Pay:</span>
              <span>${calculateGrossPay().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Pay:</span>
              <span>${calculateNetPay(calculateGrossPay()).toFixed(2)}</span>
            </div>
          </div>
        </Card>
      )}

      <Button onClick={handleGeneratePayroll} className="w-full">
        <Calculator className="w-4 h-4 mr-2" />
        Generate Payroll
      </Button>
    </div>
  );
};
