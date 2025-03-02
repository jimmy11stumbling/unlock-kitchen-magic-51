
import React from 'react';
import { Progress } from '@/components/ui/progress';
import type { KitchenOrderItem } from '@/types/staff';

interface OrderProgressProps {
  items: KitchenOrderItem[];
  createdAt: string;
  estimatedDeliveryTime: string;
}

export function OrderProgress({ items, createdAt, estimatedDeliveryTime }: OrderProgressProps) {
  // Calculate progress percentage
  const totalItems = items.length;
  const completeItems = items.filter(i => i.status === 'ready').length;
  const preparingItems = items.filter(i => i.status === 'preparing').length;
  
  const progressPercentage = Math.floor((completeItems + (preparingItems * 0.5)) / totalItems * 100);
  
  // Calculate time elapsed/remaining
  const startTime = new Date(createdAt).getTime();
  const endTime = new Date(estimatedDeliveryTime).getTime();
  const now = new Date().getTime();
  
  const totalDuration = endTime - startTime;
  const elapsed = now - startTime;
  const timeProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span>Order Progress</span>
        <span>{progressPercentage}% Complete</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      
      <div className="flex justify-between text-xs mt-3">
        <span>Time Progress</span>
        <span>{timeProgress}%</span>
      </div>
      <Progress 
        value={timeProgress} 
        className="h-2" 
        color={timeProgress > 90 ? "bg-red-500" : ""}
      />
    </div>
  );
}
