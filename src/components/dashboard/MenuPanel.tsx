
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Image, Plus, Table as TableIcon } from "lucide-react";
import type { MenuItem } from "@/types/staff";
import type { MenuPanelProps, MenuItemFormData } from "./menu/types";
import { MenuItemForm } from "./menu/MenuItemForm";
import { MenuItemGrid } from "./menu/MenuItemGrid";
import { MenuItemTable } from "./menu/MenuItemTable";
import { MenuSearchFilters } from "./menu/MenuSearchFilters";

const defaultMenuItem: MenuItemFormData = {
  name: "",
  price: 0,
  category: "main",
  description: "",
  available: true,
  allergens: [],
  preparationTime: 15,
  image: undefined,
};

export const MenuPanel = ({
  menuItems,
  onAddMenuItem,
  onUpdateAvailability,
  onUpdatePrice,
  onDeleteMenuItem,
  onUpdateMenuItem,
}: MenuPanelProps) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<MenuItem["category"] | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [newItem, setNewItem] = useState<MenuItemFormData>(defaultMenuItem);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as MenuItem["category"] | "all");
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    onAddMenuItem(newItem);
    setNewItem(defaultMenuItem);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Menu Management</h2>
            <p className="text-muted-foreground">Manage your restaurant's menu items</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Menu Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
              </DialogHeader>
              <MenuItemForm
                data={newItem}
                onChange={setNewItem}
                onSubmit={handleAddItem}
                submitLabel="Add Item"
              />
            </DialogContent>
          </Dialog>
        </div>

        <MenuSearchFilters
          searchTerm={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          categories={["appetizer", "main", "dessert", "beverage"]}
          onAddItem={handleAddItem}
        />

        <div className="flex justify-end items-center mb-4 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <MenuItemGrid
            items={filteredItems}
            onEdit={(item) => onUpdateMenuItem(item.id, item)}
            onDelete={onDeleteMenuItem}
            onUpdateAvailability={onUpdateAvailability}
          />
        ) : (
          <MenuItemTable
            items={filteredItems}
            onEdit={(item) => onUpdateMenuItem(item.id, item)}
            onDelete={onDeleteMenuItem}
            onUpdateAvailability={onUpdateAvailability}
          />
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No menu items found
          </div>
        )}
      </Card>
    </div>
  );
};
