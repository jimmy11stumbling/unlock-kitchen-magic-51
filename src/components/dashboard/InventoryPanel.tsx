
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Box, AlertTriangle, CheckCircle2, Plus, Minus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { InventoryItem } from "@/types/staff";

interface InventoryPanelProps {
  inventory: InventoryItem[];
  onUpdateQuantity?: (itemId: number, newQuantity: number) => void;
  onAddItem?: (item: Omit<InventoryItem, "id">) => void;
}

export const InventoryPanel = ({ inventory, onUpdateQuantity, onAddItem }: InventoryPanelProps) => {
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    unit: "",
    minQuantity: 0,
    price: 0,
  });

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Inventory Control</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Box className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Unit</label>
                  <Input
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    placeholder="e.g., kg, pieces"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Min. Quantity</label>
                  <Input
                    type="number"
                    value={newItem.minQuantity}
                    onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  />
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAddItem?.(newItem);
                  setNewItem({ name: "", quantity: 0, unit: "", minQuantity: 0, price: 0 });
                }}
              >
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Min. Quantity</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unit}</TableCell>
              <TableCell>{item.minQuantity}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>
                {item.quantity < item.minQuantity ? (
                  <span className="text-red-500 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Low Stock
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    In Stock
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
