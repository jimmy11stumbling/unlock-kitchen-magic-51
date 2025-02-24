
import { supabase } from "@/integrations/supabase/client";

export const runOrderTests = async () => {
  console.log("\n🔄 Testing Order Processing System...");
  
  try {
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          menu_items (name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (ordersError) {
      console.error("❌ Order processing test failed:", ordersError.message);
      return false;
    }

    const pendingOrders = orders?.filter(o => o.status === 'pending').length;
    const completedOrders = orders?.filter(o => o.status === 'completed').length;
    const avgProcessingTime = orders?.reduce((sum, order) => {
      const start = new Date(order.created_at).getTime();
      const end = new Date(order.updated_at).getTime();
      return sum + (end - start) / (1000 * 60);
    }, 0) / (orders?.length || 1);

    console.log("✅ Order System Status:");
    console.log(`   - Total orders: ${orders?.length}`);
    console.log(`   - Pending: ${pendingOrders}`);
    console.log(`   - Completed: ${completedOrders}`);
    console.log(`   - Avg. processing time: ${avgProcessingTime.toFixed(2)} minutes`);
    
    return true;
  } catch (error) {
    console.error("❌ Order tests failed:", error);
    return false;
  }
};
