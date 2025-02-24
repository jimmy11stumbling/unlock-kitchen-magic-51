
import { supabase } from "@/integrations/supabase/client";

export const runSubscriptionTests = async () => {
  console.log("\n🔄 Testing Subscription Systems...");
  
  try {
    const { data: subscriptions, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (subscriptionError) {
      console.error("❌ Subscription system test failed:", subscriptionError.message);
      return false;
    }

    const activeSubscriptions = subscriptions?.filter(s => s.active).length || 0;
    const tierDistribution = subscriptions?.reduce((acc, s) => {
      acc[s.tier] = (acc[s.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("✅ Subscription System Status:");
    console.log(`   - Total subscriptions: ${subscriptions?.length}`);
    console.log(`   - Active subscriptions: ${activeSubscriptions}`);
    console.log("   - Tier distribution:", tierDistribution);

    // Test Feature Access
    const { data: features, error: featuresError } = await supabase
      .from('feature_access')
      .select('*');

    if (featuresError) {
      console.error("❌ Feature access test failed:", featuresError.message);
      return false;
    }

    console.log("✅ Feature Access Status:");
    console.log(`   - Total features: ${features?.length}`);
    
    return true;
  } catch (error) {
    console.error("❌ Subscription tests failed:", error);
    return false;
  }
};
