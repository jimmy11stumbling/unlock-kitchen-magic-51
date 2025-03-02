
import { v4 as uuidv4 } from 'uuid';
import type { AccountingSummary } from '@/types/vendor';

export const accountingService = {
  async getVendorAccountingSummary(vendorId: number): Promise<AccountingSummary> {
    // For demonstration, returning simulated data
    return {
      id: uuidv4(),
      total: 25000,
      paid: 18000,
      overdue: 7000,
      lastMonthExpenses: 12500
    };
  }
};
