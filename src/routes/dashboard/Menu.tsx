
import { MenuPanel } from "@/components/dashboard/MenuPanel";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BarChart, Star } from "lucide-react";
import type { MenuItem } from "@/types/staff";

const Menu = () => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItemAvailability, 
    updateMenuItemPrice, 
    deleteMenuItem, 
    updateMenuItem,
    staff 
  } = useDashboardState();

  const { toast } = useToast();

  const activeStaffCount = staff.filter(member => member.status === 'active').length;
  const totalSales = menuItems.reduce((acc, item) => acc + ((item.orderCount || 0) * item.price), 0);
  const topSellingItems = [...menuItems]
    .sort((a, b) => ((b.orderCount || 0) - (a.orderCount || 0)))
    .slice(0, 5);

  const handleAddMenuItem = (item: Omit<MenuItem, "id">, imageFile?: File) => {
    // Process the image file if it exists
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        // Add the menu item with the image data URL
        addMenuItem({
          ...item,
          image: imageDataUrl
        });
        
        toast({
          title: "Menu Item Added",
          description: `${item.name} has been added to the menu.`,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      // Add the menu item without an image
      addMenuItem(item);
      toast({
        title: "Menu Item Added",
        description: `${item.name} has been added to the menu.`,
      });
    }
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

  const handleUpdateMenuItem = (itemId: number, updatedItem: Partial<MenuItem>, imageFile?: File) => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        // Update the menu item with the image data URL
        updateMenuItem(itemId, {
          ...updatedItem,
          image: imageDataUrl
        });
        toast({
          title: "Menu Item Updated",
          description: "The menu item has been updated successfully.",
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      // Update the menu item without changing the image
      updateMenuItem(itemId, updatedItem);
      toast({
        title: "Menu Item Updated",
        description: "The menu item has been updated successfully.",
      });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col items-start gap-4 mb-8">
        <div className="flex items-center gap-2">
          <img 
            src="/placeholder.svg" 
            alt="MaestroAI Logo" 
            className="h-10 w-10"
          />
          <h1 className="font-playfair text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            MaestroAI
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Intelligent menu management and optimization system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
              <h3 className="text-2xl font-bold">${totalSales.toFixed(2)}</h3>
            </div>
            <TrendingUp className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Staff</p>
              <h3 className="text-2xl font-bold">{activeStaffCount}</h3>
            </div>
            <Users className="h-8 w-8 text-primary/20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
              <h3 className="text-2xl font-bold">{menuItems.length}</h3>
            </div>
            <Clock className="h-8 w-8 text-primary/20" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
        <div className="space-y-4">
          {topSellingItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-muted-foreground">#{index + 1}</span>
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">${item.price}</p>
                </div>
              </div>
              <p className="text-sm font-medium">{item.orderCount || 0} orders</p>
            </div>
          ))}
        </div>
      </Card>

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
