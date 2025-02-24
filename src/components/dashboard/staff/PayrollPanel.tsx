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
  Users,
  Calculator
} from "lucide-react";
import { calculateTax } from "@/utils/taxCalculator";
import type { StaffMember, PayrollEntry } from "@/types/staff";
import { format } from "date-fns";

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
    deductions: {
      tax: 437.50,
      insurance: 150,
      retirement: 175,
      other: 50
    },
    netPay: 1375,
    status: "paid",
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
    status: "paid",
    paymentDate: "2024-03-20",
    paymentMethod: "direct_deposit"
  }
];

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
  const [regularHours, setRegularHours] = useState<number>(0);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);

  const selectedStaff = staff.find(s => s.id === selectedStaffId);

  const calculateGrossPay = () => {
    if (!selectedStaff) return 0;
    const regularPay = regularHours * (selectedStaff.hourlyRate || selectedStaff.salary / 2080); // 2080 = 40 hours * 52 weeks
    const overtimePay = overtimeHours * (selectedStaff.overtimeRate || (selectedStaff.hourlyRate || selectedStaff.salary / 2080) * 1.5);
    return regularPay + overtimePay;
  };

  const calculateNetPay = (grossPay: number) => {
    const taxResults = calculateTax(grossPay, 0.2); // 20% tax rate for example
    const standardDeductions = {
      insurance: grossPay * 0.05,
      retirement: grossPay * 0.06,
    };
    return grossPay - taxResults.tax - standardDeductions.insurance - standardDeductions.retirement;
  };

  const handleGeneratePayroll = async () => {
    if (!selectedStaffId || !payPeriodStart || !payPeriodEnd) {
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
      await onGeneratePayroll(selectedStaffId, payPeriodStart, payPeriodEnd);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {MOCK_PAYROLL_HISTORY.map((entry) => {
                const staffMember = staff.find(s => s.id === entry.staffId);
                return (
                  <TableRow key={entry.id}>
                    <TableCell>{staffMember?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      {format(new Date(entry.payPeriodStart), 'MMM d')} - {format(new Date(entry.payPeriodEnd), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>${entry.grossPay.toFixed(2)}</TableCell>
                    <TableCell>${entry.netPay.toFixed(2)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePayStub(entry.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Pay Stub
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};
