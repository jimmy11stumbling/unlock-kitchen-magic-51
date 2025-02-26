
import { useState, useEffect } from 'react';
import type { KitchenOrder, KitchenOrderItem } from '@/types/staff';

export const useKitchenOrders = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [activeStation, setActiveStation] = useState<string>('all');

  const filterOrdersByStation = (orders: KitchenOrder[]) => {
    if (activeStation === 'all') return orders;
    
    return orders.filter(order => 
      order.items.some(item => 
        item.cooking_station === activeStation
      )
    );
  };

  const groupOrdersByStation = (orders: KitchenOrder[]) => {
    const grouped = new Map<string, KitchenOrder[]>();
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.cooking_station) {
          const station = item.cooking_station;
          if (!grouped.has(station)) {
            grouped.set(station, []);
          }
          if (!grouped.get(station)?.includes(order)) {
            grouped.get(station)?.push(order);
          }
        }
      });
    });
    
    return grouped;
  };

  return {
    orders,
    setOrders,
    activeStation,
    setActiveStation,
    filteredOrders: filterOrdersByStation(orders),
    groupedOrders: groupOrdersByStation(orders)
  };
};
