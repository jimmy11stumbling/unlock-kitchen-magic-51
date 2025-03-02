
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Clock, User, Target } from "lucide-react";
import { format } from "date-fns";
import type { KitchenOrder } from "@/types/staff";

interface OrderHeaderProps {
  order: KitchenOrder;
  onUpdatePriority: (orderId: number, priority: KitchenOrder["priority"]) => void;
}

export function OrderHeader({ order, onUpdatePriority }: OrderHeaderProps) {
  const [estimatedDelivery, setEstimatedDelivery] = useState(
    new Date(order.estimated_delivery_time)
  );

  const getStatusColor = () => {
    switch (order.status) {
      case "pending": return "bg-blue-100 text-blue-800";
      case "preparing": return "bg-yellow-100 text-yellow-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = () => {
    switch (order.priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "high": return "bg-amber-100 text-amber-800";
      case "rush": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const handlePriorityChange = (priority: KitchenOrder["priority"]) => {
    onUpdatePriority(order.id, priority);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-lg">Order #{order.order_id}</h3>
          <Badge className={getStatusColor()}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Badge className={getPriorityColor()}>
            {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
          </Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>Table {order.tableNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>Server: {order.serverName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Expected: {format(estimatedDelivery, 'h:mm a')}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 sm:mt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              Update Priority <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
              <Badge variant="outline" className="bg-gray-100 mr-2">Low</Badge>
              Normal service
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('normal')}>
              <Badge variant="outline" className="bg-blue-100 mr-2">Normal</Badge>
              Standard priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
              <Badge variant="outline" className="bg-amber-100 mr-2">High</Badge>
              Expedite service
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handlePriorityChange('rush')}>
              <Badge variant="outline" className="bg-red-100 mr-2">Rush</Badge>
              Immediate attention
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
