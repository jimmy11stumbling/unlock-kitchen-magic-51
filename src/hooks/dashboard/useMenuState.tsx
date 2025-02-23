
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { MenuItem, TableLayout } from "@/types/staff";

export const useMenuState = () => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<TableLayout[]>([]);

  const addMenuItem = (item: Omit<MenuItem, "id">) => {
    const newItem: MenuItem = {
      id: menuItems.length + 1,
      ...item,
    };
    setMenuItems([...menuItems, newItem]);
    toast({
      title: "Menu updated",
      description: `${item.name} has been added to the menu.`,
    });
  };

  const updateMenuItemAvailability = (itemId: number, available: boolean) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, available } : item
    ));
    toast({
      title: "Menu item updated",
      description: `Item availability has been updated.`,
    });
  };

  const updateMenuItemPrice = (itemId: number, price: number) => {
    setMenuItems(menuItems.map(item =>
      item.id === itemId ? { ...item, price } : item
    ));
    toast({
      title: "Price updated",
      description: `Item price has been updated.`,
    });
  };

  const addTable = (table: Omit<TableLayout, "id">) => {
    const newTable: TableLayout = {
      id: tables.length + 1,
      ...table,
    };
    setTables([...tables, newTable]);
    toast({
      title: "Table added",
      description: `Table ${table.number} has been added.`,
    });
  };

  const updateTableStatus = (tableId: number, status: TableLayout["status"]) => {
    setTables(tables.map(table =>
      table.id === tableId ? { ...table, status } : table
    ));
    toast({
      title: "Table status updated",
      description: `Table status has been updated to ${status}.`,
    });
  };

  return {
    menuItems,
    tables,
    addMenuItem,
    updateMenuItemAvailability,
    updateMenuItemPrice,
    addTable,
    updateTableStatus,
  };
};
