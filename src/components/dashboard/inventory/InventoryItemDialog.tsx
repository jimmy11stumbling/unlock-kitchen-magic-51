
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface InventoryItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem;
  onSave: (item: Omit<InventoryItem, "id">) => void;
  suppliers: { id: string; name: string }[];
}

export function InventoryItemDialog({
  open,
  onOpenChange,
  item,
  onSave,
  suppliers
}: InventoryItemDialogProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>(
    item || {
      name: "",
      quantity: 0,
      unit: "pcs",
      minQuantity: 0,
      price: 0,
      category: "produce",
      reorderPoint: 5,
      idealStockLevel: 20,
      description: "",
      supplierId: "",
      sku: "",
      location: ""
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<InventoryItem, "id">);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {["produce", "meat", "dairy", "dry goods", "beverages"].map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Current Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Minimum Quantity</Label>
              <Input
                id="minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idealStock">Ideal Stock Level</Label>
              <Input
                id="idealStock"
                type="number"
                value={formData.idealStockLevel}
                onChange={(e) => setFormData({ ...formData, idealStockLevel: Number(e.target.value) })}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="submit">{item ? "Save Changes" : "Add Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
