
import { supabase } from "@/integrations/supabase/client";

export const runInventoryTests = async () => {
  console.log("\n📦 Testing Inventory Management System...");
  
  try {
    const { data: inventory, error: inventoryError } = await supabase
      .from('ingredients')
      .select('*');

    if (inventoryError) {
      console.error("❌ Inventory management test failed:", inventoryError.message);
      return false;
    }

    const lowStock = inventory?.filter(item => item.current_stock <= item.minimum_stock);
    const totalValue = inventory?.reduce((sum, item) => 
      sum + (item.current_stock * item.cost_per_unit), 0);
    
    console.log("✅ Inventory System Status:");
    console.log(`   - Total items: ${inventory?.length}`);
    console.log(`   - Low stock alerts: ${lowStock?.length}`);
    console.log(`   - Total inventory value: $${totalValue?.toFixed(2)}`);
    
    return true;
  } catch (error) {
    console.error("❌ Inventory tests failed:", error);
    return false;
  }
};
