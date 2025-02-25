
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface KitchenOrderItem {
  menuItemId: number;
  itemName: string;
  quantity: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  startTime?: string;
  completionTime?: string;
  cookingStation: string;
  assignedChef: string;
  modifications: string[];
  allergenAlert: boolean;
}

export interface Database {
  public: {
    Tables: {
      kitchen_orders: {
        Row: {
          id: number;
          order_id: number | null;
          items: KitchenOrderItem[];
          priority: 'normal' | 'rush' | 'high';
          notes: string | null;
          coursing: 'standard' | 'appetizers first' | 'serve together';
          created_at: string;
          updated_at: string;
          estimated_delivery_time: string;
          table_number: number | null;
          server_name: string | null;
          status: 'pending' | 'preparing' | 'ready' | 'delivered';
        };
        Insert: Omit<Database['public']['Tables']['kitchen_orders']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['kitchen_orders']['Row']>;
      };
    };
  };
}
