import { useState } from 'react';
import { Order, MenuItem } from '@/types'; // Updated import path
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface OrderDetailsProps {
  order: Order;
  menuItems: MenuItem[];
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, menuItems }) => {
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = (newStatus: Order['status']) => {
    setStatus(newStatus);
    // Here you would typically call an API to update the order status
    console.log(`Order status updated to: ${newStatus}`);
  };

  return (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Order #{order.id}</CardTitle>
        <CardDescription>
          Order placed on {new Date(order.timestamp).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {order.items.map((item) => {
            const menuItem = menuItems.find((menuItem) => menuItem.id === item.id);
            return (
              <li key={item.id} className="py-2">
                {menuItem ? menuItem.name : 'Unknown Item'} - {item.quantity} x ${item.price}
              </li>
            );
          })}
        </ul>
        <p className="mt-4">Total: ${order.total}</p>
        {order.specialInstructions && (
          <p className="mt-2">Special Instructions: {order.specialInstructions}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>Status: {status}</div>
        <div className="space-x-2">
          <Button onClick={() => handleStatusChange('pending')} disabled={status === 'pending'}>
            Pending
          </Button>
          <Button onClick={() => handleStatusChange('preparing')} disabled={status === 'preparing'}>
            Preparing
          </Button>
          <Button onClick={() => handleStatusChange('ready')} disabled={status === 'ready'}>
            Ready
          </Button>
          <Button onClick={() => handleStatusChange('delivered')} disabled={status === 'delivered'}>
            Delivered
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
