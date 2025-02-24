
import { runTableTests } from "./modules/tableTests";
import { runMenuTests } from "./modules/menuTests";
import { runOrderTests } from "./modules/orderTests";
import { runInventoryTests } from "./modules/inventoryTests";
import { runKitchenTests } from "./modules/kitchenTests";
import { runPaymentTests } from "./modules/paymentTests";
import { runSubscriptionTests } from "./modules/subscriptionTests";
import { runStaffTests } from "./modules/staffTests";
import { runFinancialTests } from "./modules/financialTests";
import { runCustomerExperienceTests } from "./modules/customerExperienceTests";
import { runPerformanceTests } from "./modules/performanceTests";
import { runConnectivityTests } from "./modules/connectivityTests";

export const runStressTest = async () => {
  console.log("Starting comprehensive system stress test...");
  const results: Record<string, boolean> = {};
  
  try {
    // Run connectivity test first
    results['connectivity'] = await runConnectivityTests();
    
    // Only proceed with other tests if connectivity is good
    if (results['connectivity']) {
      results['tables'] = await runTableTests();
      results['menu'] = await runMenuTests();
      results['orders'] = await runOrderTests();
      results['inventory'] = await runInventoryTests();
      results['kitchen'] = await runKitchenTests();
      results['payments'] = await runPaymentTests();
      results['subscriptions'] = await runSubscriptionTests();
      results['staff'] = await runStaffTests();
      results['financial'] = await runFinancialTests();
      results['customer_experience'] = await runCustomerExperienceTests();
      results['performance'] = await runPerformanceTests();
    } else {
      console.error("❌ Skipping remaining tests due to connectivity issues");
    }

    // Print test results summary
    console.log("\n✨ System stress test completed!");
    console.log("\nTest Results Summary:");
    Object.entries(results).forEach(([test, passed]) => {
      console.log(`${passed ? '✅' : '❌'} ${test} tests: ${passed ? 'PASSED' : 'FAILED'}`);
    });
    
  } catch (error) {
    console.error("❌ Critical system test failure:", error);
  }
};
