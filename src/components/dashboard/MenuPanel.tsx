
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { MenuItem } from "@/types/staff";
import { useState } from "react";

interface MenuPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
}

export const MenuPanel = ({
  menuItems,
  onAddMenuItem,
  onUpdateAvailability,
  onUpdatePrice,
}: MenuPanelProps) => {
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    price: 0,
    category: "main",
    description: "",
    available: true,
    allergens: [],
    preparationTime: 15,
  });

  const [selectedCategory, setSelectedCategory] = useState<MenuItem["category"] | "all">("all");

  const filteredItems = selectedCategory === "all" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Menu Management</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Menu Item</Button>
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
                    placeholder="Item name"
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
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                    placeholder="Price"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Description"
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
                    onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value.split(",").map(a => a.trim()) })}
                    placeholder="e.g., nuts, dairy, gluten"
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

        <div className="mb-4">
          <Select
            value={selectedCategory}
            onValueChange={(value: MenuItem["category"] | "all") => setSelectedCategory(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="appetizer">Appetizers</SelectItem>
              <SelectItem value="main">Main Courses</SelectItem>
              <SelectItem value="dessert">Desserts</SelectItem>
              <SelectItem value="beverage">Beverages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Prep Time</TableHead>
              <TableHead>Allergens</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="capitalize">{item.category}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => onUpdatePrice(item.id, Number(e.target.value))}
                    className="w-24"
                  />
                </TableCell>
                <TableCell>{item.preparationTime} min</TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {item.allergens.join(", ")}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={item.available}
                    onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
