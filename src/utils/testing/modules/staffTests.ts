
import { supabase } from "@/integrations/supabase/client";

export const runStaffTests = async () => {
  console.log("\n👥 Testing Staff Systems...");
  
  try {
    // Test Staff Communication
    const { data: staff, error: staffError } = await supabase
      .from('staff_members')
      .select(`
        *,
        time_entries (
          clock_in,
          clock_out,
          total_hours
        )
      `);

    if (staffError) {
      console.error("❌ Staff system test failed:", staffError.message);
      return false;
    }

    const activeStaff = staff?.filter(s => s.status === 'active');
    const departments = new Set(staff?.map(s => s.department));
    console.log("✅ Staff System Status:");
    console.log(`   - Total staff: ${staff?.length}`);
    console.log(`   - Active staff: ${activeStaff?.length}`);
    console.log(`   - Departments: ${departments.size}`);

    // Test Staff Performance
    const avgPerformance = staff?.reduce((sum, s) => sum + (s.performance_rating || 0), 0) / (staff?.length || 1);
    console.log(`   - Average performance rating: ${avgPerformance.toFixed(2)}/5`);

    return true;
  } catch (error) {
    console.error("❌ Staff tests failed:", error);
    return false;
  }
};
