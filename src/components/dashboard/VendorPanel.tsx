
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FileSpreadsheet, Calculator } from "lucide-react";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";
import { VendorList } from "./vendors/VendorList";
import { ExpenseTable } from "./vendors/ExpenseTable";
import { AccountingSummary as AccountingSummaryComponent } from "./vendors/AccountingSummary";

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
            <VendorList vendors={vendors} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTable expenses={expenses} searchTerm={searchTerm} />
          </TabsContent>

          <TabsContent value="accounting">
            <AccountingSummaryComponent summary={summary} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
