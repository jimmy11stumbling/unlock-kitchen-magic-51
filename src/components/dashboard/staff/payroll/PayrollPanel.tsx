
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, FileText, Settings } from "lucide-react";
import type { StaffMember, PayrollEntry } from "@/types/staff";
import { PayrollProcess } from "./components/PayrollProcess";
import { PayrollHistory } from "./components/PayrollHistory";
import { PayrollSettings } from "./components/PayrollSettings";

interface PayrollPanelProps {
  staff: StaffMember[];
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
  onGeneratePayStub: (payrollEntryId: number) => Promise<string>;
  onUpdatePayrollSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

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
    totalPay: 2187.50,
    deductions: {
      tax: 437.50,
      insurance: 150,
      retirement: 175,
      other: 50
    },
    netPay: 1375,
    status: "pending"
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
    totalPay: 1650,
    deductions: {
      tax: 330,
      insurance: 125,
      retirement: 132,
      other: 0
    },
    netPay: 1063,
    status: "pending"
  }
];

export const PayrollPanel = ({
  staff,
  onGeneratePayroll,
  onGeneratePayStub,
  onUpdatePayrollSettings
}: PayrollPanelProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);

  return (
    <Card className="p-6">
      <Tabs defaultValue="process" className="space-y-4">
        <TabsList>
          <TabsTrigger value="process" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Process Payroll
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Payroll History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="process">
          <PayrollProcess
            staff={staff}
            selectedStaffId={selectedStaffId}
            onGeneratePayroll={onGeneratePayroll}
          />
        </TabsContent>

        <TabsContent value="history">
          <PayrollHistory
            staff={staff}
            payrollHistory={MOCK_PAYROLL_HISTORY}
            onGeneratePayStub={onGeneratePayStub}
          />
        </TabsContent>

        <TabsContent value="settings">
          <PayrollSettings
            staff={staff}
            onUpdateSettings={onUpdatePayrollSettings}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
