
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
      lastMonthExpenses: 12500,
      totalExpenses: 25000,
      totalPaid: 18000,
      totalPending: 7000,
      taxDeductibleAmount: 15000,
      expensesByCategory: { 'Supplies': 10000, 'Ingredients': 15000 },
      expensesByVendor: { [vendorId]: 25000 },
      monthlyTotals: { '2023-01': 8000, '2023-02': 8500, '2023-03': 8500 }
    };
  },

  // Add these methods that are referenced in vendorService.ts
  async getAccountingSummary(): Promise<AccountingSummary> {
    return {
      id: uuidv4(),
      total: 75000,
      paid: 50000,
      overdue: 25000,
      totalExpenses: 75000,
      totalPaid: 50000,
      totalPending: 25000,
      taxDeductibleAmount: 45000,
      expensesByCategory: {
        'Ingredients': 30000,
        'Supplies': 20000,
        'Services': 15000,
        'Equipment': 10000
      },
      expensesByVendor: {
        '1': 25000,
        '2': 20000,
        '3': 30000
      },
      monthlyTotals: {
        '2023-01': 22000,
        '2023-02': 25000,
        '2023-03': 28000
      }
    };
  },

  async getBudgetAnalysis(): Promise<any> {
    return {
      totalPlanned: 90000,
      totalActual: 75000,
      monthlyBudgets: {
        '2023-01': { planned: 25000, actual: 22000, variance: 3000 },
        '2023-02': { planned: 30000, actual: 25000, variance: 5000 },
        '2023-03': { planned: 35000, actual: 28000, variance: 7000 }
      }
    };
  },

  async getTopVendors(): Promise<any[]> {
    return [
      { id: 1, name: "Farm Fresh Suppliers", totalSpent: 25000, lastTransaction: '2023-03-15', transactionCount: 12 },
      { id: 2, name: "Premium Meats Inc.", totalSpent: 20000, lastTransaction: '2023-03-10', transactionCount: 8 },
      { id: 3, name: "Global Spice Traders", totalSpent: 30000, lastTransaction: '2023-03-20', transactionCount: 15 }
    ];
  }
};
