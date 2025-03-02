
export interface TableLayout {
  id: number;
  tableNumber: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  section: string;
  shape: 'round' | 'square' | 'rectangle' | 'custom';
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation?: number;
  notes?: string;
  serverAssigned?: number;
  currentOrderId?: number;
  // Adding properties that are used in the code
  number: number;
  capacity: number;
  activeOrder: number | null;
}
