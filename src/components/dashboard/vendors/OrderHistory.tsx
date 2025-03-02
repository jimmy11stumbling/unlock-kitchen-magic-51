
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { vendorService } from "./services/vendorService";

interface PurchaseOrder {
  id: string;
  date: string;
  amount: number;
  status: string;
  items: any[];
}

interface OrderHistoryProps {
  orders: PurchaseOrder[];
  vendorId: number;
}

export const OrderHistory = ({ orders, vendorId }: OrderHistoryProps) => {
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();

  const handleDownloadPdf = async (orderId: string) => {
    try {
      await vendorService.generateOrderPdf(orderId);
      toast({
        title: "Order PDF generated",
        description: "The PDF has been generated and is ready to download."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Purchase Order History</h3>
        <Button variant="outline" size="sm" onClick={() => vendorService.createNewOrder(vendorId)}>
          New Purchase Order
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No purchase orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">PO-{order.id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "completed"
                          ? "default"
                          : order.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadPdf(order.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Order ID</h4>
                  <p>PO-{selectedOrder.id.substring(0, 8)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Date</h4>
                  <p>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge
                    variant={
                      selectedOrder.status === "completed"
                        ? "default"
                        : selectedOrder.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Total Amount</h4>
                  <p>${selectedOrder.amount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            ${(item.quantity * item.unitPrice).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          No items in this order
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
