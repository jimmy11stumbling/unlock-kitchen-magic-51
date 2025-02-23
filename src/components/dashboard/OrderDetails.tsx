
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Order, MenuItem, KitchenOrder } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

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

  const handleSendToKitchen = () => {
    onSendToKitchen(order.id);
    toast({
      title: "Order Sent",
      description: "Order has been sent to the kitchen",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Order #{order.id}</h3>
          <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSendToKitchen}
          disabled={order.items.length === 0 || order.status !== "pending"}
        >
          Send to Kitchen
        </Button>
      </div>

      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Item to Order</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={selectedItem?.id === item.id ? "default" : "outline"}
                    onClick={() => setSelectedItem(item)}
                    className="justify-between"
                  >
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
              {selectedItem && (
                <div className="space-y-2">
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                  <Button className="w-full" onClick={addItemToOrder}>
                    Add {quantity}x {selectedItem.name}
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-muted rounded">
              <div>
                <span className="font-medium">{item.quantity}x {item.name}</span>
                <p className="text-sm text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>
              ${order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
