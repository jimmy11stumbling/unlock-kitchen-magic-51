
import { Card } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

export const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "New order received #123",
      type: "info",
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      message: "Low inventory alert: Tomatoes",
      type: "warning",
      timestamp: new Date(),
      read: false
    }
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Bell className="h-5 w-5" />
      </div>
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border ${
              notification.read ? 'bg-muted' : 'bg-background'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
