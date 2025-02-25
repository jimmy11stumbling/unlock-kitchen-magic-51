
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, Package, Calendar } from "lucide-react";
import type { InventoryItem, Reservation, Order } from "@/types/staff";
import { Button } from "@/components/ui/button";

interface AlertsPanelProps {
  inventory: InventoryItem[];
  reservations: Reservation[];
  activeOrders: Order[];
  lowStockItems: InventoryItem[];
  pendingReservations: Reservation[];
}

export const AlertsPanel = ({ 
  lowStockItems,
  pendingReservations,
  activeOrders
}: AlertsPanelProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Active Alerts</h3>
          <Button variant="outline" size="sm">View All</Button>
        </div>
        
        <div className="space-y-4">
          {activeOrders.length > 0 && (
            <div className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium">{activeOrders.length} Active Orders</p>
                <p className="text-sm text-muted-foreground">
                  Require immediate attention
                </p>
              </div>
            </div>
          )}

          {lowStockItems.length > 0 && (
            <div className="flex items-center gap-2 text-orange-600">
              <Package className="h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium">{lowStockItems.length} Items Low in Stock</p>
                <p className="text-sm text-muted-foreground">
                  Need to be restocked soon
                </p>
              </div>
            </div>
          )}

          {pendingReservations.length > 0 && (
            <div className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-4 w-4" />
              <div className="flex-1">
                <p className="font-medium">{pendingReservations.length} Pending Reservations</p>
                <p className="text-sm text-muted-foreground">
                  Awaiting confirmation
                </p>
              </div>
            </div>
          )}

          {lowStockItems.length === 0 && activeOrders.length === 0 && pendingReservations.length === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <AlertTriangle className="h-4 w-4" />
              <p>No active alerts at this time</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
