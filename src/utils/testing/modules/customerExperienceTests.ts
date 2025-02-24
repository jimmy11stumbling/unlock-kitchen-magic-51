
import { supabase } from "@/integrations/supabase/client";

export const runCustomerExperienceTests = async () => {
  console.log("\n🎯 Testing Customer Experience Systems...");
  
  try {
    // Test Customer Order History
    const { data: customerOrders, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer_profiles (
          name,
          email,
          preferences
        ),
        customer_feedback (
          rating,
          comment,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (orderError) {
      console.error("❌ Customer order history test failed:", orderError.message);
      return false;
    }

    // Calculate order history metrics
    const ordersPerCustomer = customerOrders?.reduce((acc, order) => {
      const customerId = order.customer_id;
      if (customerId) {
        acc[customerId] = (acc[customerId] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const avgOrdersPerCustomer = Object.values(ordersPerCustomer || {}).reduce((sum, count) => 
      sum + count, 0) / (Object.keys(ordersPerCustomer || {}).length || 1);

    console.log("✅ Customer Order History:");
    console.log(`   - Total orders analyzed: ${customerOrders?.length}`);
    console.log(`   - Average orders per customer: ${avgOrdersPerCustomer.toFixed(2)}`);

    // Test Customer Preferences
    const { data: customerProfiles, error: profileError } = await supabase
      .from('customer_profiles')
      .select('*');

    if (profileError) {
      console.error("❌ Customer preferences test failed:", profileError.message);
      return false;
    }

    const preferencesAnalysis = customerProfiles?.reduce((acc, profile) => {
      const prefs = profile.preferences || {};
      Object.entries(prefs).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = {};
        acc[key][String(value)] = (acc[key][String(value)] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, Record<string, number>>);

    console.log("\n✅ Customer Preferences Analysis:");
    console.log(`   - Total profiles analyzed: ${customerProfiles?.length}`);
    console.log("   - Preference distribution:", preferencesAnalysis);

    // Test Customer Satisfaction
    const { data: feedback, error: feedbackError } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (feedbackError) {
      console.error("❌ Customer satisfaction test failed:", feedbackError.message);
      return false;
    }

    const avgRating = feedback?.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedback?.length || 1);
    const ratingDistribution = feedback?.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const responseTime = feedback?.reduce((sum, f) => {
      if (f.resolved_at && f.created_at) {
        const resolveTime = new Date(f.resolved_at).getTime() - new Date(f.created_at).getTime();
        return sum + resolveTime;
      }
      return sum;
    }, 0) / (feedback?.filter(f => f.resolved_at)?.length || 1);

    console.log("\n✅ Customer Satisfaction Metrics:");
    console.log(`   - Average rating: ${avgRating.toFixed(2)}/5`);
    console.log("   - Rating distribution:", ratingDistribution);
    console.log(`   - Average response time: ${(responseTime / (1000 * 60 * 60)).toFixed(2)} hours`);

    // Test Loyalty Program Performance
    const { data: loyaltyData, error: loyaltyError } = await supabase
      .from('loyalty_points')
      .select(`
        *,
        customer_profiles (name)
      `);

    if (loyaltyError) {
      console.error("❌ Loyalty program test failed:", loyaltyError.message);
      return false;
    }

    const tierDistribution = loyaltyData?.reduce((acc, l) => {
      acc[l.tier] = (acc[l.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgPoints = loyaltyData?.reduce((sum, l) => sum + (l.points || 0), 0) / (loyaltyData?.length || 1);

    console.log("\n✅ Loyalty Program Metrics:");
    console.log(`   - Total members: ${loyaltyData?.length}`);
    console.log(`   - Average points per member: ${avgPoints.toFixed(2)}`);
    console.log("   - Tier distribution:", tierDistribution);

    return true;
  } catch (error) {
    console.error("❌ Customer experience tests failed:", error);
    return false;
  }
};
