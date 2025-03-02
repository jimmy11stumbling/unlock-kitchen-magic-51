
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  category: string;
  reorderPoint?: number;
  idealStockLevel?: number;
  description?: string;
  sku?: string;
  location?: string;
  categoryId?: string;
  supplierId?: string;
}

export interface InventoryHistory {
  id: string;
  itemId: number;
  action: string;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  createdAt: string;
  notes?: string;
}
