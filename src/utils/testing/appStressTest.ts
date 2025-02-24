import { supabase } from "@/integrations/supabase/client";
import { runKitchenTests } from "./modules/kitchenTests";
import { runPaymentTests } from "./modules/paymentTests";
import { runSubscriptionTests } from "./modules/subscriptionTests";
import { runStaffTests } from "./modules/staffTests";

export const runStressTest = async () => {
  console.log("Starting comprehensive system stress test...");
  const results: Record<string, boolean> = {};
  
  try {
    // Test 1: Table Management System
    console.log("\n🪑 Testing Table Management System...");
    const { data: tables, error: tablesError } = await supabase
      .from('tables')
      .select('*')
      .order('number');

    if (tablesError) {
      console.error("❌ Table system test failed:", tablesError.message);
    } else {
      const availableTables = tables?.filter(t => t.status === 'available').length;
      const occupiedTables = tables?.filter(t => t.status === 'occupied').length;
      console.log("✅ Tables Status:");
      console.log(`   - Total tables: ${tables?.length}`);
      console.log(`   - Available: ${availableTables}`);
      console.log(`   - Occupied: ${occupiedTables}`);
    }

    // Test 2: Menu System Load
    console.log("\n🍽️ Testing Menu System...");
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
    } else {
      const activeItems = menuItems?.filter(item => item.available).length;
      console.log("✅ Menu System Status:");
      console.log(`   - Total items: ${menuItems?.length}`);
      console.log(`   - Active items: ${activeItems}`);
      console.log(`   - Categories: ${new Set(menuItems?.map(item => item.category)).size}`);
    }

    // Test 3: Order Processing System
    console.log("\n🔄 Testing Order Processing System...");
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
    } else {
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
    }

    // Test 4: Staff Management System
    console.log("\n👥 Testing Staff Management System...");
    const { data: staff, error: staffError } = await supabase
      .from('staff_members')
      .select('*');

    if (staffError) {
      console.error("❌ Staff management test failed:", staffError.message);
    } else {
      const activeStaff = staff?.filter(s => s.status === 'active');
      const departments = new Set(staff?.map(s => s.department));
      console.log("✅ Staff System Status:");
      console.log(`   - Total staff: ${staff?.length}`);
      console.log(`   - Active staff: ${activeStaff?.length}`);
      console.log(`   - Departments: ${departments.size}`);
      console.log(`   - Roles distribution: ${new Set(staff?.map(s => s.role)).size} roles`);
    }

    // Test 5: Inventory Management
    console.log("\n📦 Testing Inventory Management System...");
    const { data: inventory, error: inventoryError } = await supabase
      .from('ingredients')
      .select('*');

    if (inventoryError) {
      console.error("❌ Inventory management test failed:", inventoryError.message);
    } else {
      const lowStock = inventory?.filter(item => item.current_stock <= item.minimum_stock);
      const totalValue = inventory?.reduce((sum, item) => 
        sum + (item.current_stock * item.cost_per_unit), 0);
      
      console.log("✅ Inventory System Status:");
      console.log(`   - Total items: ${inventory?.length}`);
      console.log(`   - Low stock alerts: ${lowStock?.length}`);
      console.log(`   - Total inventory value: $${totalValue?.toFixed(2)}`);
    }

    // Test 6: Kitchen Order System
    console.log("\n👨‍🍳 Testing Kitchen Order System...");
    const { data: kitchenOrders, error: kitchenError } = await supabase
      .from('kitchen_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (kitchenError) {
      console.error("❌ Kitchen system test failed:", kitchenError.message);
    } else {
      const avgPrepTime = kitchenOrders?.reduce((sum, order) => {
        const start = new Date(order.created_at).getTime();
        const end = new Date(order.estimated_delivery_time).getTime();
        return sum + (end - start) / (1000 * 60);
      }, 0) / (kitchenOrders?.length || 1);

      console.log("✅ Kitchen System Status:");
      console.log(`   - Active orders: ${kitchenOrders?.length}`);
      console.log(`   - Avg. preparation time: ${avgPrepTime.toFixed(2)} minutes`);
    }

    // Test 7: Payment Processing
    console.log("\n💳 Testing Payment Processing System...");
    const { data: payments, error: paymentsError } = await supabase
      .from('orders')
      .select('payment_status, payment_method, total')
      .not('payment_status', 'eq', 'pending');

    if (paymentsError) {
      console.error("❌ Payment processing test failed:", paymentsError.message);
    } else {
      const totalProcessed = payments?.reduce((sum, p) => sum + (p.total || 0), 0);
      const methodDistribution = payments?.reduce((acc, p) => {
        acc[p.payment_method] = (acc[p.payment_method] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log("✅ Payment System Status:");
      console.log(`   - Processed payments: ${payments?.length}`);
      console.log(`   - Total processed: $${totalProcessed?.toFixed(2)}`);
      console.log("   - Payment methods:", methodDistribution);
    }

    // Test 8: Customer Feedback System
    console.log("\n📝 Testing Customer Feedback System...");
    const { data: feedback, error: feedbackError } = await supabase
      .from('customer_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (feedbackError) {
      console.error("❌ Feedback system test failed:", feedbackError.message);
    } else {
      const avgRating = feedback?.reduce((sum, f) => sum + (f.rating || 0), 0) / (feedback?.length || 1);
      const pendingFeedback = feedback?.filter(f => f.status === 'pending').length;

      console.log("✅ Feedback System Status:");
      console.log(`   - Total feedback: ${feedback?.length}`);
      console.log(`   - Average rating: ${avgRating.toFixed(2)}/5`);
      console.log(`   - Pending responses: ${pendingFeedback}`);
    }

    // Test 9: Supply Chain Management
    console.log("\n🚚 Testing Supply Chain Management...");
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select(`
        *,
        supplier_ingredients (*)
      `);

    if (suppliersError) {
      console.error("❌ Supply chain test failed:", suppliersError.message);
    } else {
      const activeSuppliers = suppliers?.filter(s => s.status === 'active').length;
      console.log("✅ Supply Chain Status:");
      console.log(`   - Total suppliers: ${suppliers?.length}`);
      console.log(`   - Active suppliers: ${activeSuppliers}`);
      console.log(`   - Total ingredients supplied: ${suppliers?.reduce((sum, s) => 
        sum + (s.supplier_ingredients?.length || 0), 0)}`);
    }

    // Test 10: Waste Management System
    console.log("\n🗑️ Testing Waste Management System...");
    const { data: wasteLogs, error: wasteError } = await supabase
      .from('waste_logs')
      .select(`
        *,
        ingredients (name)
      `)
      .order('created_at', { ascending: false });

    if (wasteError) {
      console.error("❌ Waste management test failed:", wasteError.message);
    } else {
      const totalWasteCost = wasteLogs?.reduce((sum, log) => sum + (log.cost || 0), 0);
      console.log("✅ Waste Management Status:");
      console.log(`   - Total waste entries: ${wasteLogs?.length}`);
      console.log(`   - Total waste cost: $${totalWasteCost?.toFixed(2)}`);
    }

    // Test 11: Purchase Order System
    console.log("\n📝 Testing Purchase Order System...");
    const { data: purchaseOrders, error: poError } = await supabase
      .from('purchase_orders')
      .select(`
        *,
        purchase_order_items (
          *,
          ingredients (name)
        )
      `)
      .order('created_at', { ascending: false });

    if (poError) {
      console.error("❌ Purchase order system test failed:", poError.message);
    } else {
      const pendingOrders = purchaseOrders?.filter(po => po.status === 'pending').length;
      const totalValue = purchaseOrders?.reduce((sum, po) => sum + (po.total_amount || 0), 0);
      console.log("✅ Purchase Order System Status:");
      console.log(`   - Total orders: ${purchaseOrders?.length}`);
      console.log(`   - Pending orders: ${pendingOrders}`);
      console.log(`   - Total value: $${totalValue?.toFixed(2)}`);
    }

    // Test 12: Loyalty Points System
    console.log("\n💎 Testing Loyalty Points System...");
    const { data: loyaltyPoints, error: loyaltyError } = await supabase
      .from('loyalty_points')
      .select('*')
      .order('points', { ascending: false });

    if (loyaltyError) {
      console.error("❌ Loyalty system test failed:", loyaltyError.message);
    } else {
      const totalPoints = loyaltyPoints?.reduce((sum, lp) => sum + (lp.points || 0), 0);
      const tierDistribution = loyaltyPoints?.reduce((acc, lp) => {
        acc[lp.tier] = (acc[lp.tier] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log("✅ Loyalty System Status:");
      console.log(`   - Total members: ${loyaltyPoints?.length}`);
      console.log(`   - Total points: ${totalPoints}`);
      console.log("   - Tier distribution:", tierDistribution);
    }

    // Run modularized tests
    results['kitchen'] = await runKitchenTests();
    results['payments'] = await runPaymentTests();
    results['subscriptions'] = await runSubscriptionTests();
    results['staff'] = await runStaffTests();

    // System Performance Metrics
    console.log("\n📊 Testing System Performance...");
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
      results['performance'] = false;
    } else {
      const endTime = new Date();
      const queryTime = endTime.getTime() - startTime.getTime();
      console.log("✅ Performance Metrics:");
      console.log(`   - Database query time: ${queryTime}ms`);
      console.log(`   - System response: ${queryTime < 1000 ? 'Good' : 'Slow'}`);
      console.log(`   - Total orders: ${ordersCount.data?.count || 0}`);
      console.log(`   - Kitchen orders: ${kitchenOrdersCount.data?.count || 0}`);
      console.log(`   - Staff members: ${staffCount.data?.count || 0}`);
      console.log(`   - Inventory items: ${ingredientsCount.data?.count || 0}`);
      results['performance'] = true;
    }

    console.log("\n✨ System stress test completed!");
    console.log("\nTest Results Summary:");
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test} tests: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
  } catch (error) {
    console.error("❌ Critical system test failure:", error);
  }
};
