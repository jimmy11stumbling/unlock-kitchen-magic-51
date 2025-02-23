
import { MenuPanel } from "@/components/dashboard/MenuPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem } from "@/types/staff";

const Menu = () => {
  const { menuItems, addMenuItem, updateMenuItemAvailability, updateMenuItemPrice, deleteMenuItem, updateMenuItem } = useDashboardState();
  const { toast } = useToast();

  const handleAddMenuItem = (item: Omit<MenuItem, "id">) => {
    addMenuItem(item);
    toast({
      title: "Menu Item Added",
      description: `${item.name} has been added to the menu.`,
    });
  };

  const handleUpdateAvailability = (itemId: number, available: boolean) => {
    updateMenuItemAvailability(itemId, available);
    toast({
      title: "Availability Updated",
      description: `Item availability has been ${available ? 'enabled' : 'disabled'}.`,
      variant: available ? 'default' : 'destructive',
    });
  };

  const handleUpdatePrice = (itemId: number, price: number) => {
    if (price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be greater than zero.",
        variant: "destructive",
      });
      return;
    }
    updateMenuItemPrice(itemId, price);
    toast({
      title: "Price Updated",
      description: "Menu item price has been updated.",
    });
  };

  const handleDeleteMenuItem = (itemId: number) => {
    const item = menuItems.find(item => item.id === itemId);
    if (item) {
      deleteMenuItem(itemId);
      toast({
        title: "Menu Item Deleted",
        description: `${item.name} has been removed from the menu.`,
        variant: "destructive",
      });
    }
  };

  const handleUpdateMenuItem = (itemId: number, updatedItem: Partial<MenuItem>) => {
    updateMenuItem(itemId, updatedItem);
    toast({
      title: "Menu Item Updated",
      description: "The menu item has been updated successfully.",
    });
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Menu Management</h1>
      <MenuPanel
        menuItems={menuItems}
        onAddMenuItem={handleAddMenuItem}
        onUpdateAvailability={handleUpdateAvailability}
        onUpdatePrice={handleUpdatePrice}
        onDeleteMenuItem={handleDeleteMenuItem}
        onUpdateMenuItem={handleUpdateMenuItem}
      />
    </div>
  );
};

export default Menu;
