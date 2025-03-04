
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import type { MenuItem } from "@/types/staff";
import { MenuItemForm } from "./MenuItemForm";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItemFormData } from "./types";

interface MenuItemTableProps {
  items: MenuItem[];
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>, imageFile?: File) => void;
  onDeleteMenuItem?: (itemId: number) => void;
}

export const MenuItemTable = ({
  items,
  onUpdateAvailability,
  onUpdateMenuItem,
  onDeleteMenuItem,
}: MenuItemTableProps) => {
  const [editingItem, setEditingItem] = useState<MenuItemFormData | null>(null);
  const { toast } = useToast();

  const handleEdit = (item: MenuItem) => {
    setEditingItem({
      ...item,
      imageFile: undefined
    });
  };

  const handleUpdateItem = () => {
    if (editingItem && onUpdateMenuItem) {
      onUpdateMenuItem(
        editingItem.id!, 
        {
          name: editingItem.name,
          price: editingItem.price,
          category: editingItem.category,
          description: editingItem.description,
          available: editingItem.available,
          allergens: editingItem.allergens,
          preparationTime: editingItem.preparationTime,
        },
        editingItem.imageFile
      );
      setEditingItem(null);
      toast({
        title: "Item Updated",
        description: "Menu item has been successfully updated",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[100px]">Price</TableHead>
            <TableHead className="w-[120px]">Availability</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-12 h-12 rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No image</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>${item.price.toFixed(2)}</TableCell>
              <TableCell>
                <Switch
                  checked={item.available}
                  onCheckedChange={(checked) => onUpdateAvailability(item.id, checked)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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
                    onClick={() => onDeleteMenuItem?.(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              data={editingItem}
              onSubmit={handleUpdateItem}
              onChange={setEditingItem}
              submitLabel="Update Item"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
