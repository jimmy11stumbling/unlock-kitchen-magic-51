
import type { AccountingSummary } from "@/types/vendor";
import { expenseApiService } from "./expenseApiService";

export const analyticsApiService = {
  async getAccountingSummary(): Promise<AccountingSummary> {
    const expenses = await expenseApiService.getExpenses();
    
    const summary: AccountingSummary = {
      totalExpenses: 0,
      totalPaid: 0,
      totalPending: 0,
      taxDeductibleAmount: 0,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };

    expenses.forEach((expense) => {
      summary.totalExpenses += expense.amount;
      if (expense.status === 'paid') {
        summary.totalPaid += expense.amount;
      } else if (expense.status === 'pending') {
        summary.totalPending += expense.amount;
      }
      if (expense.taxDeductible) {
        summary.taxDeductibleAmount += expense.amount;
      }

      summary.expensesByCategory[expense.category] = 
        (summary.expensesByCategory[expense.category] || 0) + expense.amount;

      summary.expensesByVendor[expense.vendorId] = 
        (summary.expensesByVendor[expense.vendorId] || 0) + expense.amount;

      const month = expense.date.substring(0, 7);
      summary.monthlyTotals[month] = 
        (summary.monthlyTotals[month] || 0) + expense.amount;
    });

    return summary;
  },

  async getBudgetAnalysis(): Promise<any> {
    const expenses = await expenseApiService.getExpenses();
    
    const monthlyBudgets: Record<string, { 
      planned: number; 
      actual: number; 
      variance: number;
    }> = {};
    
    const plannedMonthlyBudget = 15000;
    
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      if (!monthlyBudgets[month]) {
        monthlyBudgets[month] = {
          planned: plannedMonthlyBudget,
          actual: 0,
          variance: 0
        };
      }
      
      monthlyBudgets[month].actual += expense.amount;
      monthlyBudgets[month].variance = 
        monthlyBudgets[month].planned - monthlyBudgets[month].actual;
    });
    
    return {
      monthlyBudgets,
      totalPlanned: Object.values(monthlyBudgets).reduce((sum, month) => sum + month.planned, 0),
      totalActual: Object.values(monthlyBudgets).reduce((sum, month) => sum + month.actual, 0)
    };
  },

  async getTopVendors(): Promise<any[]> {
    const expenses = await expenseApiService.getExpenses();
    
    const vendorMap = new Map<number, {
      id: number;
      name: string;
      totalSpent: number;
      lastTransaction: string;
      transactionCount: number;
    }>();
    
    expenses.forEach(expense => {
      if (!vendorMap.has(expense.vendorId)) {
        vendorMap.set(expense.vendorId, {
          id: expense.vendorId,
          name: expense.vendorName || `Vendor #${expense.vendorId}`,
          totalSpent: 0,
          lastTransaction: expense.date,
          transactionCount: 0
        });
      }
      
      const vendor = vendorMap.get(expense.vendorId)!;
      vendor.totalSpent += expense.amount;
      vendor.transactionCount += 1;
      
      if (new Date(expense.date) > new Date(vendor.lastTransaction)) {
        vendor.lastTransaction = expense.date;
      }
    });
    
    return Array.from(vendorMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }
};
