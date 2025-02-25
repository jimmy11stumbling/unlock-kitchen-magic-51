
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order, MenuItem } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";
import { calculateTax, getAvailableStates } from "@/utils/taxCalculator";
import { Plus, Minus, Send, UtensilsCrossed } from "lucide-react";

interface OrderDetailsProps {
  order: Order;
  menuItems: MenuItem[];
  onUpdateOrder: (orderId: number, items: Order['items']) => void;
  onSendToKitchen: (orderId: number) => void;
}

export const OrderDetails = ({
  order,
  menuItems,
  onUpdateOrder,
  onSendToKitchen,
}: OrderDetailsProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedState, setSelectedState] = useState<string>("California");
  const [menuCategory, setMenuCategory] = useState<MenuItem["category"]>("main");
  const states = getAvailableStates();
  
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const { tax, total } = calculateTax(subtotal, selectedState);

  const categories: MenuItem["category"][] = ["appetizer", "main", "dessert", "beverage"];
  const filteredMenuItems = menuItems.filter(item => item.category === menuCategory);

  const addItemToOrder = () => {
    if (!selectedItem) return;

    const newItems = [...order.items];
    const existingItem = newItems.find(item => item.name === selectedItem.name);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      newItems.push({
        id: Date.now(),
        name: selectedItem.name,
        quantity,
        price: selectedItem.price,
      });
    }

    onUpdateOrder(order.id, newItems);
    setQuantity(1);
    setSelectedItem(null);

    toast({
      title: "Item Added",
      description: `Added ${quantity}x ${selectedItem.name} to order`,
    });
  };

  const updateItemQuantity = (itemId: number, delta: number) => {
    const newItems = [...order.items];
    const item = newItems.find(i => i.id === itemId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        item.quantity = newQuantity;
        onUpdateOrder(order.id, newItems);
      } else {
        onUpdateOrder(order.id, newItems.filter(i => i.id !== itemId));
      }
    }
  };

  const handleSendToKitchen = () => {
    onSendToKitchen(order.id);
    toast({
      title: "Order Sent",
      description: "Order has been sent to the kitchen",
    });
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSendToKitchen}
          disabled={order.items.length === 0 || order.status !== "pending"}
          className="h-12 sm:h-10"
        >
          <Send className="w-4 h-4 mr-2" />
          Send to Kitchen
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={menuCategory === category ? "default" : "outline"}
              onClick={() => setMenuCategory(category)}
              className="h-12 sm:h-10"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filteredMenuItems.map((item) => (
            <Button
              key={item.id}
              variant={selectedItem?.id === item.id ? "default" : "outline"}
              onClick={() => setSelectedItem(item)}
              className="h-16 sm:h-14 flex flex-col items-center justify-center p-2"
            >
              <span className="text-sm font-medium truncate">{item.name}</span>
              <span className="text-xs">${item.price.toFixed(2)}</span>
            </Button>
          ))}
        </div>

        {selectedItem && (
          <div className="flex items-center justify-between gap-4 p-4 bg-muted rounded-lg">
            <span className="font-medium">{selectedItem.name}</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button onClick={addItemToOrder} className="h-10">Add</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <span className="font-medium">{item.name}</span>
                <p className="text-sm text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateItemQuantity(item.id, -1)}
                  className="h-10 w-10"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateItemQuantity(item.id, 1)}
                  className="h-10 w-10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">State</label>
          <Select
            value={selectedState}
            onValueChange={setSelectedState}
          >
            <SelectTrigger className="h-12 sm:h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax ({selectedState})</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
