
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { vendorService } from "./services/vendorService";
import { toast } from "@/components/ui/use-toast";
import { FileText, Download } from "lucide-react";

interface OrderHistoryProps {
  vendorId: number;
}

export const OrderHistory = ({ vendorId }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await vendorService.getVendorOrders(vendorId);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch vendor orders:", error);
        toast({
          title: "Error",
          description: "Failed to load order history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [vendorId]);

  const handleGeneratePdf = async (orderId: string) => {
    try {
      const result = await vendorService.generateOrderPdf(orderId);
      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate order PDF",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No orders found for this vendor
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Order #{order.id.substring(0, 8)}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()} - {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${order.amount.toFixed(2)}</div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => handleGeneratePdf(order.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h5 className="text-sm font-medium mb-1">Items:</h5>
                  <ul className="text-sm">
                    {order.items.map((item: any, idx: number) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
