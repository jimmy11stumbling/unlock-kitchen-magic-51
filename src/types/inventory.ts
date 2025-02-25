
export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  price: number;
  category: string;
  supplier?: string;
  lastRestocked?: string;
  expirationDate?: string;
}

export interface InventoryTransaction {
  id: number;
  itemId: number;
  type: 'restock' | 'usage' | 'waste' | 'adjustment';
  quantity: number;
  date: string;
  notes?: string;
}
