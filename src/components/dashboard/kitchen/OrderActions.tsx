
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PlayCircle, 
  CheckCircle, 
  Truck, 
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface OrderActionsProps {
  order: KitchenOrder;
  onUpdateStatus: (orderId: number, status: KitchenOrder["status"]) => void;
}

export function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const getNextSteps = () => {
    const pendingItemsCount = order.items.filter(item => item.status === 'pending').length;
    const preparingItemsCount = order.items.filter(item => item.status === 'preparing').length;
    const readyItemsCount = order.items.filter(item => item.status === 'ready').length;
    
    return {
      pendingItemsCount,
      preparingItemsCount,
      readyItemsCount,
      allItemsReady: order.items.length > 0 && readyItemsCount === order.items.length,
      someItemsPreparing: preparingItemsCount > 0,
      allItemsPending: order.items.length > 0 && pendingItemsCount === order.items.length
    };
  };
  
  const { 
    pendingItemsCount, 
    preparingItemsCount, 
    readyItemsCount,
    allItemsReady,
    someItemsPreparing,
    allItemsPending
  } = getNextSteps();
  
  const handleStart = () => {
    onUpdateStatus(order.id, 'preparing');
  };
  
  const handleComplete = () => {
    onUpdateStatus(order.id, 'ready');
  };
  
  const handleDeliver = () => {
    onUpdateStatus(order.id, 'delivered');
  };
  
  const handleReset = () => {
    onUpdateStatus(order.id, 'pending');
  };
  
  const allowMarkAsReady = readyItemsCount > 0 || allItemsReady;
  
  const getEstimatedDeliveryStatus = () => {
    const now = new Date();
    const estimatedDelivery = new Date(order.estimated_delivery_time);
    
    if (now > estimatedDelivery && (order.status === 'pending' || order.status === 'preparing')) {
      return 'late';
    }
    
    // If delivery will be within 5 minutes
    const fiveMinutesInMs = 5 * 60 * 1000;
    if (now.getTime() + fiveMinutesInMs > estimatedDelivery.getTime() && 
        (order.status === 'pending' || order.status === 'preparing')) {
      return 'soon';
    }
    
    return 'on-time';
  };
  
  const deliveryStatus = getEstimatedDeliveryStatus();

  return (
    <div className="flex flex-col pt-4 border-t space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              Pending: {pendingItemsCount}
            </div>
          </Badge>
          <Badge variant="outline">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
              Preparing: {preparingItemsCount}
            </div>
          </Badge>
          <Badge variant="outline">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Ready: {readyItemsCount}
            </div>
          </Badge>
        </div>
        
        {deliveryStatus === 'late' && (
          <Badge className="bg-red-100 text-red-800">
            <Clock className="h-3 w-3 mr-1" /> Delayed
          </Badge>
        )}
        
        {deliveryStatus === 'soon' && (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> Due Soon
          </Badge>
        )}
      </div>
      
      <div className="flex justify-end gap-2">
        {order.status === 'pending' && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={handleStart}
            disabled={!allItemsPending && !someItemsPreparing}
          >
            <PlayCircle className="h-3 w-3" /> Start Preparation
          </Button>
        )}
        
        {order.status === 'preparing' && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700"
            onClick={handleComplete}
            disabled={!allowMarkAsReady}
          >
            <CheckCircle className="h-3 w-3" /> Mark as Ready
          </Button>
        )}
        
        {order.status === 'ready' && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={handleDeliver}
          >
            <Truck className="h-3 w-3" /> Mark as Delivered
          </Button>
        )}
        
        {(order.status === 'preparing' || order.status === 'ready') && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs flex items-center gap-1"
            onClick={handleReset}
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </Button>
        )}
      </div>
    </div>
  );
}
