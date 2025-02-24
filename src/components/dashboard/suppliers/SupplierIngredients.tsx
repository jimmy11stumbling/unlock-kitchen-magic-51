
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSupplierIngredients } from "@/hooks/dashboard/useSupplierIngredients";
import { SupplierIngredientForm } from "./SupplierIngredientForm";
import type { Supplier } from "@/hooks/dashboard/useSupplierManagement";
import type { SupplierIngredient } from "@/hooks/dashboard/useSupplierIngredients";

interface SupplierIngredientsProps {
  suppliers: Supplier[];
}

export const SupplierIngredients = ({ suppliers }: SupplierIngredientsProps) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<SupplierIngredient>();

  const {
    supplierIngredients,
    isLoading,
    addSupplierIngredient,
    updateSupplierIngredient,
    deleteSupplierIngredient,
  } = useSupplierIngredients(selectedSupplierId);

  const handleAddEdit = (ingredient?: SupplierIngredient) => {
    setSelectedIngredient(ingredient);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (selectedIngredient) {
      updateSupplierIngredient(selectedIngredient.id, data);
    } else {
      addSupplierIngredient(data);
    }
    setIsDialogOpen(false);
    setSelectedIngredient(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this ingredient?")) {
      deleteSupplierIngredient(id);
    }
  };

  const activeSuppliers = suppliers.filter(s => s.status === 'active');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={selectedSupplierId}
          onValueChange={setSelectedSupplierId}
        >
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a supplier" />
          </SelectTrigger>
          <SelectContent>
            {activeSuppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedSupplierId && (
          <Button onClick={() => handleAddEdit()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Ingredient
          </Button>
        )}
      </div>

      {selectedSupplierId ? (
        isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading ingredients...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Min. Order Qty</TableHead>
                <TableHead>Lead Time (days)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplierIngredients.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.ingredients?.name}</TableCell>
                  <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell>{item.minimum_order_quantity}</TableCell>
                  <TableCell>{item.lead_time_days}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {supplierIngredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No ingredients found for this supplier
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )
      ) : (
        <div className="flex justify-center py-8">
          <p className="text-muted-foreground">
            Select a supplier to view their ingredients
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedIngredient ? "Edit" : "Add"} Supplier Ingredient
            </DialogTitle>
          </DialogHeader>
          {selectedSupplierId && (
            <SupplierIngredientForm
              supplierId={selectedSupplierId}
              supplierIngredient={selectedIngredient}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
