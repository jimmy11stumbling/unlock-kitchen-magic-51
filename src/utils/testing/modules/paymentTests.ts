
import { supabase } from "@/integrations/supabase/client";

export const runPaymentTests = async () => {
  console.log("\n💳 Testing Payment Systems...");
  
  try {
    // Test Payment Processing
    const { data: payments, error: paymentsError } = await supabase
      .from('orders')
      .select(`
        *,
        receipts (
          receipt_data,
          generated_at
        )
      `)
      .not('payment_status', 'eq', 'pending');

    if (paymentsError) {
      console.error("❌ Payment processing test failed:", paymentsError.message);
      return false;
    }

    const totalProcessed = payments?.reduce((sum, p) => sum + (p.total || 0), 0);
    const paymentMethods = payments?.reduce((acc, p) => {
      acc[p.payment_method || 'unknown'] = (acc[p.payment_method || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Payment System Status:");
    console.log(`   - Processed payments: ${payments?.length}`);
    console.log(`   - Total processed: $${totalProcessed?.toFixed(2)}`);
    console.log("   - Payment methods:", paymentMethods);

    return true;
  } catch (error) {
    console.error("❌ Payment tests failed:", error);
    return false;
  }
};
