
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { notificationService } from '@/services/notifications/notificationService';
import type { KitchenOrder } from '@/types/staff';

export const useKitchenNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    notificationService.requestPermission();
  }, []);

  const notifyNewOrder = (order: KitchenOrder) => {
    toast({
      title: "New Order",
      description: `Order #${order.order_id} received for Table ${order.table_number}`,
    });

    notificationService.showNotification(
      "New Kitchen Order",
      {
        body: `Order #${order.order_id} received for Table ${order.table_number}`,
        icon: "/icons/kitchen.png"
      }
    );
  };

  const notifyOrderReady = (order: KitchenOrder) => {
    toast({
      title: "Order Ready",
      description: `Order #${order.order_id} is ready for service`,
    });

    notificationService.showNotification(
      "Order Ready for Service",
      {
        body: `Order #${order.order_id} is ready for pickup`,
        icon: "/icons/ready.png"
      }
    );
  };

  const notifyOrderOverdue = (order: KitchenOrder) => {
    toast({
      title: "Order Overdue",
      description: `Order #${order.order_id} is taking longer than expected`,
      variant: "destructive"
    });

    notificationService.showNotification(
      "Order Overdue",
      {
        body: `Order #${order.order_id} requires immediate attention`,
        icon: "/icons/warning.png"
      }
    );
  };

  return {
    notifyNewOrder,
    notifyOrderReady,
    notifyOrderOverdue
  };
};
