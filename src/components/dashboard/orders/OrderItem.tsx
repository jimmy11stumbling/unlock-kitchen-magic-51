
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { RefreshCcw, Check, ShoppingBag, Clock } from "lucide-react";
import type { Order } from "@/types/staff";
import { OrderStatus } from "./OrderStatus";
import { useToast } from "@/components/ui/use-toast";

interface OrderItemProps {
  order: Order;
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrderItem = ({ order, updateOrderStatus }: OrderItemProps) => {
  const { toast } = useToast();

  const handleStatusUpdate = (status: Order["status"]) => {
    updateOrderStatus(order.id, status);
    toast({
      title: `Order #${order.id} Updated`,
      description: `Status changed to ${status}`,
    });
  };

  const renderActionButton = () => {
    switch (order.status) {
      case "pending":
        return (
          <Button
            onClick={() => handleStatusUpdate("preparing")}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Start Preparing
          </Button>
        );
      case "preparing":
        return (
          <Button
            onClick={() => handleStatusUpdate("ready")}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark as Ready
          </Button>
        );
      case "ready":
        return (
          <Button
            onClick={() => handleStatusUpdate("delivered")}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Mark as Delivered
          </Button>
        );
      case "delivered":
        return (
          <Button disabled className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Completed
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card key={order.id} className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Order #{order.id}</h3>
            <OrderStatus status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            Table {order.tableNumber} • {new Date(order.timestamp).toLocaleString()}
          </p>
          {order.specialInstructions && (
            <p className="text-sm text-red-600 mt-1">
              Note: {order.specialInstructions}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Server: {order.serverName}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Guests: {order.guestCount}
        </div>
      </div>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>x{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={2} className="font-medium">Total</TableCell>
              <TableCell className="text-right font-medium">
                ${order.total.toFixed(2)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm">
          <p>Est. Prep Time: {order.estimatedPrepTime} mins</p>
        </div>
        <div className="flex space-x-2">
          {renderActionButton()}
        </div>
      </div>
    </Card>
  );
};
