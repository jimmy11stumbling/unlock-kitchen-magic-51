
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FileSpreadsheet, Calculator, BarChart } from "lucide-react";
import { vendorService } from "./vendors/services/vendorService";
import { VendorList } from "./vendors/VendorList";
import { ExpenseTable } from "./vendors/ExpenseTable";
import { AccountingSummaryView } from "./vendors/AccountingSummary";
import { BudgetAnalysis } from "./vendors/BudgetAnalysis";
import { VendorForm } from "./vendors/forms/VendorForm";
import { exportData } from "@/utils/exportUtils";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";

export const VendorPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [activeTab, setActiveTab] = useState("vendors");

  const { data: vendors, refetch: refetchVendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => vendorService.getVendors()
  });

  const { data: expenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => vendorService.getExpenses()
  });

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ["accounting-summary"],
    queryFn: () => vendorService.getAccountingSummary()
  });

  const handleRefreshData = () => {
    refetchVendors();
    refetchExpenses();
    refetchSummary();
  };

  const handleExport = async () => {
    try {
      if (expenses) {
        exportData(expenses, 'vendor-expenses', 'csv');
        toast({ title: "Export completed successfully" });
      }
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
  };

  // Adapt data to match the expected types
  const adaptedVendors: Vendor[] = vendors ? vendors.map((vendor: any) => ({
    id: vendor.id,
    name: vendor.name,
    email: vendor.email || '',
    phone: vendor.phone || '',
    address: vendor.address || '',
    taxId: vendor.taxId || '',
    status: vendor.status || 'active',
    paymentTerms: vendor.paymentTerms || 'net_30',
    notes: vendor.notes || '',
    createdAt: vendor.createdAt || new Date().toISOString(),
    updatedAt: vendor.updatedAt || new Date().toISOString()
  })) : [];

  const adaptedExpenses: Expense[] = expenses ? expenses.map((expense: any) => ({
    id: expense.id,
    vendorId: expense.vendorId,
    vendorName: expense.vendorName,
    amount: expense.amount,
    date: expense.date,
    category: expense.category,
    description: expense.description,
    paymentMethod: expense.paymentMethod,
    receiptUrl: expense.receiptUrl,
    taxDeductible: expense.taxDeductible || false,
    status: expense.paymentStatus || 'pending',
    createdAt: expense.createdAt || new Date().toISOString(),
    updatedAt: expense.updatedAt || new Date().toISOString()
  })) : [];

  const adaptedSummary: AccountingSummary = summary ? {
    totalExpenses: summary.totalExpenses,
    totalPaid: summary.totalPaid,
    totalPending: summary.totalPending,
    taxDeductibleAmount: summary.taxDeductibleAmount,
    expensesByCategory: summary.expensesByCategory || {},
    expensesByVendor: summary.expensesByVendor || {},
    monthlyTotals: summary.monthlyTotals || {}
  } : {
    totalExpenses: 0,
    totalPaid: 0,
    totalPending: 0,
    taxDeductibleAmount: 0,
    expensesByCategory: {},
    expensesByVendor: {},
    monthlyTotals: {}
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Vendor Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddVendor(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="accounting">Accounting</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {activeTab === "accounting" && (
              <Button variant="outline" onClick={() => refetchSummary()}>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Totals
              </Button>
            )}
            {activeTab === "budget" && (
              <Button variant="outline" onClick={() => refetchExpenses()}>
                <BarChart className="w-4 h-4 mr-2" />
                Refresh Analysis
              </Button>
            )}
          </div>

          <TabsContent value="vendors">
            <VendorList
              vendors={adaptedVendors}
              searchTerm={searchTerm}
              onUpdate={handleRefreshData}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTable
              expenses={adaptedExpenses}
              searchTerm={searchTerm}
              onUpdate={handleRefreshData}
            />
          </TabsContent>

          <TabsContent value="accounting">
            <AccountingSummaryView
              summary={adaptedSummary}
            />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetAnalysis />
          </TabsContent>
        </Tabs>
      </Card>

      <Dialog open={showAddVendor} onOpenChange={setShowAddVendor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm
            onClose={() => setShowAddVendor(false)}
            onSuccess={handleRefreshData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
