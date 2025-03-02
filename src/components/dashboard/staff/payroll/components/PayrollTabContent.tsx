
import { TabsContent } from "@/components/ui/tabs";
import { PayrollProcess } from "./PayrollProcess";
import { PayrollHistory } from "./PayrollHistory";
import { PayrollSettings } from "./PayrollSettings";
import type { StaffMember, PayrollEntry, PayrollSettings as PayrollSettingsType } from "@/types/staff";

interface PayrollTabContentProps {
  staff: StaffMember[];
  selectedStaffId: number | null;
  payrollHistory: PayrollEntry[];
  activeTab?: string;
  staffId?: number;
  payrollEntries?: PayrollEntry[];
  onGeneratePayroll?: (staffId: number, startDate: string, endDate: string) => Promise<void>;
  onGeneratePayStub?: (payrollEntryId: number) => Promise<string>;
  onUpdatePayrollSettings?: (staffId: number, settings: PayrollSettingsType) => Promise<void>;
}

export const PayrollTabContent = ({
  staff,
  selectedStaffId,
  payrollHistory,
  activeTab,
  staffId,
  payrollEntries,
  onGeneratePayroll,
  onGeneratePayStub,
  onUpdatePayrollSettings,
}: PayrollTabContentProps) => {
  // Use the appropriate IDs based on what was passed
  const effectiveStaffId = staffId || selectedStaffId;
  const effectivePayrollHistory = payrollEntries || payrollHistory;
  
  return (
    <>
      <TabsContent value="process">
        {onGeneratePayroll && (
          <PayrollProcess
            staff={staff}
            selectedStaffId={effectiveStaffId}
            onGeneratePayroll={onGeneratePayroll}
          />
        )}
      </TabsContent>

      <TabsContent value="history">
        {onGeneratePayStub && (
          <PayrollHistory
            staff={staff}
            payrollHistory={effectivePayrollHistory}
            onGeneratePayStub={onGeneratePayStub}
          />
        )}
      </TabsContent>

      <TabsContent value="settings">
        {onUpdatePayrollSettings && (
          <PayrollSettings
            selectedStaffId={effectiveStaffId || 0}
            staff={staff}
            onUpdateSettings={onUpdatePayrollSettings}
          />
        )}
      </TabsContent>
      
      {/* Handle entries tab */}
      <TabsContent value="entries">
        {effectivePayrollHistory && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payroll Entries</h3>
            <div className="border rounded-md p-4">
              {effectivePayrollHistory.length > 0 ? (
                <ul className="space-y-2">
                  {effectivePayrollHistory.map(entry => (
                    <li key={entry.id} className="p-2 border-b last:border-b-0">
                      <div className="flex justify-between">
                        <span>Period: {entry.payPeriodStart} to {entry.payPeriodEnd}</span>
                        <span className="font-medium">${entry.netPay.toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Status: {entry.status}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground py-4">No payroll entries found</p>
              )}
            </div>
          </div>
        )}
      </TabsContent>
    </>
  );
};
