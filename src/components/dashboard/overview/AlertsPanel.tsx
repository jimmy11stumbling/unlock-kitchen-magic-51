import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Clock, Package, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InventoryItem, Reservation, Order } from "@/types";
import { playAlertSound } from "@/utils/sound";

interface AlertsPanelProps {
  inventory: InventoryItem[];
  reservations: Reservation[];
  orders: Order[];
  lowStockItems: InventoryItem[];
  pendingReservations: Reservation[];
}

export const AlertsPanel = ({ 
  inventory,
  reservations,
  orders,
  lowStockItems,
  pendingReservations
}: AlertsPanelProps) => {
  const [readAlerts, setReadAlerts] = useState<Set<string>>(new Set());
  const [lastAlertCount, setLastAlertCount] = useState(0);
  
  const totalAlerts = lowStockItems.length + pendingReservations.length + orders.length;

  useEffect(() => {
    if (totalAlerts > lastAlertCount) {
      playAlertSound();
    }
    setLastAlertCount(totalAlerts);
  }, [totalAlerts, lastAlertCount]);

  const markAllAsRead = () => {
    const allAlertIds = [
      ...orders.map(o => `order-${o.id}`),
      ...lowStockItems.map(i => `stock-${i.id}`),
      ...pendingReservations.map(r => `res-${r.id}`)
    ];
    setReadAlerts(new Set(allAlertIds));
  };

  const AlertItem = ({ 
    icon: Icon, 
    title, 
    description, 
    priority = "normal",
    id
  }: { 
    icon: typeof Clock;
    title: string;
    description: string;
    priority?: "high" | "normal" | "low";
    id: string;
  }) => (
    <div className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
      readAlerts.has(id) ? 'bg-gray-50' : 'bg-white'
    }`}>
      <Icon className={`h-4 w-4 ${
        priority === "high" ? "text-red-600" :
        priority === "normal" ? "text-yellow-600" :
        "text-blue-600"
      }`} />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          {!readAlerts.has(id) && (
            <Badge variant="secondary" className="text-xs">New</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Active Alerts</h3>
            {totalAlerts > 0 && (
              <Badge variant="destructive">{totalAlerts}</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </div>
        
        <div className="space-y-2">
          {orders.map(order => (
            <AlertItem
              key={order.id}
              icon={Clock}
              title={`Order #${order.id} Pending`}
              description="Requires immediate attention"
              priority="high"
              id={`order-${order.id}`}
            />
          ))}

          {lowStockItems.map(item => (
            <AlertItem
              key={item.id}
              icon={Package}
              title={`${item.name} Low in Stock`}
              description={`Current stock: ${item.quantity} ${item.unit}`}
              priority="normal"
              id={`stock-${item.id}`}
            />
          ))}

          {pendingReservations.map(res => (
            <AlertItem
              key={res.id}
              icon={Calendar}
              title={`Reservation for ${res.customerName}`}
              description="Awaiting confirmation"
              priority="low"
              id={`res-${res.id}`}
            />
          ))}

          {totalAlerts === 0 && (
            <div className="flex items-center gap-2 text-green-600 p-3">
              <Bell className="h-4 w-4" />
              <p>No active alerts at this time</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
