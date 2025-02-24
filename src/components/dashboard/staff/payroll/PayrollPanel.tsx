
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember, PayrollEntry } from "@/types/staff";
import { PayrollTabs } from "./components/PayrollTabs";
import { PayrollTabContent } from "./components/PayrollTabContent";

const MOCK_PAYROLL_HISTORY: PayrollEntry[] = [
  {
    id: 1,
    staffId: 1,
    payPeriodStart: "2024-03-01",
    payPeriodEnd: "2024-03-15",
    regularHours: 80,
    overtimeHours: 5,
    regularRate: 25,
    overtimeRate: 37.5,
    grossPay: 2187.50,
    deductions: {
      tax: 437.50,
      insurance: 150,
      retirement: 175,
      other: 50
    },
    netPay: 1375,
    status: "paid" as const,
    paymentDate: "2024-03-20",
    paymentMethod: "direct_deposit"
  },
  {
    id: 2,
    staffId: 2,
    payPeriodStart: "2024-03-01",
    payPeriodEnd: "2024-03-15",
    regularHours: 75,
    overtimeHours: 0,
    regularRate: 22,
    overtimeRate: 33,
    grossPay: 1650,
    deductions: {
      tax: 330,
      insurance: 125,
      retirement: 132,
      other: 0
    },
    netPay: 1063,
    status: "paid" as const,
    paymentDate: "2024-03-20",
    paymentMethod: "direct_deposit"
  }
];

interface PayrollPanelProps {
  staff: StaffMember[];
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
  onGeneratePayStub: (payrollEntryId: number) => Promise<string>;
  onUpdatePayrollSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

export const PayrollPanel = ({
  staff,
  onGeneratePayroll,
  onGeneratePayStub,
  onUpdatePayrollSettings
}: PayrollPanelProps) => {
  const { toast } = useToast();
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  const handleGeneratePayroll = async (staffId: number, startDate: string, endDate: string) => {
    try {
      await onGeneratePayroll(staffId, startDate, endDate);
      toast({
        title: "Success",
        description: "Payroll generated successfully",
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
    <Card className="p-6">
      <Tabs defaultValue="process" className="space-y-4">
        <PayrollTabs />
        <PayrollTabContent
          staff={staff}
          selectedStaffId={selectedStaffId}
          payrollHistory={MOCK_PAYROLL_HISTORY}
          onGeneratePayroll={handleGeneratePayroll}
          onGeneratePayStub={onGeneratePayStub}
          onUpdatePayrollSettings={onUpdatePayrollSettings}
        />
      </Tabs>
    </Card>
  );
};
