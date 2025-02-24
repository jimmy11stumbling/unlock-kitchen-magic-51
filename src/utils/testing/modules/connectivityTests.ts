
import { supabase } from "@/integrations/supabase/client";

export const runConnectivityTests = async () => {
  console.log("\n🌐 Testing System Connectivity...");
  
  try {
    // Test database connectivity
    const startTime = new Date();
    const { data, error: dbError } = await supabase
      .from('tables')
      .select('count');

    if (dbError) {
      console.error("❌ Database connection test failed:", dbError.message);
      return false;
    }

    const dbLatency = new Date().getTime() - startTime.getTime();
    console.log("✅ Database Connection:");
    console.log(`   - Status: Connected`);
    console.log(`   - Latency: ${dbLatency}ms`);
    console.log(`   - Response time: ${dbLatency < 200 ? 'Good' : dbLatency < 500 ? 'Fair' : 'Poor'}`);

    // Test realtime subscription
    let realtimeSuccess = false;
    const channel = supabase
      .channel('connectivity-test')
      .subscribe((status) => {
        realtimeSuccess = status === 'SUBSCRIBED';
      });

    // Wait for subscription status
    await new Promise(resolve => setTimeout(resolve, 1000));
    await supabase.removeChannel(channel);

    console.log("✅ Realtime Connection:");
    console.log(`   - Status: ${realtimeSuccess ? 'Connected' : 'Failed'}`);

    // Test API endpoints
    const endpoints = ['orders', 'menu_items', 'tables', 'staff_members'];
    const apiResults = await Promise.all(
      endpoints.map(async (endpoint) => {
        const start = new Date().getTime();
        const { error } = await supabase.from(endpoint).select('count');
        const latency = new Date().getTime() - start;
        return { endpoint, success: !error, latency };
      })
    );

    console.log("✅ API Endpoints Status:");
    apiResults.forEach(({ endpoint, success, latency }) => {
      console.log(`   - ${endpoint}: ${success ? 'Connected' : 'Failed'} (${latency}ms)`);
    });

    // Test connection limits
    const concurrentRequests = await Promise.all(
      Array(5).fill(0).map(() => supabase.from('tables').select('count'))
    );

    const failedRequests = concurrentRequests.filter(r => r.error).length;
    console.log("✅ Connection Limits:");
    console.log(`   - Concurrent requests: ${concurrentRequests.length - failedRequests}/${concurrentRequests.length} successful`);

    return true;
  } catch (error) {
    console.error("❌ Connectivity tests failed:", error);
    return false;
  }
};
