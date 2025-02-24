
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VendorForm } from "./forms/VendorForm";
import { ExpenseForm } from "./forms/ExpenseForm";
import { Edit, Plus, Receipt } from "lucide-react";
import type { Vendor } from "@/types/vendor";

interface VendorListProps {
  vendors: Vendor[];
  searchTerm: string;
  onUpdate: () => void;
}

export const VendorList = ({ vendors, searchTerm, onUpdate }: VendorListProps) => {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="rounded-md border">
        {filteredVendors.length === 0 ? (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              {searchTerm ? "No vendors match your search." : "No vendors found. Add your first vendor to get started."}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{vendor.name}</h3>
                    <p className="text-sm text-muted-foreground">{vendor.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowExpenseForm(true);
                      }}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Add Expense
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedVendor(vendor);
                        setShowVendorForm(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showVendorForm} onOpenChange={setShowVendorForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVendor ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
          </DialogHeader>
          <VendorForm
            vendor={selectedVendor || undefined}
            onClose={() => {
              setShowVendorForm(false);
              setSelectedVendor(null);
            }}
            onSuccess={onUpdate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showExpenseForm} onOpenChange={setShowExpenseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense for {selectedVendor?.name}</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <ExpenseForm
              initialVendorId={selectedVendor.id}
              onClose={() => {
                setShowExpenseForm(false);
                setSelectedVendor(null);
              }}
              onSuccess={onUpdate}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
