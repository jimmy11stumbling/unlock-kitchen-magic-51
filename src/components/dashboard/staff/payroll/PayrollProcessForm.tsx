
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { calculatePayroll } from "@/hooks/dashboard/staff/services/payrollService";

interface PayrollProcessFormProps {
  staff: StaffMember[];
  selectedStaffId: number | null;
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
}

export const PayrollProcessForm = ({ 
  staff, 
  selectedStaffId, 
  onGeneratePayroll 
}: PayrollProcessFormProps) => {
  const { toast } = useToast();
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [regularHours, setRegularHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const calculatePayrollDetails = () => {
    if (!selectedStaff) return null;

    try {
      return calculatePayroll(selectedStaff, {
        regular: regularHours,
        overtime: overtimeHours
      });
    } catch (error) {
      console.error('Error calculating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to calculate payroll details",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleGeneratePayroll = async () => {
    if (!selectedStaffId || !payPeriodStart || !payPeriodEnd) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      await onGeneratePayroll(selectedStaffId, payPeriodStart, payPeriodEnd);
      toast({
        title: "Success",
        description: "Payroll has been generated successfully",
      });
    } catch (error) {
      console.error('Error generating payroll:', error);
      toast({
        title: "Error",
        description: "Failed to generate payroll",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const payrollDetails = calculatePayrollDetails();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">Select Staff Member</label>
          <select
            className="w-full mt-1 p-2 border rounded-md"
            value={selectedStaffId || ""}
            onChange={(e) => setPayPeriodStart(e.target.value)}
            disabled={isProcessing}
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
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Pay Period End</label>
          <Input
            type="date"
            value={payPeriodEnd}
            onChange={(e) => setPayPeriodEnd(e.target.value)}
            disabled={isProcessing}
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
            min="0"
            max="168"
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Overtime Hours</label>
          <Input
            type="number"
            value={overtimeHours}
            onChange={(e) => setOvertimeHours(Number(e.target.value))}
            min="0"
            max="168"
            disabled={isProcessing}
          />
        </div>
      </div>

      {regularHours + overtimeHours > 168 && (
        <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-2 rounded">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Total hours exceed maximum weekly hours (168)</span>
        </div>
      )}

      {payrollDetails && (
        <Card className="p-4 bg-muted">
          <h3 className="text-lg font-semibold mb-4">Pay Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Regular Pay:</span>
              <span>${(payrollDetails.grossPay - (payrollDetails.hours.overtime * (selectedStaff?.overtimeRate || 0))).toFixed(2)}</span>
            </div>
            {payrollDetails.hours.overtime > 0 && (
              <div className="flex justify-between">
                <span>Overtime Pay:</span>
                <span>${(payrollDetails.hours.overtime * (selectedStaff?.overtimeRate || 0)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span>Gross Pay:</span>
              <span>${payrollDetails.grossPay.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2">Deductions</h4>
              {Object.entries(payrollDetails.deductions).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="capitalize">{key}:</span>
                  <span>-${value.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Net Pay:</span>
                <span>${payrollDetails.netPay.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Button 
        onClick={handleGeneratePayroll} 
        className="w-full"
        disabled={isProcessing || !selectedStaffId || !payPeriodStart || !payPeriodEnd}
      >
        {isProcessing ? (
          <>
            <Clock className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Calculator className="w-4 h-4 mr-2" />
            Generate Payroll
          </>
        )}
      </Button>
    </div>
  );
};
