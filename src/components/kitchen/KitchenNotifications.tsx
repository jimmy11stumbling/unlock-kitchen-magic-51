
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Volume2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function KitchenNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Order #45 Ready',
      message: 'Table 5 order is ready for pickup',
      time: '2 mins ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Temperature Alert',
      message: 'Walk-in freezer temperature above threshold',
      time: '10 mins ago',
      read: false,
      type: 'warning'
    },
    {
      id: '3',
      title: 'Inventory Alert',
      message: 'Chicken stock running low (15%)',
      time: '30 mins ago',
      read: true,
      type: 'warning'
    }
  ]);
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Kitchen Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 rounded-full flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Switch 
              id="sound-switch" 
              checked={soundEnabled} 
              onCheckedChange={setSoundEnabled}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <Switch 
              id="alerts-switch" 
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-auto">
        {notifications.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-3 border rounded-md flex items-start gap-3 ${notification.read ? 'bg-background' : 'bg-muted/20'}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="mt-1">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <h4 className={`font-medium truncate ${!notification.read ? 'text-primary' : ''}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      )}
    </Card>
  );
}
