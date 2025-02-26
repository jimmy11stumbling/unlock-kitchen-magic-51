
import { useState } from "react";
import type { TableLayout, Order, MenuItem, KitchenOrder, KitchenOrderItem } from "@/types/staff";

export const useTableState = () => {
  const [tables, setTables] = useState<TableLayout[]>([]);
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

    const createKitchenOrder = (orderId: number, items: any[]) => {
      const kitchenItems: KitchenOrderItem[] = items.map((item, index) => ({
        id: index + 1,
        name: `Item ${item.menuItemId}`,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        status: "pending",
        cookingStation: item.cookingStation || "grill",
        assignedChef: item.assignedChef || "",
        modifications: item.modifications || [],
        allergenAlert: item.allergenAlert || false
      }));

      const kitchenOrder: KitchenOrder = {
        id: kitchenOrders.length + 1,
        orderId: order.id,
        tableNumber: order.tableNumber,
        items: kitchenItems,
        status: "pending",
        priority: "normal",
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
        createdAt: new Date().toISOString()
      };

      setKitchenOrders([...kitchenOrders, kitchenOrder]);
      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: "preparing" } : o
      ));
    };

    createKitchenOrder(orderId, order.items);
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
