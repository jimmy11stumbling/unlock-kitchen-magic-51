
import { supabase } from "@/integrations/supabase/client";

export const runMenuTests = async () => {
  console.log("\n🍽️ Testing Menu System...");
  
  try {
    const { data: menuItems, error: menuError } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_item_ingredients (
          ingredient_id,
          quantity,
          unit
        )
      `);

    if (menuError) {
      console.error("❌ Menu system test failed:", menuError.message);
      return false;
    }

    const activeItems = menuItems?.filter(item => item.available).length;
    console.log("✅ Menu System Status:");
    console.log(`   - Total items: ${menuItems?.length}`);
    console.log(`   - Active items: ${activeItems}`);
    console.log(`   - Categories: ${new Set(menuItems?.map(item => item.category)).size}`);
    
    return true;
  } catch (error) {
    console.error("❌ Menu tests failed:", error);
    return false;
  }
};
