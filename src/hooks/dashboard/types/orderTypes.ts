
export type Json = string | number | boolean | { [key: string]: Json } | Json[];
export type OrderStatus = "pending" | "preparing" | "ready" | "delivered";

export interface DatabaseOrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface SupabaseOrder {
  created_at: string;
  estimated_prep_time: number;
  guest_count: number;
  id: number;
  items: Json;
  payment_method: string;
  payment_status: string;
  server_name: string;
  special_instructions: string;
  status: string;
  table_number: number;
  timestamp: string;
  total: number;
  updated_at: string;
}

export type NewSupabaseOrder = Omit<SupabaseOrder, 'id'>;
