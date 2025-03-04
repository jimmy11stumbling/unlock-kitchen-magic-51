
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MenuItemForm } from "./MenuItemForm";
import { useToast } from "@/components/ui/use-toast";

const placeholderImages = [
  "/food-images/burger.jpg",
  "/food-images/salad.jpg",
  "/food-images/cake.jpg",
  "/food-images/pizza.jpg",
  "/food-images/pasta.jpg",
  "/food-images/steak.jpg",
  "/food-images/sushi.jpg",
  "/food-images/cocktail.jpg",
];

interface MenuItemGridProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>) => void;
  onDeleteMenuItem?: (itemId: number) => void;
}

export const MenuItemGrid = ({ 
  items, 
  onUpdateAvailability, 
  onUpdateMenuItem,
  onDeleteMenuItem 
}: MenuItemGridProps) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const { toast } = useToast();

  const handleAvailabilityChange = (itemId: number, available: boolean) => {
    onUpdateAvailability(itemId, available);
    toast({
      title: "Availability Updated",
      description: `Item is now ${available ? 'available' : 'unavailable'}`,
    });
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
  };

  const handleUpdateItem = (itemId: number, updatedData: Partial<MenuItem>) => {
    if (onUpdateMenuItem) {
      onUpdateMenuItem(itemId, updatedData);
      setEditingItem(null);
      toast({
        title: "Item Updated",
        description: "Menu item has been successfully updated",
      });
    }
  };

  const handleDelete = (itemId: number, itemName: string) => {
    if (onDeleteMenuItem) {
      onDeleteMenuItem(itemId);
      toast({
        title: "Item Deleted",
        description: `${itemName} has been removed from the menu`,
        variant: "destructive",
      });
    }
  };

  // Function to get an image URL for a menu item
  const getItemImage = (item: MenuItem, index: number) => {
    if (item.image) return item.image;
    
    // Use a deterministic placeholder image based on item ID
    const placeholderIndex = item.id % placeholderImages.length;
    return placeholderImages[placeholderIndex];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item, index) => (
        <Card key={item.id} className="p-4">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
            <img
              src={getItemImage(item, index)}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="px-2 py-1 text-xs bg-muted rounded-full"
                >
                  {allergen}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) => handleAvailabilityChange(item.id, checked)}
                />
                <span className="text-sm">
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(item.id, item.name)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              data={editingItem}
              onSubmit={() => {
                if (editingItem && onUpdateMenuItem) {
                  onUpdateMenuItem(editingItem.id, editingItem);
                  setEditingItem(null);
                }
              }}
              onChange={(data) => setEditingItem({ ...editingItem, ...data })}
              submitLabel="Update Item"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
