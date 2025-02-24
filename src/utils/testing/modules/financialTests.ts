
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
        payment_method,
        items
      `)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error("❌ Revenue tracking test failed:", ordersError.message);
      return false;
    }

    // Validate order data integrity
    const invalidOrders = orders?.filter(order => {
      const hasInvalidTotal = !order.total || order.total < 0;
      const hasInvalidTax = order.tax < 0;
      const hasInvalidTip = order.tip < 0;
      const missingPaymentStatus = !order.payment_status;
      const missingItems = !order.items || !Array.isArray(order.items) || order.items.length === 0;
      
      if (hasInvalidTotal || hasInvalidTax || hasInvalidTip || missingPaymentStatus || missingItems) {
        console.warn(`⚠️ Invalid order data detected - Order ID: ${order.id}`);
        return true;
      }
      return false;
    });

    if (invalidOrders && invalidOrders.length > 0) {
      console.error(`❌ Found ${invalidOrders.length} orders with invalid data`);
    }

    // Calculate comprehensive revenue metrics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const avgOrderValue = totalRevenue / (orders?.length || 1);
    const tipTotal = orders?.reduce((sum, order) => sum + (order.tip || 0), 0) || 0;
    const taxTotal = orders?.reduce((sum, order) => sum + (order.tax || 0), 0) || 0;
    const tipPercentage = (tipTotal / totalRevenue) * 100;
    const taxPercentage = (taxTotal / totalRevenue) * 100;

    // Revenue trends
    const revenueByDay = orders?.reduce((acc, order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + (order.total || 0);
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Revenue Metrics:");
    console.log(`   - Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`   - Average Order Value: $${avgOrderValue.toFixed(2)}`);
    console.log(`   - Total Tips: $${tipTotal.toFixed(2)} (${tipPercentage.toFixed(2)}%)`);
    console.log(`   - Total Tax: $${taxTotal.toFixed(2)} (${taxPercentage.toFixed(2)}%)`);
    console.log("   - Daily Revenue Trend:", revenueByDay);

    // Test Cost Analysis with comprehensive validation
    const { data: expenses, error: expensesError } = await supabase
      .from('financial_transactions')
      .select('*, categories(*)')
      .eq('type', 'expense');

    if (expensesError) {
      console.error("❌ Cost analysis test failed:", expensesError.message);
      return false;
    }

    // Validate expense data integrity
    const invalidExpenses = expenses?.filter(expense => {
      const hasInvalidAmount = !expense.amount || expense.amount < 0;
      const missingCategory = !expense.category_id;
      const missingDate = !expense.date;
      
      if (hasInvalidAmount || missingCategory || missingDate) {
        console.warn(`⚠️ Invalid expense data detected - ID: ${expense.id}`);
        return true;
      }
      return false;
    });

    if (invalidExpenses && invalidExpenses.length > 0) {
      console.error(`❌ Found ${invalidExpenses.length} expenses with invalid data`);
    }

    // Calculate expense metrics
    const totalExpenses = expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0;
    const expensesByCategory = expenses?.reduce((acc, exp) => {
      acc[exp.category_id] = (acc[exp.category_id] || 0) + (exp.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    // Monthly expense trends
    const expensesByMonth = expenses?.reduce((acc, exp) => {
      const month = new Date(exp.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (exp.amount || 0);
      return acc;
    }, {} as Record<string, number>);

    console.log("\n✅ Cost Analysis:");
    console.log(`   - Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log("   - Expenses by Category:", expensesByCategory);
    console.log("   - Monthly Expense Trend:", expensesByMonth);

    // Test Labor Costs with comprehensive validation
    const { data: timeEntries, error: timeError } = await supabase
      .from('time_entries')
      .select(`
        *,
        staff_members (
          hourly_rate,
          overtime_rate,
          role,
          department
        )
      `);

    if (timeError) {
      console.error("❌ Labor cost analysis test failed:", timeError.message);
      return false;
    }

    // Validate time entry data
    const invalidTimeEntries = timeEntries?.filter(entry => {
      const hasInvalidHours = !entry.total_hours || entry.total_hours < 0;
      const missingStaffRate = !entry.staff_members?.hourly_rate;
      const invalidDates = entry.clock_out && entry.clock_in && 
                          new Date(entry.clock_out) <= new Date(entry.clock_in);
      
      if (hasInvalidHours || missingStaffRate || invalidDates) {
        console.warn(`⚠️ Invalid time entry detected - ID: ${entry.id}`);
        return true;
      }
      return false;
    });

    if (invalidTimeEntries && invalidTimeEntries.length > 0) {
      console.error(`❌ Found ${invalidTimeEntries.length} time entries with invalid data`);
    }

    // Calculate detailed labor costs
    const laborCostsByDepartment = timeEntries?.reduce((acc, entry) => {
      const dept = entry.staff_members?.department || 'unknown';
      const regularHours = Math.min(entry.total_hours || 0, 8);
      const overtimeHours = Math.max(0, (entry.total_hours || 0) - 8);
      const regularRate = entry.staff_members?.hourly_rate || 0;
      const overtimeRate = entry.staff_members?.overtime_rate || (regularRate * 1.5);
      
      const cost = (regularHours * regularRate) + (overtimeHours * overtimeRate);
      acc[dept] = (acc[dept] || 0) + cost;
      return acc;
    }, {} as Record<string, number>);

    const totalLaborCosts = Object.values(laborCostsByDepartment || {}).reduce((sum, cost) => sum + cost, 0);
    const laborCostPercentage = (totalLaborCosts / totalRevenue) * 100;

    console.log("\n✅ Labor Costs:");
    console.log(`   - Total Labor Cost: $${totalLaborCosts.toFixed(2)}`);
    console.log(`   - Labor Cost as % of Revenue: ${laborCostPercentage.toFixed(2)}%`);
    console.log("   - Labor Costs by Department:", laborCostsByDepartment);

    // Comprehensive Profit Analysis
    const grossProfit = totalRevenue - totalExpenses - totalLaborCosts;
    const grossProfitMargin = (grossProfit / totalRevenue) * 100;
    const operatingExpenses = expenses?.reduce((sum, exp) => 
      sum + (exp.category_id === 'overhead' ? exp.amount : 0), 0) || 0;
    const operatingProfit = grossProfit - operatingExpenses;
    const operatingProfitMargin = (operatingProfit / totalRevenue) * 100;
    const cashFlow = totalRevenue - totalExpenses - totalLaborCosts - operatingExpenses;

    console.log("\n✅ Profit Analysis:");
    console.log(`   - Gross Profit: $${grossProfit.toFixed(2)}`);
    console.log(`   - Gross Profit Margin: ${grossProfitMargin.toFixed(2)}%`);
    console.log(`   - Operating Profit: $${operatingProfit.toFixed(2)}`);
    console.log(`   - Operating Profit Margin: ${operatingProfitMargin.toFixed(2)}%`);
    console.log(`   - Cash Flow: $${cashFlow.toFixed(2)}`);

    // Financial Health Indicators
    const quickRatio = totalRevenue / totalExpenses;
    const operatingMargin = operatingProfit / totalRevenue;
    const laborCostRatio = totalLaborCosts / totalRevenue;
    
    console.log("\n✅ Financial Health Indicators:");
    console.log(`   - Quick Ratio: ${quickRatio.toFixed(2)}`);
    console.log(`   - Operating Margin: ${operatingMargin.toFixed(2)}`);
    console.log(`   - Labor Cost Ratio: ${laborCostRatio.toFixed(2)}`);

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
