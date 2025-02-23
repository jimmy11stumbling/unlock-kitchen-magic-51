
import { useState } from "react";
import type { TableLayout } from "@/types/staff";

export const useTableState = () => {
  const [tables, setTables] = useState<TableLayout[]>([]);

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
