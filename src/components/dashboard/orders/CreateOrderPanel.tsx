
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Minus, Utensils } from "lucide-react";
import type { MenuItem, OrderItem, Order } from "@/types/staff";

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

  const filteredMenuItems = menuItems
    .filter(item => item.available)
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <Input
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 gap-4">
            {filteredMenuItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeItemFromOrder(item)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">
                      {selectedItems.find(selected => selected.id === item.id)?.quantity || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addItemToOrder(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Order</h3>
          <Utensils className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Table Number</Label>
              <Input
                id="tableNumber"
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Input
              id="specialInstructions"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Allergies, preferences, etc."
            />
          </div>
        </div>

        <ScrollArea className="h-[300px] mb-6">
          <div className="space-y-4">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeItemFromOrder({ id: item.id } as MenuItem)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => addItemToOrder({ id: item.id, price: item.price, name: item.name } as MenuItem)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmitOrder}
            disabled={selectedItems.length === 0}
          >
            Send Order to Kitchen
          </Button>
        </div>
      </Card>
    </div>
  );
};
