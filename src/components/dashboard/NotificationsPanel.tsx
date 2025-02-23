
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { TableLayout, InventoryItem, Order } from "@/types/staff";

interface NotificationsPanelProps {
  tables?: TableLayout[];
  inventory?: InventoryItem[];
  orders?: Order[];
}

export const NotificationsPanel = ({ tables, inventory, orders }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: "warning" | "info" | "success";
    message: string;
    time: Date;
  }>>([]);

  useEffect(() => {
    const newNotifications = [];

    // Check low inventory
    inventory?.forEach(item => {
      if (item.quantity <= item.minQuantity) {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: "warning",
          message: `Low stock alert: ${item.name}`,
          time: new Date(),
        });
      }
    });

    // Check table status
    tables?.forEach(table => {
      if (table.status === "cleaning") {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: "info",
          message: `Table ${table.number} needs cleaning`,
          time: new Date(),
        });
      }
    });

    // Check orders
    orders?.forEach(order => {
      if (order.status === "ready") {
        newNotifications.push({
          id: Date.now() + Math.random(),
          type: "success",
          message: `Order #${order.id} is ready for delivery`,
          time: new Date(),
        });
      }
    });

    setNotifications(prev => [...prev, ...newNotifications]);
  }, [tables, inventory, orders]);

  const getNotificationIcon = (type: "warning" | "info" | "success") => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: "warning" | "info" | "success") => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-100";
      case "success":
        return "bg-green-50 border-green-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </h3>
        {notifications.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotifications([])}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No new notifications
          </p>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${getNotificationColor(
                notification.type
              )} flex items-start space-x-3`}
            >
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.time.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
