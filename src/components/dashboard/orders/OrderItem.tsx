
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { RefreshCcw, Check, ShoppingBag } from "lucide-react";
import type { Order } from "@/types/staff";
import { OrderStatus } from "./OrderStatus";

interface OrderItemProps {
  order: Order;
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrderItem = ({ order, updateOrderStatus }: OrderItemProps) => {
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
                  ${item.price.toFixed(2)}
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

      <div className="mt-4 flex justify-end space-x-2">
        {order.status === "pending" && (
          <Button
            onClick={() => updateOrderStatus(order.id, "preparing")}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Start Preparing
          </Button>
        )}
        {order.status === "preparing" && (
          <Button
            onClick={() => updateOrderStatus(order.id, "ready")}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Mark as Ready
          </Button>
        )}
        {order.status === "ready" && (
          <Button
            onClick={() => updateOrderStatus(order.id, "delivered")}
            className="flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Mark as Delivered
          </Button>
        )}
      </div>
    </Card>
  );
};
