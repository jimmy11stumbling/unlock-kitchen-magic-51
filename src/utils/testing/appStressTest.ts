
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

export const runStressTest = async () => {
  console.log("Starting comprehensive system stress test...");
  const results: Record<string, boolean> = {};
  
  try {
    // Run all test modules
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
