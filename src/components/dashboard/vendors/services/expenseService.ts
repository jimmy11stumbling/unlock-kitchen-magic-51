
import { v4 as uuidv4 } from 'uuid';
import type { VendorPayment } from '@/types/vendor';

export const expenseService = {
  async getExpenses(vendorId?: number): Promise<VendorPayment[]> {
    // Simulated expense data
    const allExpenses = [
      {
        id: uuidv4(),
        vendorId: 1,
        amount: 1250.50,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        method: "bank_transfer",
        status: "paid",
        reference: "Monthly produce order"
      },
      {
        id: uuidv4(),
        vendorId: 2,
        amount: 875.25,
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        method: "credit_card",
        status: "pending",
        reference: "Premium meat delivery"
      },
      {
        id: uuidv4(),
        vendorId: 3,
        amount: 320.75,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        method: "check",
        status: "paid",
        reference: "Specialty spice order"
      }
    ];

    // If vendorId is provided, filter by vendor
    if (vendorId) {
      return allExpenses.filter(expense => expense.vendorId === vendorId);
    }
    
    return allExpenses;
  },

  async addExpense(expenseData: any) {
    // Simulate adding an expense
    const newExpense = {
      id: uuidv4(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    console.log("Adding expense:", newExpense);
    return newExpense;
  },

  async updateExpense(expenseId: string, updates: any) {
    // Simulate updating an expense
    console.log("Updating expense:", expenseId, updates);
    return {
      id: expenseId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteExpense(expenseId: string) {
    // Simulate deleting an expense
    console.log("Deleting expense:", expenseId);
    return { success: true };
  }
};
