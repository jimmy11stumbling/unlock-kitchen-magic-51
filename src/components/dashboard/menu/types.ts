
import type { MenuItem } from "@/types";

export interface MenuItemFormData extends Omit<MenuItem, "id" | "orderCount"> {
  id?: number;
}

export interface MenuPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onDeleteMenuItem?: (itemId: number) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>) => void;
}
