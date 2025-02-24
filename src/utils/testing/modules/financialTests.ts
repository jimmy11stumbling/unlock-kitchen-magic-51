
import { supabase } from "@/integrations/supabase/client";

export const runFinancialTests = async () => {
  console.log("\n💰 Testing Financial Systems...");
  
  try {
    // Test Revenue Tracking
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        id,
        total,
        subtotal,
        tax,
        tip,
        created_at,
        payment_status,
        payment_method
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error("❌ Revenue tracking test failed:", ordersError.message);
      return false;
    }

    // Calculate revenue metrics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const avgOrderValue = totalRevenue / (orders?.length || 1);
    const tipTotal = orders?.reduce((sum, order) => sum + (order.tip || 0), 0) || 0;
    const taxTotal = orders?.reduce((sum, order) => sum + (order.tax || 0), 0) || 0;

    console.log("✅ Revenue Metrics:");
    console.log(`   - Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`   - Average Order Value: $${avgOrderValue.toFixed(2)}`);
    console.log(`   - Total Tips: $${tipTotal.toFixed(2)}`);
    console.log(`   - Total Tax Collected: $${taxTotal.toFixed(2)}`);

    // Test Cost Analysis
    const { data: expenses, error: expensesError } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense');

    if (expensesError) {
      console.error("❌ Cost analysis test failed:", expensesError.message);
      return false;
    }

    // Calculate expense metrics
    const totalExpenses = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const expensesByCategory = expenses?.reduce((acc, exp) => {
      acc[exp.category_id] = (acc[exp.category_id] || 0) + (exp.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    console.log("\n✅ Cost Analysis:");
    console.log(`   - Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log("   - Expenses by Category:", expensesByCategory);

    // Test Labor Costs
    const { data: timeEntries, error: timeError } = await supabase
      .from('time_entries')
      .select(`
        *,
        staff_members (
          hourly_rate,
          overtime_rate
        )
      `);

    if (timeError) {
      console.error("❌ Labor cost analysis test failed:", timeError.message);
      return false;
    }

    // Calculate labor costs
    const laborCosts = timeEntries?.reduce((sum, entry) => {
      const regularHours = entry.total_hours || 0;
      const overtimeHours = Math.max(0, regularHours - 8);
      const regularRate = entry.staff_members?.hourly_rate || 0;
      const overtimeRate = entry.staff_members?.overtime_rate || (regularRate * 1.5);
      
      return sum + 
        ((regularHours - overtimeHours) * regularRate) + 
        (overtimeHours * overtimeRate);
    }, 0) || 0;

    console.log("\n✅ Labor Costs:");
    console.log(`   - Total Labor Cost: $${laborCosts.toFixed(2)}`);

    // Test Profit Margins
    const grossProfit = totalRevenue - totalExpenses - laborCosts;
    const grossProfitMargin = (grossProfit / totalRevenue) * 100;
    const operatingProfit = grossProfit - (expenses?.reduce((sum, exp) => 
      sum + (exp.category_id === 'overhead' ? exp.amount : 0), 0) || 0);
    const operatingProfitMargin = (operatingProfit / totalRevenue) * 100;

    console.log("\n✅ Profit Analysis:");
    console.log(`   - Gross Profit: $${grossProfit.toFixed(2)}`);
    console.log(`   - Gross Profit Margin: ${grossProfitMargin.toFixed(2)}%`);
    console.log(`   - Operating Profit: $${operatingProfit.toFixed(2)}`);
    console.log(`   - Operating Profit Margin: ${operatingProfitMargin.toFixed(2)}%`);

    // Test Payment Methods Distribution
    const paymentMethodsDistribution = orders?.reduce((acc, order) => {
      acc[order.payment_method || 'unknown'] = (acc[order.payment_method || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\n✅ Payment Methods Distribution:");
    console.log("   - Methods:", paymentMethodsDistribution);

    return true;
  } catch (error) {
    console.error("❌ Financial tests failed:", error);
    return false;
  }
};
