
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { StaffMember, PayrollEntry } from "@/types/staff";

interface PayrollPanelProps {
  staff: StaffMember[];
  onGeneratePayroll: (staffId: number, startDate: string, endDate: string) => Promise<void>;
  onGeneratePayStub: (payrollEntryId: number) => Promise<string>;
  onUpdatePayrollSettings: (staffId: number, settings: any) => Promise<void>;
}

export const PayrollPanel = ({
  staff,
  onGeneratePayroll,
  onGeneratePayStub,
  onUpdatePayrollSettings,
}: PayrollPanelProps) => {
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");

  // Get payroll history from the staff member if available
  const getStaffPayrollHistory = (staffId: number): PayrollEntry[] => {
    const staffMember = staff.find(s => s.id === staffId);
    return staffMember?.payrollEntries || [];
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Payroll Management</h2>
        <Button 
          onClick={() => selectedStaffId && onGeneratePayroll(selectedStaffId, payPeriodStart, payPeriodEnd)}
          disabled={!selectedStaffId || !payPeriodStart || !payPeriodEnd}
        >
          Generate Payroll
        </Button>
      </div>

      <Tabs defaultValue="payroll">
        <TabsList>
          <TabsTrigger value="payroll">Process Payroll</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Staff Member</label>
              <select 
                className="w-full mt-1 p-2 border rounded"
                value={selectedStaffId || ""}
                onChange={(e) => setSelectedStaffId(Number(e.target.value))}
              >
                <option value="">Select staff member</option>
                {staff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Recent Payroll History</h3>
              <div className="divide-y">
                {selectedStaffId && getStaffPayrollHistory(selectedStaffId).map((entry: PayrollEntry) => (
                  <div key={entry.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Pay Period: {entry.payPeriodStart} - {entry.payPeriodEnd}</p>
                      <p className="text-sm text-muted-foreground">Gross Pay: ${entry.grossPay}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onGeneratePayStub(entry.id)}
                    >
                      View Pay Stub
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Payroll Settings</h3>
              {selectedStaffId && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Payment Method</label>
                    <select
                      className="w-full mt-1 p-2 border rounded"
                      value={staff.find(s => s.id === selectedStaffId)?.payrollSettings?.paymentMethod || "direct_deposit"}
                      onChange={(e) => onUpdatePayrollSettings(selectedStaffId, {
                        paymentMethod: e.target.value
                      })}
                    >
                      <option value="direct_deposit">Direct Deposit</option>
                      <option value="check">Check</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tax Withholding</label>
                    <div className="grid grid-cols-3 gap-4 mt-1">
                      <Input
                        type="number"
                        placeholder="Federal %"
                        value={staff.find(s => s.id === selectedStaffId)?.payrollSettings?.taxWithholding?.federal || 0}
                        onChange={(e) => onUpdatePayrollSettings(selectedStaffId, {
                          taxWithholding: {
                            federal: Number(e.target.value)
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="State %"
                        value={staff.find(s => s.id === selectedStaffId)?.payrollSettings?.taxWithholding?.state || 0}
                        onChange={(e) => onUpdatePayrollSettings(selectedStaffId, {
                          taxWithholding: {
                            state: Number(e.target.value)
                          }
                        })}
                      />
                      <Input
                        type="number"
                        placeholder="Local %"
                        value={staff.find(s => s.id === selectedStaffId)?.payrollSettings?.taxWithholding?.local || 0}
                        onChange={(e) => onUpdatePayrollSettings(selectedStaffId, {
                          taxWithholding: {
                            local: Number(e.target.value)
                          }
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
