
import { v4 as uuidv4 } from 'uuid';
import type { AccountingSummary, BudgetAnalysis } from '@/types/vendor';

export const accountingService = {
  async getAccountingSummary(vendorId?: number): Promise<AccountingSummary> {
    // Return accounting summary with all required properties
    return {
      totalExpenses: 12450.75,
      totalPaid: 9875.50,
      totalPending: 2575.25,
      taxDeductibleAmount: 10250.50,
      lastMonthExpenses: 4320.25,
      thisMonthExpenses: 3150.50,
      yearToDateExpenses: 37580.25,
      expensesByCategory: {
        "Ingredients": 5600.25,
        "Equipment": 3200.50,
        "Services": 2100.75,
        "Maintenance": 1000.25,
        "Other": 549.00
      },
      expensesByVendor: {
        "Farm Fresh Suppliers": 4500.50,
        "Premium Meats Inc.": 3200.75,
        "Global Spice Traders": 2100.25,
        "Metro Beverage Co.": 1500.50,
        "Quality Dairy Products": 1149.75
      },
      monthlyTotals: {
        "2023-01": 3200.50,
        "2023-02": 3450.25,
        "2023-03": 3600.75,
        "2023-04": 3800.50,
        "2023-05": 4100.25,
        "2023-06": 4300.75
      }
    };
  },

  async getBudgetAnalysis(): Promise<any> {
    // Simulated budget analysis data
    return {
      monthlyData: [
        { month: "Jan", planned: 5000, actual: 4800 },
        { month: "Feb", planned: 5000, actual: 5200 },
        { month: "Mar", planned: 5000, actual: 5100 },
        { month: "Apr", planned: 5500, actual: 5700 },
        { month: "May", planned: 5500, actual: 5300 },
        { month: "Jun", planned: 5500, actual: 5800 },
        { month: "Jul", planned: 6000, actual: 6200 },
        { month: "Aug", planned: 6000, actual: 5900 },
        { month: "Sep", planned: 6000, actual: 6100 },
        { month: "Oct", planned: 5800, actual: 5700 },
        { month: "Nov", planned: 5800, actual: 6000 },
        { month: "Dec", planned: 6500, actual: 6300 }
      ],
      categoryData: [
        { category: "Ingredients", planned: 45000, actual: 46500 },
        { category: "Equipment", planned: 12000, actual: 11200 },
        { category: "Services", planned: 8000, actual: 8300 },
        { category: "Maintenance", planned: 5000, actual: 4800 },
        { category: "Other", planned: 3000, actual: 2900 }
      ]
    };
  },

  async getTopVendors() {
    // Simulated top vendors data
    return [
      { id: 1, name: "Farm Fresh Suppliers", totalSpent: 25400.50, orderCount: 24 },
      { id: 2, name: "Premium Meats Inc.", totalSpent: 18750.75, orderCount: 18 },
      { id: 3, name: "Global Spice Traders", totalSpent: 9320.25, orderCount: 36 },
      { id: 4, name: "Metro Beverage Co.", totalSpent: 6450.00, orderCount: 12 },
      { id: 5, name: "Quality Dairy Products", totalSpent: 5800.50, orderCount: 20 }
    ];
  }
};
