
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import type { Order } from "@/types/staff";

interface OrdersPanelProps {
  orders: Order[];
  updateOrderStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrdersPanel = ({ orders, updateOrderStatus }: OrdersPanelProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Order #{order.id}</h3>
                <p className="text-sm text-muted-foreground">
                  Table {order.tableNumber}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  order.status === "preparing" ? "bg-blue-100 text-blue-700" :
                  order.status === "ready" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <Table>
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
              <Button
                variant="outline"
                onClick={() => updateOrderStatus(order.id, "preparing")}
                disabled={order.status !== "pending"}
              >
                Start Preparing
              </Button>
              <Button
                onClick={() => updateOrderStatus(order.id, "ready")}
                disabled={order.status !== "preparing"}
              >
                Mark as Ready
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};
