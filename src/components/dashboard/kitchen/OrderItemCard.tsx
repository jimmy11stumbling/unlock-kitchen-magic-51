
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Play, 
  CheckCircle2, 
  Clock, 
  XCircle,
  AlertTriangle
} from "lucide-react";
import type { KitchenOrderItem } from "@/types/staff";

interface OrderItemCardProps {
  item: KitchenOrderItem;
  orderId: number;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function OrderItemCard({ item, orderId, onUpdateItemStatus }: OrderItemCardProps) {
  const [startTime, setStartTime] = useState<Date | null>(
    item.start_time ? new Date(item.start_time) : null
  );

  const getStatusColor = (status: KitchenOrderItem["status"]) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "preparing": return "bg-yellow-100 text-yellow-800";
      case "ready": return "bg-green-100 text-green-800";
      case "delivered": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    onUpdateItemStatus(orderId, item.id, 'preparing');
  };

  const handleComplete = () => {
    onUpdateItemStatus(orderId, item.id, 'ready');
  };

  const handleResetStatus = () => {
    setStartTime(null);
    onUpdateItemStatus(orderId, item.id, 'pending');
  };

  const handleStatusChange = (status: KitchenOrderItem["status"]) => {
    if (status === 'preparing' && !startTime) {
      setStartTime(new Date());
    }
    onUpdateItemStatus(orderId, item.id, status);
  };

  const getElapsedTime = () => {
    if (!startTime) return null;
    
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const chefs = [
    "John Doe",
    "Maria Garcia",
    "David Kim",
    "Sarah Johnson",
    "Ahmed Hassan"
  ];

  return (
    <Card className={`p-3 ${
      item.allergen_alert ? "border-red-300 bg-red-50" : ""
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">
              {item.name} {item.quantity > 1 && <span className="text-muted-foreground">× {item.quantity}</span>}
            </h4>
            <Badge className={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            {item.cooking_station && (
              <Badge variant="outline">
                {item.cooking_station.charAt(0).toUpperCase() + item.cooking_station.slice(1)}
              </Badge>
            )}
          </div>
          
          {item.notes && (
            <p className="text-sm mt-1 text-muted-foreground">
              <span className="font-medium">Notes:</span> {item.notes}
            </p>
          )}
          
          {item.allergen_alert && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertTriangle className="h-3 w-3" />
              <span className="font-medium">Allergen Alert:</span> 
              {item.allergens?.join(', ')}
            </div>
          )}
          
          {startTime && item.status === 'preparing' && (
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Elapsed: {getElapsedTime()}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          {item.status === 'pending' ? (
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 text-xs"
              onClick={handleStart}
            >
              <Play className="h-3 w-3" /> Start
            </Button>
          ) : item.status === 'preparing' ? (
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 text-xs bg-green-50 hover:bg-green-100 text-green-700"
              onClick={handleComplete}
            >
              <CheckCircle2 className="h-3 w-3" /> Complete
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 text-xs"
              onClick={handleResetStatus}
            >
              <XCircle className="h-3 w-3" /> Reset
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('preparing')}>
                Mark as Preparing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('ready')}>
                Mark as Ready
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange('delivered')}>
                Mark as Delivered
              </DropdownMenuItem>
              
              <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                Assign to Chef
              </DropdownMenuItem>
              {chefs.map(chef => (
                <DropdownMenuItem 
                  key={chef}
                  className="text-xs"
                  onClick={() => onUpdateItemStatus(orderId, item.id, item.status, chef)}
                >
                  {chef}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
