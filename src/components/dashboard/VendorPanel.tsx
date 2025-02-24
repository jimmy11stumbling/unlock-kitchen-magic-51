
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Plus, FileSpreadsheet, Calculator } from "lucide-react";
import { vendorService } from "./vendors/services/vendorService";
import { VendorList } from "./vendors/VendorList";
import { ExpenseTable } from "./vendors/ExpenseTable";
import { AccountingSummary } from "./vendors/AccountingSummary";
import { VendorForm } from "./vendors/forms/VendorForm";
import { exportReport } from "@/utils/exportUtils";

export const VendorPanel = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddVendor, setShowAddVendor] = useState(false);

  const { data: vendors, refetch: refetchVendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: vendorService.getVendors
  });

  const { data: expenses, refetch: refetchExpenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: vendorService.getExpenses
  });

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ["accounting-summary"],
    queryFn: vendorService.getAccountingSummary
  });

  const handleRefreshData = () => {
    refetchVendors();
    refetchExpenses();
    refetchSummary();
  };

  const handleExport = async () => {
    try {
      await exportReport(expenses || [], 'vendor-expenses', 'csv');
      toast({ title: "Export completed successfully" });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting the data",
        variant: "destructive"
      });
    }
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
            <Button variant="outline" onClick={() => refetchSummary()}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Totals
            </Button>
          </div>

          <TabsContent value="vendors">
            <VendorList
              vendors={vendors || []}
              searchTerm={searchTerm}
              onUpdate={handleRefreshData}
            />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTable
              expenses={expenses || []}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="accounting">
            <AccountingSummary
              summary={summary || {
                totalExpenses: 0,
                totalPaid: 0,
                totalPending: 0,
                taxDeductibleAmount: 0,
                expensesByCategory: {},
                expensesByVendor: {},
                monthlyTotals: {}
              }}
            />
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
            onSubmit={handleRefreshData}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
