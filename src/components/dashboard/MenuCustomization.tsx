
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, CircleDot } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/types/staff";

interface MenuCustomizationProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateMenuItemAvailability: (itemId: number, available: boolean) => void;
  onUpdateMenuItemPrice: (itemId: number, price: number) => void;
}

export const MenuCustomization = ({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItemAvailability,
  onUpdateMenuItemPrice,
}: MenuCustomizationProps) => {
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    category: "main",
    description: "",
    available: true,
    allergens: [],
    preparationTime: 15,
  });

  const [editingPrice, setEditingPrice] = useState<{id: number, price: number} | null>(null);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Menu Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newItem.category}
                  onValueChange={(value: MenuItem["category"]) =>
                    setNewItem({ ...newItem, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appetizer">Appetizer</SelectItem>
                    <SelectItem value="main">Main Course</SelectItem>
                    <SelectItem value="dessert">Dessert</SelectItem>
                    <SelectItem value="beverage">Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preparation Time (minutes)</label>
                <Input
                  type="number"
                  value={newItem.preparationTime}
                  onChange={(e) => setNewItem({ ...newItem, preparationTime: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Allergens (comma-separated)</label>
                <Input
                  value={newItem.allergens.join(", ")}
                  onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value.split(", ").filter(Boolean) })}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onAddMenuItem(newItem);
                  setNewItem({
                    name: "",
                    price: 0,
                    category: "main",
                    description: "",
                    available: true,
                    allergens: [],
                    preparationTime: 15,
                  });
                }}
              >
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {["appetizer", "main", "dessert", "beverage"].map((category) => (
          <Card key={category} className="p-4">
            <h3 className="text-sm font-medium capitalize mb-2">{category}</h3>
            <p className="text-2xl font-bold">
              {menuItems.filter((item) => item.category === category).length}
            </p>
          </Card>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Preparation Time</TableHead>
            <TableHead>Allergens</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menuItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell className="capitalize">{item.category}</TableCell>
              <TableCell>
                {editingPrice?.id === item.id ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={editingPrice.price}
                      onChange={(e) => setEditingPrice({ ...editingPrice, price: Number(e.target.value) })}
                      className="w-20"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdateMenuItemPrice(item.id, editingPrice.price);
                        setEditingPrice(null);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    ${item.price.toFixed(2)}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingPrice({ id: item.id, price: item.price })}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
              <TableCell>{item.preparationTime} mins</TableCell>
              <TableCell>{item.allergens.join(", ")}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant={item.available ? "default" : "secondary"}
                  onClick={() => onUpdateMenuItemAvailability(item.id, !item.available)}
                >
                  <CircleDot className="w-4 h-4 mr-2" />
                  {item.available ? "Available" : "Unavailable"}
                </Button>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Menu Item</DialogTitle>
                    </DialogHeader>
                    {/* Add edit form here */}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
