
import { supabase } from "@/integrations/supabase/client";

export const runKitchenTests = async () => {
  console.log("\n👨‍🍳 Testing Kitchen Systems...");
  
  try {
    // Test Kitchen Order Flow
    const { data: kitchenOrders, error: kitchenError } = await supabase
      .from('kitchen_orders')
      .select(`
        *,
        orders (
          table_number,
          server_name,
          status
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (kitchenError) {
      console.error("❌ Kitchen order flow test failed:", kitchenError.message);
      return false;
    }

    const ordersByStatus = kitchenOrders?.reduce((acc, order) => {
      const status = order.items?.[0]?.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Kitchen Order Flow Status:");
    console.log("   - Order status distribution:", ordersByStatus);
    console.log(`   - Active orders: ${kitchenOrders?.length}`);

    return true;
  } catch (error) {
    console.error("❌ Kitchen tests failed:", error);
    return false;
  }
};
