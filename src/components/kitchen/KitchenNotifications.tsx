
import React, { useState, useEffect } from 'react';
import { Bell, Volume2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import type { KitchenOrder } from "@/types/staff";

interface KitchenNotificationsProps {
  activeOrders: KitchenOrder[];
}

export function KitchenNotifications({ activeOrders }: KitchenNotificationsProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'warning' | 'info' | 'error';
    timestamp: Date;
    read: boolean;
  }>>([]);
  
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Check for delayed orders
    const delayed = activeOrders.filter(order => 
      new Date() > new Date(order.estimated_delivery_time)
    );
    
    // Process new notifications
    if (delayed.length > 0) {
      const newNotifications = delayed.map(order => ({
        id: `delay-${order.id}-${Date.now()}`,
        message: `Order #${order.order_id} for Table ${order.tableNumber} is delayed`,
        type: 'warning' as const,
        timestamp: new Date(),
        read: false
      }));
      
      // Add new notifications (avoiding duplicates)
      setNotifications(prev => {
        // Get IDs of existing notifications
        const existingIds = prev.map(n => n.id.split('-')[1]);
        
        // Filter out notifications for orders that already have a delay notification
        const uniqueNew = newNotifications.filter(n => 
          !existingIds.includes(n.id.split('-')[1])
        );
        
        if (uniqueNew.length > 0 && soundEnabled) {
          playNotificationSound();
          uniqueNew.forEach(notification => {
            toast.warning(notification.message);
          });
        }
        
        return [...uniqueNew, ...prev].slice(0, 20); // Keep last 20 notifications
      });
    }
    
    // Check for rush orders
    const rush = activeOrders.filter(order => order.priority === 'rush');
    if (rush.length > 0) {
      const newNotifications = rush.map(order => ({
        id: `rush-${order.id}-${Date.now()}`,
        message: `RUSH order #${order.order_id} for Table ${order.tableNumber} needs attention!`,
        type: 'error' as const,
        timestamp: new Date(),
        read: false
      }));
      
      // Add new notifications (avoiding duplicates)
      setNotifications(prev => {
        // Get IDs of existing notifications
        const existingIds = prev.map(n => n.id.split('-')[1]);
        
        // Filter out notifications for orders that already have a rush notification
        const uniqueNew = newNotifications.filter(n => 
          !existingIds.includes(n.id.split('-')[1])
        );
        
        if (uniqueNew.length > 0 && soundEnabled) {
          playNotificationSound();
          uniqueNew.forEach(notification => {
            toast.error(notification.message);
          });
        }
        
        return [...uniqueNew, ...prev].slice(0, 20); // Keep last 20 notifications
      });
    }
    
    // Update unread count
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [activeOrders, soundEnabled]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch(e => console.error("Failed to play notification sound:", e));
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full flex items-center justify-center text-xs text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <div className="flex items-center justify-between mb-2 pb-2 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sound-notifications"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  size="sm"
                />
                <Label htmlFor="sound-notifications" className="text-xs">
                  Sound
                </Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                Mark all read
              </Button>
            </div>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-2 border rounded-md cursor-pointer ${
                    !notification.read ? 'bg-slate-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between">
                    <span className={`text-sm font-medium ${
                      notification.type === 'error' ? 'text-red-600' : 
                      notification.type === 'warning' ? 'text-amber-600' : 'text-slate-600'
                    }`}>
                      {notification.type === 'error' ? 'Urgent' : 
                       notification.type === 'warning' ? 'Warning' : 'Info'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{notification.message}</p>
                </div>
              ))
            )}
          </div>
          
          {soundEnabled && (
            <div className="flex items-center gap-1 mt-2 pt-2 border-t text-xs text-muted-foreground">
              <Volume2 className="h-3 w-3" />
              <span>Sound alerts are enabled</span>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
