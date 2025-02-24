
import { supabase } from "@/integrations/supabase/client";

export const runPerformanceTests = async () => {
  console.log("\n📊 Testing System Performance...");
  
  try {
    const startTime = new Date();
    const [
      ordersCount,
      kitchenOrdersCount,
      staffCount,
      ingredientsCount
    ] = await Promise.all([
      supabase.from('orders').select('count').single(),
      supabase.from('kitchen_orders').select('count').single(),
      supabase.from('staff_members').select('count').single(),
      supabase.from('ingredients').select('count').single()
    ]);

    if (ordersCount.error || kitchenOrdersCount.error || staffCount.error || ingredientsCount.error) {
      console.error("❌ Performance metrics test failed:", 
        ordersCount.error || 
        kitchenOrdersCount.error || 
        staffCount.error || 
        ingredientsCount.error
      );
      return false;
    }

    const endTime = new Date();
    const queryTime = endTime.getTime() - startTime.getTime();
    console.log("✅ Performance Metrics:");
    console.log(`   - Database query time: ${queryTime}ms`);
    console.log(`   - System response: ${queryTime < 1000 ? 'Good' : 'Slow'}`);
    console.log(`   - Total orders: ${ordersCount.data?.count || 0}`);
    console.log(`   - Kitchen orders: ${kitchenOrdersCount.data?.count || 0}`);
    console.log(`   - Staff members: ${staffCount.data?.count || 0}`);
    console.log(`   - Inventory items: ${ingredientsCount.data?.count || 0}`);
    
    return true;
  } catch (error) {
    console.error("❌ Performance tests failed:", error);
    return false;
  }
};
