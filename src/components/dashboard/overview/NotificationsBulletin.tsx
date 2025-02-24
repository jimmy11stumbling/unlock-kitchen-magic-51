
import { AlertCircle, Clock, Restaurant, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";

interface NotificationItem {
  id: number;
  type: "alert" | "info" | "warning";
  title: string;
  message: string;
  time: string;
}

const notifications: NotificationItem[] = [
  {
    id: 1,
    type: "alert",
    title: "Low Inventory Alert",
    message: "Wine stock running low - Please reorder Cabernet Sauvignon",
    time: "10 minutes ago"
  },
  {
    id: 2,
    type: "info",
    title: "Peak Hours Approaching",
    message: "Expecting high traffic in 1 hour. Extra staff recommended.",
    time: "25 minutes ago"
  },
  {
    id: 3,
    type: "warning",
    title: "Table Management",
    message: "3 reservations pending confirmation for tonight",
    time: "1 hour ago"
  }
];

export const NotificationsBulletin = () => {
  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "info":
        return <Users className="w-5 h-5 text-blue-400" />;
    }
  };

  const getCardClass = (type: NotificationItem["type"]) => {
    switch (type) {
      case "alert":
        return "border-red-500/10 bg-red-500/5";
      case "warning":
        return "border-yellow-500/10 bg-yellow-500/5";
      case "info":
        return "border-blue-500/10 bg-blue-500/5";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Restaurant className="w-5 h-5" />
          Restaurant Notifications
        </h3>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${getCardClass(notification.type)} transition-all duration-200 hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-4">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-medium mb-1">{notification.title}</h4>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <span className="text-xs text-muted-foreground mt-2 block">
                  {notification.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-primary/10 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4" />
            <h4 className="font-medium">Current Capacity</h4>
          </div>
          <p className="text-2xl font-bold">78%</p>
          <span className="text-xs text-muted-foreground">32/40 tables occupied</span>
        </div>
        
        <div className="p-4 rounded-lg border border-primary/10 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4" />
            <h4 className="font-medium">Today's Revenue</h4>
          </div>
          <p className="text-2xl font-bold">$3,245</p>
          <span className="text-xs text-muted-foreground">+15% from yesterday</span>
        </div>
      </div>
    </Card>
  );
};
