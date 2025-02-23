import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Utensils } from "lucide-react";
import type { MenuItem, OrderItem, Order } from "@/types/staff";
import { MenuItemList } from "./components/MenuItemList";
import { OrderDetails } from "./components/OrderDetails";
import { OrderSummary } from "./components/OrderSummary";

interface CreateOrderPanelProps {
  menuItems: MenuItem[];
  onCreateOrder: (order: Omit<Order, "id" | "timestamp">) => void;
}

export const CreateOrderPanel = ({ menuItems, onCreateOrder }: CreateOrderPanelProps) => {
  const { toast } = useToast();
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [guestCount, setGuestCount] = useState<number>(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<OrderItem>>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addItemToOrder = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, {
        id: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price
      }]);
    }
    
    toast({
      title: "Item Added",
      description: `Added ${menuItem.name} to order`,
    });
  };

  const removeItemFromOrder = (menuItem: MenuItem) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setSelectedItems(selectedItems.map(item =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ));
      } else {
        setSelectedItems(selectedItems.filter(item => item.id !== menuItem.id));
      }
    }
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the order",
        variant: "destructive",
      });
      return;
    }

    const newOrder: Omit<Order, "id" | "timestamp"> = {
      tableNumber,
      items: selectedItems,
      status: "pending",
      total: calculateTotal(),
      serverName: "Current User", // This should be replaced with actual logged-in user
      specialInstructions,
      guestCount,
      estimatedPrepTime: Math.max(...selectedItems.map(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        return (menuItem?.preparationTime || 15) * item.quantity;
      })),
    };

    onCreateOrder(newOrder);
    
    // Reset form
    setSelectedItems([]);
    setSpecialInstructions("");
    
    toast({
      title: "Order Created",
      description: `Order for Table ${tableNumber} has been sent to kitchen`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
        <MenuItemList
          menuItems={menuItems}
          searchQuery={searchQuery}
          selectedItems={selectedItems}
          onSearchChange={setSearchQuery}
          onAddItem={addItemToOrder}
          onRemoveItem={removeItemFromOrder}
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Order</h3>
          <Utensils className="h-5 w-5 text-muted-foreground" />
        </div>

        <OrderDetails
          tableNumber={tableNumber}
          guestCount={guestCount}
          specialInstructions={specialInstructions}
          onTableNumberChange={setTableNumber}
          onGuestCountChange={setGuestCount}
          onSpecialInstructionsChange={setSpecialInstructions}
        />

        <OrderSummary
          selectedItems={selectedItems}
          onAddItem={addItemToOrder}
          onRemoveItem={removeItemFromOrder}
          total={calculateTotal()}
          onSubmit={handleSubmitOrder}
        />
      </Card>
    </div>
  );
};
