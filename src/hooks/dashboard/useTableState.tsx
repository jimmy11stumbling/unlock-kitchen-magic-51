
import { useState } from "react";
import type { TableLayout, Order } from "@/types/staff";

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
    addTable,
    updateTableStatus,
    startOrder,
    getTableOrders,
  };
};
