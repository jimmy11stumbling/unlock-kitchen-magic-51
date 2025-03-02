
import { v4 as uuidv4 } from 'uuid';
import type { AccountingSummary } from '@/types/vendor';

export const analyticsApiService = {
  async getAccountingSummary(): Promise<AccountingSummary> {
    // This should match the interface
    return {
      id: uuidv4(),
      total: 75000,
      paid: 50000,
      overdue: 25000,
      totalExpenses: 75000,
      totalPaid: 50000,
      totalPending: 25000,
      taxDeductibleAmount: 45000,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };
  }
};
