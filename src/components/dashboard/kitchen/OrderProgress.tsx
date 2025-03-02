
import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { format, differenceInSeconds } from "date-fns";
import type { KitchenOrderItem } from "@/types/staff";

interface OrderProgressProps {
  items: KitchenOrderItem[];
  createdAt: string;
  estimatedDeliveryTime: string;
}

export function OrderProgress({ items, createdAt, estimatedDeliveryTime }: OrderProgressProps) {
  const progress = useMemo(() => {
    const totalItems = items.length;
    const completedItems = items.filter(
      item => item.status === 'ready' || item.status === 'delivered'
    ).length;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [items]);
  
  const timeProgress = useMemo(() => {
    const start = new Date(createdAt).getTime();
    const end = new Date(estimatedDeliveryTime).getTime();
    const now = new Date().getTime();
    
    if (now >= end) return 100;
    
    return Math.min(100, Math.round(((now - start) / (end - start)) * 100));
  }, [createdAt, estimatedDeliveryTime]);
  
  const timeLeft = useMemo(() => {
    const endTime = new Date(estimatedDeliveryTime);
    const now = new Date();
    
    if (now > endTime) return "Overdue";
    
    const diffSeconds = differenceInSeconds(endTime, now);
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [estimatedDeliveryTime]);
  
  const progressColor = useMemo(() => {
    if (progress >= 100) return "text-green-500";
    if (timeProgress > 90 && progress < 80) return "text-red-500";
    if (timeProgress > 70 && progress < 60) return "text-yellow-500";
    return "text-muted-foreground";
  }, [progress, timeProgress]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Order Progress</span>
        <span className={`text-sm font-medium ${progressColor}`}>
          {progress}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">Time Remaining</span>
        <span className={`text-sm font-medium ${
          timeProgress >= 100 ? "text-red-500" : timeProgress > 80 ? "text-yellow-500" : "text-muted-foreground"
        }`}>
          {timeLeft}
        </span>
      </div>
      <Progress value={timeProgress} className={`h-2 ${
        timeProgress >= 100 ? "bg-red-100" : timeProgress > 80 ? "bg-yellow-100" : ""
      }`} />
    </div>
  );
}
