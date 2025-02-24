
import { supabase } from "@/integrations/supabase/client";

export const runStressTest = async () => {
  console.log("Starting application stress test...");
  
  try {
    // Test 1: Order Processing Load
    console.log("\n🔄 Testing Order Processing...");
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (ordersError) {
      console.error("❌ Order fetching failed:", ordersError.message);
    } else {
      console.log("✅ Successfully fetched", orders?.length, "orders");
      console.log("📊 Average order value:", 
        orders?.reduce((sum, order) => sum + (order.total || 0), 0) / (orders?.length || 1)
      );
    }

    // Test 2: Kitchen Order Processing
    console.log("\n🍳 Testing Kitchen Order Processing...");
    const { data: kitchenOrders, error: kitchenError } = await supabase
      .from('kitchen_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (kitchenError) {
      console.error("❌ Kitchen order fetching failed:", kitchenError.message);
    } else {
      console.log("✅ Successfully fetched", kitchenOrders?.length, "kitchen orders");
      console.log("⏱️ Average preparation time:", 
        kitchenOrders?.reduce((sum, order) => {
          const estimatedTime = new Date(order.estimated_delivery_time).getTime();
          const createdTime = new Date(order.created_at).getTime();
          return sum + (estimatedTime - createdTime) / (1000 * 60);
        }, 0) / (kitchenOrders?.length || 1),
        "minutes"
      );
    }

    // Test 3: Inventory Management
    console.log("\n📦 Testing Inventory Management...");
    const { data: inventory, error: inventoryError } = await supabase
      .from('ingredients')
      .select('*');

    if (inventoryError) {
      console.error("❌ Inventory fetching failed:", inventoryError.message);
    } else {
      const lowStock = inventory?.filter(item => item.current_stock <= item.minimum_stock);
      console.log("✅ Successfully fetched", inventory?.length, "inventory items");
      console.log("⚠️ Low stock items:", lowStock?.length);
    }

    // Test 4: Customer Feedback Analysis
    console.log("\n📝 Testing Customer Feedback System...");
    const { data: feedback, error: feedbackError } = await supabase
      .from('customer_feedback')
      .select(`
        *,
        customer_profiles (name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (feedbackError) {
      console.error("❌ Feedback fetching failed:", feedbackError.message);
    } else {
      const averageRating = feedback?.reduce((sum, fb) => sum + (fb.rating || 0), 0) / (feedback?.length || 1);
      const pendingFeedback = feedback?.filter(fb => fb.status === 'pending');
      console.log("✅ Successfully fetched", feedback?.length, "feedback entries");
      console.log("⭐ Average rating:", averageRating.toFixed(2));
      console.log("📨 Pending feedback:", pendingFeedback?.length);
    }

    // Test 5: Staff Schedule Coverage
    console.log("\n👥 Testing Staff Management...");
    const { data: staff, error: staffError } = await supabase
      .from('staff_members')
      .select('*');

    if (staffError) {
      console.error("❌ Staff fetching failed:", staffError.message);
    } else {
      const activeStaff = staff?.filter(s => s.status === 'active');
      console.log("✅ Successfully fetched", staff?.length, "staff members");
      console.log("🏃 Active staff members:", activeStaff?.length);
    }

    // Test 6: Supply Chain
    console.log("\n🚚 Testing Supply Chain Management...");
    const { data: purchaseOrders, error: poError } = await supabase
      .from('purchase_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (poError) {
      console.error("❌ Purchase orders fetching failed:", poError.message);
    } else {
      const pendingOrders = purchaseOrders?.filter(po => po.status === 'pending');
      const totalValue = purchaseOrders?.reduce((sum, po) => sum + (po.total_amount || 0), 0);
      console.log("✅ Successfully fetched", purchaseOrders?.length, "purchase orders");
      console.log("⏳ Pending orders:", pendingOrders?.length);
      console.log("💰 Total purchase value:", totalValue?.toFixed(2));
    }

    // Test 7: Performance Metrics
    console.log("\n📊 Testing Performance Metrics...");
    const startTime = new Date();
    startTime.setHours(0, 0, 0, 0);
    
    const { data: todaysOrders, error: metricsError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startTime.toISOString());

    if (metricsError) {
      console.error("❌ Metrics calculation failed:", metricsError.message);
    } else {
      const totalRevenue = todaysOrders?.reduce((sum, order) => sum + (order.total || 0), 0);
      const averageOrderTime = todaysOrders?.reduce((sum, order) => {
        const orderTime = new Date(order.timestamp).getTime();
        const createdTime = new Date(order.created_at).getTime();
        return sum + (orderTime - createdTime) / (1000 * 60);
      }, 0) / (todaysOrders?.length || 1);

      console.log("✅ Successfully calculated daily metrics");
      console.log("💵 Today's revenue:", totalRevenue?.toFixed(2));
      console.log("⏱️ Average order processing time:", averageOrderTime?.toFixed(2), "minutes");
    }

    console.log("\n✨ Stress test completed!");

  } catch (error) {
    console.error("❌ Critical test failure:", error);
  }
};
