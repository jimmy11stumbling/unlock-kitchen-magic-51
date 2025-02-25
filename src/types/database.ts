
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      kitchen_orders: {
        Row: {
          id: number;
          order_id: number | null;
          items: Json;
          priority: string;
          notes: string | null;
          coursing: string;
          created_at: string;
          updated_at: string;
          estimated_delivery_time: string;
          table_number: number | null;
          server_name: string | null;
          status: string;
        };
        Insert: {
          id?: number;
          order_id?: number | null;
          items: Json;
          priority: string;
          notes?: string | null;
          coursing: string;
          created_at?: string;
          updated_at?: string;
          estimated_delivery_time: string;
          table_number?: number | null;
          server_name?: string | null;
          status: string;
        };
        Update: {
          id?: number;
          order_id?: number | null;
          items?: Json;
          priority?: string;
          notes?: string | null;
          coursing?: string;
          created_at?: string;
          updated_at?: string;
          estimated_delivery_time?: string;
          table_number?: number | null;
          server_name?: string | null;
          status?: string;
        };
      };
    };
  };
}
