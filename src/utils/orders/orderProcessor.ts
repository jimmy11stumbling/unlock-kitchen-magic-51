
import type { Order, OrderItem } from '@/types/staff/orders';
import type { KitchenOrder, KitchenOrderItem } from '@/types/staff/kitchen';

export function createKitchenOrderItems(orderItems: OrderItem[]): KitchenOrderItem[] {
  return orderItems.map(item => ({
    id: Math.floor(Math.random() * 10000),
    menuItemId: item.id,
    name: item.name,
    quantity: item.quantity,
    status: 'pending',
    cookingStation: item.station || 'main',
    notes: item.notes || ''
  }));
}

export function createKitchenOrder(order: Order): KitchenOrder {
  return {
    id: Math.floor(Math.random() * 10000),
    orderId: order.id,
    tableNumber: order.tableNumber,
    serverName: order.serverName,
    items: createKitchenOrderItems(order.items),
    status: 'pending',
    priority: 'normal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + order.estimatedPrepTime * 60000).toISOString(),
    coursing: ''
  };
}
