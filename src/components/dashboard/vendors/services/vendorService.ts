import { v4 as uuidv4 } from 'uuid';
import { contactService } from './contactService';
import { notesService } from './notesService';
import { orderService } from './orderService';
import { paymentService } from './paymentService';
import { documentService } from './documentService';
import { expenseService } from './expenseService';
import { accountingService } from './accountingService';

export const vendorService = {
  // Re-export methods from contactService
  getVendorContacts: contactService.getVendorContacts,
  
  // Re-export methods from notesService
  getVendorNotes: notesService.getVendorNotes,
  addVendorNote: notesService.addVendorNote,
  updateVendorNote: notesService.updateVendorNote,
  
  // Re-export methods from orderService
  getVendorOrders: orderService.getVendorOrders,
  createNewOrder: orderService.createNewOrder,
  generateOrderPdf: orderService.generateOrderPdf,
  
  // Re-export methods from paymentService
  getVendorPayments: paymentService.getVendorPayments,
  createPayment: paymentService.createPayment,
  
  // Re-export methods from documentService
  getVendorDocuments: documentService.getVendorDocuments,
  uploadVendorDocument: documentService.uploadVendorDocument,
  deleteVendorDocument: documentService.deleteVendorDocument,
  
  // Re-export methods from expenseService
  getExpenses: expenseService.getExpenses,
  addExpense: expenseService.addExpense,
  updateExpense: expenseService.updateExpense,
  deleteExpense: expenseService.deleteExpense,
  
  // Re-export methods from accountingService
  getAccountingSummary: accountingService.getAccountingSummary,
  getBudgetAnalysis: accountingService.getBudgetAnalysis,
  getTopVendors: accountingService.getTopVendors,

  // Keep vendor-specific methods in this file
  async getVendors() {
    // Simulated vendor data
    return [
      {
        id: 1,
        name: "Farm Fresh Suppliers",
        contactName: "John Doe",
        email: "john@farmfresh.com",
        phone: "555-123-4567",
        address: "123 Farm Road, Rural County",
        category: "Produce",
        status: "active"
      },
      {
        id: 2,
        name: "Premium Meats Inc.",
        contactName: "Jane Smith",
        email: "jane@premiummeats.com",
        phone: "555-987-6543",
        address: "456 Butcher Lane, Metro City",
        category: "Meats",
        status: "active"
      },
      {
        id: 3,
        name: "Global Spice Traders",
        contactName: "Ahmed Hassan",
        email: "ahmed@globalspice.com",
        phone: "555-456-7890",
        address: "789 Spice Market, Harbor District",
        category: "Spices",
        status: "active"
      }
    ];
  },

  async addVendor(vendorData: any) {
    // Simulate adding a vendor
    const newVendor = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...vendorData,
      status: "active"
    };
    console.log("Adding vendor:", newVendor);
    return newVendor;
  },

  async updateVendor(vendorId: number, updates: any) {
    // Simulate updating a vendor
    console.log("Updating vendor:", vendorId, updates);
    return {
      id: vendorId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteVendor(vendorId: number) {
    // Simulate deleting a vendor
    console.log("Deleting vendor:", vendorId);
    return { success: true };
  }
};
