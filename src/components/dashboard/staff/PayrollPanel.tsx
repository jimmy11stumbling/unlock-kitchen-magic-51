
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  DollarSign,
  Download,
  FileText,
  Settings,
  Users
} from "lucide-react";
import type { StaffMember, PayrollEntry } from "@/types/staff";
import { format } from "date-fns";

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
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");

  const handleGeneratePayroll = async () => {
    if (!selectedStaffId || !payPeriodStart || !payPeriodEnd) {
      toast({
        title: "Error",
        description: "Please select a staff member and pay period dates",
        variant: "destructive",
      });
      return;
    }

    try {
      await onGeneratePayroll(selectedStaffId, payPeriodStart, payPeriodEnd);
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

  const handleGeneratePayStub = async (payrollEntryId: number) => {
    try {
      const documentUrl = await onGeneratePayStub(payrollEntryId);
      window.open(documentUrl, '_blank');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate pay stub",
        variant: "destructive",
      });
    }
  };

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
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Select Staff Member</label>
                <select
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedStaffId || ""}
                  onChange={(e) => setSelectedStaffId(Number(e.target.value))}
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
            <Button onClick={handleGeneratePayroll}>
              Generate Payroll
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Pay Period</TableHead>
                <TableHead>Gross Pay</TableHead>
                <TableHead>Net Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Add payroll history entries here */}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="settings">
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
                {/* Add more payroll settings fields */}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
