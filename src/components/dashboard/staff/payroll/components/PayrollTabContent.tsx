
import { TabsContent } from "@/components/ui/tabs";
import { PayrollProcessForm } from "../PayrollProcessForm";
import { PayrollHistory } from "../PayrollHistory";
import { PayrollSettings } from "../PayrollSettings";
import type { StaffMember } from "@/types/staff";
import type { PayrollEntry } from "@/types/staff";

interface PayrollTabContentProps {
  staff: StaffMember[];
  selectedStaffId: number | null;
  payrollHistory: PayrollEntry[];
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
  onGeneratePayStub: (payrollEntryId: number) => Promise<string>;
  onUpdatePayrollSettings: (staffId: number, settings: StaffMember['payrollSettings']) => Promise<void>;
}

export const PayrollTabContent = ({
  staff,
  selectedStaffId,
  payrollHistory,
  onGeneratePayroll,
  onGeneratePayStub,
  onUpdatePayrollSettings,
}: PayrollTabContentProps) => {
  return (
    <>
      <TabsContent value="process">
        <PayrollProcessForm
          staff={staff}
          selectedStaffId={selectedStaffId}
          onGeneratePayroll={onGeneratePayroll}
        />
      </TabsContent>

      <TabsContent value="history">
        <PayrollHistory
          staff={staff}
          payrollHistory={payrollHistory}
          onGeneratePayStub={onGeneratePayStub}
        />
      </TabsContent>

      <TabsContent value="settings">
        <PayrollSettings
          selectedStaffId={selectedStaffId}
          onUpdatePayrollSettings={onUpdatePayrollSettings}
        />
      </TabsContent>
    </>
  );
};
