
import type { MenuItem } from "@/types/staff";

export interface MenuItemFormData extends Omit<MenuItem, "id" | "orderCount"> {
  id?: number;
  imageFile?: File;
}

export interface MenuPanelProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Omit<MenuItem, "id">, imageFile?: File) => void;
  onUpdateAvailability: (itemId: number, available: boolean) => void;
  onUpdatePrice: (itemId: number, price: number) => void;
  onDeleteMenuItem?: (itemId: number) => void;
  onUpdateMenuItem?: (itemId: number, item: Partial<MenuItem>, imageFile?: File) => void;
}
