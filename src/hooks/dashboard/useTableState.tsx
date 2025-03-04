import { useState } from "react";
import type { TableLayout, Order, MenuItem, KitchenOrder } from "@/types/staff";

const initialTables: TableLayout[] = [
  { id: 1, number: 1, capacity: 4, status: "occupied", section: "indoor", activeOrder: null },
  { id: 2, number: 2, capacity: 2, status: "available", section: "indoor", activeOrder: null },
  { id: 3, number: 3, capacity: 6, status: "reserved", section: "outdoor", activeOrder: null },
  { id: 4, number: 4, capacity: 4, status: "available", section: "outdoor", activeOrder: null },
  { id: 5, number: 5, capacity: 8, status: "occupied", section: "indoor", activeOrder: null },
  { id: 6, number: 6, capacity: 2, status: "available", section: "bar", activeOrder: null },
  { id: 7, number: 7, capacity: 4, status: "occupied", section: "bar", activeOrder: null },
  { id: 8, number: 8, capacity: 6, status: "available", section: "outdoor", activeOrder: null }
];

export const useTableState = () => {
  const [tables, setTables] = useState<TableLayout[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);

  const addTable = (table: Omit<TableLayout, "id">) => {
    const newTable: TableLayout = {
      ...table,
      id: tables.length + 1,
      activeOrder: null,
    };
    setTables([...tables, newTable]);
  };

  const updateTableStatus = (tableId: number, status: TableLayout["status"]) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  const startOrder = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.status !== "occupied") return;

    const newOrder: Order = {
      id: orders.length + 1,
      tableNumber: table.number,
      items: [],
      status: "pending",
      total: 0,
      timestamp: new Date().toISOString(),
      serverName: "Server", // This will be updated when we add staff integration
      guestCount: table.capacity,
      estimatedPrepTime: 0,
    };

    setOrders([...orders, newOrder]);
    setTables(tables.map(t => 
      t.id === tableId ? { ...t, activeOrder: newOrder.id } : t
    ));

    return newOrder.id;
  };

  const updateOrder = (orderId: number, items: Order['items']) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...order, items, total };
      }
      return order;
    }));
  };

  const sendToKitchen = (orderId: number) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const kitchenOrder: KitchenOrder = {
      id: kitchenOrders.length + 1,
      orderId: order.id,
      tableNumber: order.tableNumber,
      serverName: order.serverName,
      status: "new",
      timestamp: new Date().toISOString(),
      estimatedPrepTime: 30,
      specialInstructions: order.specialInstructions,
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        status: "pending",
        cookingStation: "main",
        assignedChef: "",
        modifications: [],
        allergenAlert: false,
        menuItemId: item.id
      })),
      priority: "normal",
      notes: "",
      coursing: "standard",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 minutes from now
    };

    setKitchenOrders([...kitchenOrders, kitchenOrder]);
    setOrders(orders.map(o => 
      o.id === orderId ? { ...o, status: "preparing" } : o
    ));
  };

  const getTableOrders = () => {
    return tables
      .filter(table => table.activeOrder !== null)
      .map(table => {
        const order = orders.find(o => o.id === table.activeOrder);
        return {
          tableId: table.id,
          tableNumber: table.number,
          section: table.section,
          order,
        };
      });
  };

  return {
    tables,
    orders,
    kitchenOrders,
    addTable,
    updateTableStatus,
    startOrder,
    updateOrder,
    sendToKitchen,
    getTableOrders,
  };
};
