
import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { KitchenOrder } from "@/types/staff";

interface KitchenNotification {
  id: string;
  message: string;
  type: "warning" | "info" | "success" | "error";
  timestamp: Date;
  read: boolean;
  orderId?: number;
}

interface KitchenNotificationsProps {
  activeOrders: KitchenOrder[];
}

export function KitchenNotifications({ activeOrders }: KitchenNotificationsProps) {
  const [notifications, setNotifications] = useState<KitchenNotification[]>([]);
  const [muted, setMuted] = useState(false);
  
  // Process orders and create notifications
  useEffect(() => {
    // Check for delayed orders
    const currentTime = new Date();
    const delayedOrders = activeOrders.filter(order => {
      const estimatedTime = new Date(order.estimated_delivery_time);
      return currentTime > estimatedTime && order.status === "preparing";
    });
    
    // Generate notifications for delayed orders
    const delayedNotifications = delayedOrders.map(order => {
      const estimatedTime = new Date(order.estimated_delivery_time);
      const delayMinutes = Math.floor((currentTime.getTime() - estimatedTime.getTime()) / 60000);
      
      // Create a unique ID using order ID and timestamp to avoid duplicates
      const notificationId = `delayed-${order.id}-${currentTime.toISOString()}`;
      
      // Check if this notification already exists
      const exists = notifications.some(n => n.id === notificationId);
      if (exists) return null;
      
      return {
        id: notificationId,
        message: `Order #${order.order_id} is delayed by ${delayMinutes} minutes`,
        type: "warning" as const,
        timestamp: currentTime,
        read: false,
        orderId: order.order_id
      };
    }).filter(Boolean) as KitchenNotification[];
    
    // Add rush order notifications
    const rushOrders = activeOrders.filter(order => order.priority === "rush" && order.status === "pending");
    const rushNotifications = rushOrders.map(order => {
      const notificationId = `rush-${order.id}`;
      const exists = notifications.some(n => n.id === notificationId);
      if (exists) return null;
      
      return {
        id: notificationId,
        message: `Rush order #${order.order_id} needs immediate attention`,
        type: "error" as const,
        timestamp: currentTime,
        read: false,
        orderId: order.order_id
      };
    }).filter(Boolean) as KitchenNotification[];
    
    // Combine notifications, put unread ones first
    const newNotifications = [...delayedNotifications, ...rushNotifications];
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev].slice(0, 20)); // Keep last 20 notifications
      
      // Play sound for new notifications if not muted
      if (!muted && newNotifications.length > 0) {
        const audio = new Audio('/sounds/notification.mp3');
        audio.play().catch(err => console.log('Audio play error:', err));
      }
    }
  }, [activeOrders, muted, notifications]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  const getNotificationVariant = (type: KitchenNotification["type"]) => {
    switch (type) {
      case "warning": return "bg-amber-100 text-amber-800 border-amber-300";
      case "error": return "bg-red-100 text-red-800 border-red-300";
      case "success": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            {muted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                variant="destructive"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Kitchen Notifications</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setMuted(!muted)}>
                {muted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>Mark all read</Button>
              <Button variant="ghost" size="sm" onClick={clearNotifications}>Clear</Button>
            </div>
          </div>
          
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <Card 
                    key={notification.id}
                    className={`p-3 border ${notification.read ? 'bg-background' : getNotificationVariant(notification.type)}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}
