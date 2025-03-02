
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { KitchenOrder } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

interface KitchenNotificationsProps {
  activeOrders: KitchenOrder[];
}

export function KitchenNotifications({ activeOrders }: KitchenNotificationsProps) {
  const { toast } = useToast();
  const [hasNew, setHasNew] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState<{
    id: number;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'rush' | 'delayed' | 'info';
  }[]>([]);
  
  useEffect(() => {
    // Generate notifications from active orders
    const newNotifications = [];
    
    // Check for rush orders
    const rushOrders = activeOrders.filter(order => order.priority === 'rush');
    for (const order of rushOrders) {
      const existingNotification = notifications.find(
        n => n.id === order.id && n.type === 'rush'
      );
      
      if (!existingNotification) {
        newNotifications.push({
          id: order.id,
          message: `Rush order #${order.order_id} for Table ${order.tableNumber} needs immediate attention!`,
          timestamp: new Date(),
          read: false,
          type: 'rush' as const
        });
      }
    }
    
    // Check for delayed orders
    const delayedOrders = activeOrders.filter(order => 
      new Date() > new Date(order.estimated_delivery_time)
    );
    
    for (const order of delayedOrders) {
      const existingNotification = notifications.find(
        n => n.id === order.id && n.type === 'delayed'
      );
      
      if (!existingNotification) {
        newNotifications.push({
          id: order.id,
          message: `Order #${order.order_id} for Table ${order.tableNumber} is now delayed!`,
          timestamp: new Date(),
          read: false,
          type: 'delayed' as const
        });
      }
    }
    
    if (newNotifications.length > 0) {
      setNotifications(prev => [...newNotifications, ...prev]);
      setHasNew(true);
      
      // Play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(err => console.error("Error playing notification sound:", err));
      
      // Show toast for the first new notification
      toast({
        title: newNotifications[0].type === 'rush' ? 'Rush Order' : 'Delayed Order',
        description: newNotifications[0].message,
        variant: newNotifications[0].type === 'rush' ? 'destructive' : 'default',
      });
    }
    
    // Update count of unread notifications
    setNotificationCount(
      notifications.filter(n => !n.read).length + newNotifications.length
    );
  }, [activeOrders, notifications, toast]);
  
  const handleMarkAllRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setNotificationCount(0);
    setHasNew(false);
  };
  
  const handleNotificationClick = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className={hasNew ? "animate-pulse" : ""} />
          {notificationCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500" 
              variant="secondary"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex justify-between items-center px-3 py-2 border-b">
          <h4 className="font-medium">Notifications</h4>
          {notificationCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="text-xs h-7"
            >
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.slice(0, 10).map((notification, index) => (
              <DropdownMenuItem
                key={`${notification.id}-${index}`}
                className={`px-3 py-2 cursor-pointer flex flex-col items-start gap-1 ${
                  notification.read ? "" : "bg-muted/50"
                }`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="flex items-center w-full gap-2">
                  <span 
                    className={`h-2 w-2 rounded-full ${
                      notification.type === 'rush' 
                        ? 'bg-red-500' 
                        : notification.type === 'delayed' 
                          ? 'bg-amber-500' 
                          : 'bg-blue-500'
                    }`}
                  />
                  <p className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                    {notification.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground ml-4">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
