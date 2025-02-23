
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  tableNumber: number;
  guestCount: number;
  items: OrderItem[];
  specialInstructions?: string;
  serverName: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: orderData } = await req.json() as { data: OrderData }
    
    // Calculate total
    const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    // Calculate estimated prep time (basic algorithm)
    const estimatedPrepTime = Math.max(...orderData.items.map(item => 15 * item.quantity))

    // Insert order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert([{
        table_number: orderData.tableNumber,
        guest_count: orderData.guestCount,
        items: orderData.items,
        status: 'pending',
        total,
        server_name: orderData.serverName,
        special_instructions: orderData.specialInstructions,
        estimated_prep_time: estimatedPrepTime
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // Determine order priority
    const priority = orderData.specialInstructions?.toLowerCase().includes('vip') 
      ? 'rush' 
      : orderData.items.length > 4 
        ? 'high' 
        : 'normal'

    // Insert kitchen order
    const { error: kitchenError } = await supabaseClient
      .from('kitchen_orders')
      .insert([{
        order_id: order.id,
        items: orderData.items.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          status: 'pending'
        })),
        priority,
        notes: orderData.specialInstructions,
        coursing: 'standard',
        estimated_delivery_time: new Date(Date.now() + estimatedPrepTime * 60000).toISOString()
      }])

    if (kitchenError) throw kitchenError

    return new Response(
      JSON.stringify({ success: true, data: order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
