
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import type { KitchenOrderItem } from "@/types/staff";
import { useToast } from "@/components/ui/use-toast";

interface OrderProgressProps {
  items: KitchenOrderItem[];
  createdAt: string;
  estimatedDeliveryTime: string;
}

export function OrderProgress({ items, createdAt, estimatedDeliveryTime }: OrderProgressProps) {
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isDelayed, setIsDelayed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate progress based on items status
    const totalItems = items.length;
    if (totalItems === 0) return;

    const readyItems = items.filter(item => item.status === "ready").length;
    const preparingItems = items.filter(item => item.status === "preparing").length;
    
    // Weight ready items fully and preparing items partially
    const progress = ((readyItems * 1.0) + (preparingItems * 0.5)) / totalItems * 100;
    setProgressPercentage(Math.min(100, Math.round(progress)));

    // Calculate time remaining
    const startTime = new Date(createdAt).getTime();
    const estimatedTime = new Date(estimatedDeliveryTime).getTime();
    const currentTime = new Date().getTime();
    const totalDuration = estimatedTime - startTime;
    
    if (currentTime >= estimatedTime) {
      setIsDelayed(true);
      setTimeRemaining(Math.floor((currentTime - estimatedTime) / 60000)); // Minutes delayed
      
      if (!isDelayed) {
        // Only toast when status first changes to delayed
        toast({
          variant: "destructive",
          title: "Order Delayed",
          description: `Order is now delayed by ${Math.floor((currentTime - estimatedTime) / 60000)} minutes.`,
        });
      }
    } else {
      setIsDelayed(false);
      setTimeRemaining(Math.floor((estimatedTime - currentTime) / 60000)); // Minutes remaining
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      if (now >= estimatedTime) {
        if (!isDelayed) {
          toast({
            variant: "destructive",
            title: "Order Delayed",
            description: `Order is now delayed by ${Math.floor((now - estimatedTime) / 60000)} minutes.`,
          });
        }
        setIsDelayed(true);
        setTimeRemaining(Math.floor((now - estimatedTime) / 60000));
      } else {
        setTimeRemaining(Math.floor((estimatedTime - now) / 60000));
      }
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [items, createdAt, estimatedDeliveryTime, isDelayed, toast]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Progress value={progressPercentage} className="w-full max-w-xs" />
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
        
        {isDelayed && timeRemaining !== null ? (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Delayed by {timeRemaining}m
          </Badge>
        ) : timeRemaining !== null ? (
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Clock className="h-3 w-3" />
            {timeRemaining}m remaining
          </Badge>
        ) : null}
      </div>
      
      <div className="grid grid-cols-3 text-xs text-muted-foreground">
        <div>
          <strong>Pending:</strong> {items.filter(i => i.status === "pending").length}
        </div>
        <div>
          <strong>Preparing:</strong> {items.filter(i => i.status === "preparing").length}
        </div>
        <div>
          <strong>Ready:</strong> {items.filter(i => i.status === "ready").length}
        </div>
      </div>
    </div>
  );
}
