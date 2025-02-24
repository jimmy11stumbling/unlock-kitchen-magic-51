
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FileSpreadsheet, Calculator } from "lucide-react";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";

export const VendorPanel = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("vendors");
  const [searchTerm, setSearchTerm] = useState("");

  // Placeholder data - replace with actual data fetching logic
  const vendors: Vendor[] = [];
  const expenses: Expense[] = [];
  const summary: AccountingSummary = {
    totalExpenses: 0,
    totalPaid: 0,
    totalPending: 0,
    taxDeductibleAmount: 0,
    expensesByCategory: {},
    expensesByVendor: {},
    monthlyTotals: {},
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Vendor Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => toast({ title: "Coming soon!", description: "This feature is under development." })}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Coming soon!", description: "Export functionality is under development." })}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="vendors" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
          </TabsList>

          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Totals
            </Button>
          </div>

          <TabsContent value="vendors">
            <div className="rounded-md border">
              <div className="p-4">
                <p className="text-sm text-muted-foreground">No vendors found. Add your first vendor to get started.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="expenses">
            <div className="rounded-md border">
              <div className="p-4">
                <p className="text-sm text-muted-foreground">No expenses recorded. Add expenses to track your vendor payments.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounting">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Total Expenses</h3>
                <p className="text-2xl">${summary.totalExpenses.toFixed(2)}</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Tax Deductible Amount</h3>
                <p className="text-2xl">${summary.taxDeductibleAmount.toFixed(2)}</p>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Pending Payments</h3>
                <p className="text-2xl">${summary.totalPending.toFixed(2)}</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
