
import { supabase } from "@/integrations/supabase/client";

export const runTableTests = async () => {
  console.log("\n🪑 Testing Table Management System...");
  
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .order('number');

    if (tablesError) {
      console.error("❌ Table system test failed:", tablesError.message);
      return false;
    }

    const availableTables = tables?.filter(t => t.status === 'available').length;
    const occupiedTables = tables?.filter(t => t.status === 'occupied').length;
    console.log("✅ Tables Status:");
    console.log(`   - Total tables: ${tables?.length}`);
    console.log(`   - Available: ${availableTables}`);
    console.log(`   - Occupied: ${occupiedTables}`);
    
    return true;
  } catch (error) {
    console.error("❌ Table tests failed:", error);
    return false;
  }
};
