
import { useState } from "react";
import type { TableLayout } from "@/types/staff";

const initialTables: TableLayout[] = [
  { id: 1, number: 1, capacity: 4, status: "occupied" },
  { id: 2, number: 2, capacity: 2, status: "available" },
  { id: 3, number: 3, capacity: 6, status: "reserved" },
  { id: 4, number: 4, capacity: 4, status: "available" },
  { id: 5, number: 5, capacity: 8, status: "occupied" },
  { id: 6, number: 6, capacity: 2, status: "available" },
  { id: 7, number: 7, capacity: 4, status: "occupied" },
  { id: 8, number: 8, capacity: 6, status: "available" }
];

export const useTableState = () => {
  const [tables, setTables] = useState<TableLayout[]>(initialTables);

  const addTable = (table: Omit<TableLayout, "id">) => {
    const newTable: TableLayout = {
      ...table,
      id: tables.length + 1,
    };
    setTables([...tables, newTable]);
  };

  const updateTableStatus = (tableId: number, status: TableLayout["status"]) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status } : table
    ));
  };

  return {
    tables,
    addTable,
    updateTableStatus,
  };
};
