
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { InventoryItem } from "@/hooks/dashboard/useInventoryData";

interface AddInventoryItemDialogProps {
  onAddItem: (item: Omit<InventoryItem, "id">) => void;
}

export function AddInventoryItemDialog({ onAddItem }: AddInventoryItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    unit: "pcs",
    minQuantity: 0,
    price: 0,
    category: "produce",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddItem(newItem);
    setOpen(false);
    setNewItem({
      name: "",
      quantity: 0,
      unit: "pcs",
      minQuantity: 0,
      price: 0,
      category: "produce",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="whitespace-nowrap">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add Item</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Add New Inventory Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              required
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
              className="h-12 sm:h-10 text-base sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                required
                type="number"
                min="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Select
                value={newItem.unit}
                onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
              >
                <SelectTrigger className="h-12 sm:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pcs">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms</SelectItem>
                  <SelectItem value="g">Grams</SelectItem>
                  <SelectItem value="l">Liters</SelectItem>
                  <SelectItem value="ml">Milliliters</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Quantity</label>
              <Input
                required
                type="number"
                min="0"
                value={newItem.minQuantity}
                onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input
                required
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={newItem.category}
              onValueChange={(value) => setNewItem({ ...newItem, category: value })}
            >
              <SelectTrigger className="h-12 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="produce">Produce</SelectItem>
                <SelectItem value="meat">Meat</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
                <SelectItem value="dry goods">Dry Goods</SelectItem>
                <SelectItem value="beverages">Beverages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full h-12 sm:h-10 text-base sm:text-sm">
            Add Item
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
