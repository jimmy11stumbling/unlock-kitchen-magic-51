
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  category: string;
  current_stock: number;
  reorder_point: number;
  supplier_id?: string;
  last_ordered?: string;
  last_received?: string;
}
