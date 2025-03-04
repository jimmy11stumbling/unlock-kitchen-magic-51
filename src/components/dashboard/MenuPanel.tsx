
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Image, Plus, Table as TableIcon } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/types/staff";
import type { MenuItemFormData } from "./menu/types";
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
  imageFile: undefined,
};

export const MenuPanel = ({
  menuItems,
  onAddMenuItem,
  onUpdateAvailability,
  onUpdatePrice,
  onDeleteMenuItem,
  onUpdateMenuItem,
}: {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">, imageFile?: File) => void;
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onDeleteMenuItem?: (itemId: number) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>, imageFile?: File) => void;
}) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<MenuItem["category"] | "all">("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [newItem, setNewItem] = useState<MenuItemFormData>(defaultMenuItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available" | "unavailable">("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredItems = menuItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesAvailability = availabilityFilter === "all" ||
                                (availabilityFilter === "available" && item.available) ||
                                (availabilityFilter === "unavailable" && !item.available);
      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.price - b.price;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

  const handleAddItem = () => {
    if (!newItem.name || newItem.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Pass both the new item data and the image file if it exists
    onAddMenuItem(newItem, newItem.imageFile);
    setNewItem(defaultMenuItem);
    setIsAddDialogOpen(false);
  };

  const handleUpdateMenuItem = (itemId: number, updatedItem: Partial<MenuItem>) => {
    if (onUpdateMenuItem) {
      // Extract the imageFile property from the updatedItem if it exists
      const { imageFile, ...itemData } = updatedItem as any;
      onUpdateMenuItem(itemId, itemData, imageFile);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Menu Management</h2>
            <p className="text-muted-foreground">Manage your restaurant's menu items</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          availabilityFilter={availabilityFilter}
          onAvailabilityChange={setAvailabilityFilter}
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
            onUpdateAvailability={onUpdateAvailability}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
          />
        ) : (
          <MenuItemTable
            items={filteredItems}
            onUpdateAvailability={onUpdateAvailability}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={onDeleteMenuItem}
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
