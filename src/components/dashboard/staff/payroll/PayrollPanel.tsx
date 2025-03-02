
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { PayrollEntry, StaffMember } from "@/types/staff";
import { PayrollTable } from "./components/PayrollTable";
import { PayrollChart } from "./components/PayrollChart";
import { PayrollSettings } from "./components/PayrollSettings";
import { TaxCalculator } from "./components/TaxCalculator";
import { ReportsGenerator } from "./components/ReportsGenerator";
import { PayrollTabContent } from "./components/PayrollTabContent";

export const PayrollPanel = ({ staff }: { staff: StaffMember[] }) => {
  const { toast } = useToast();
  const [payrollEntries] = useState<PayrollEntry[]>([
    {
      id: 1,
      staffId: 1,
      payPeriodStart: "2023-03-01",
      payPeriodEnd: "2023-03-15",
      regularHours: 72,
      overtimeHours: 8,
      regularRate: 25,
      overtimeRate: 37.5,
      grossPay: 2100,
      totalPay: 2100,
      deductions: {
        tax: 420,
        insurance: 105,
        retirement: 84
      },
      netPay: 1491,
      status: "pending",
      paymentDate: "2023-03-20",
      paymentMethod: "direct_deposit"
    },
    {
      id: 2,
      staffId: 2,
      payPeriodStart: "2023-03-01",
      payPeriodEnd: "2023-03-15",
      regularHours: 80,
      overtimeHours: 0,
      regularRate: 22,
      overtimeRate: 33,
      grossPay: 1760,
      totalPay: 1760,
      deductions: {
        tax: 352,
        insurance: 88,
        retirement: 70.4
      },
      netPay: 1249.6,
      status: "pending",
      paymentDate: "2023-03-20",
      paymentMethod: "direct_deposit"
    }
  ]);

  const [selectedStaffId, setSelectedStaffId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState("entries");

  const handleGeneratePayroll = () => {
    toast({
      title: "Payroll Generated",
      description: "Payroll has been successfully generated for the selected period.",
    });
  };

  const handleUpdateSettings = async (staffId: number, settings: any) => {
    // Mock API call to update settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Updated settings for staff", staffId, settings);
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Payroll Management</h2>
        <Button onClick={handleGeneratePayroll}>Generate Payroll</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Staff</CardTitle>
            <CardDescription>Select a staff member</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {staff.map((member) => (
                <Button
                  key={member.id}
                  variant={selectedStaffId === member.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedStaffId(member.id)}
                >
                  {member.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="entries">Entries</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <PayrollTabContent activeTab={activeTab} staffId={selectedStaffId} payrollEntries={payrollEntries} />
            
            <TabsContent value="settings">
              <PayrollSettings 
                selectedStaffId={selectedStaffId} 
                staff={staff}
                onUpdateSettings={handleUpdateSettings} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
