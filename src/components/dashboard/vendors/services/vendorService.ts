
import { vendorApiService } from './vendorApiService';
import { expenseApiService } from './expenseApiService';
import { orderApiService } from './orderApiService';
import { analyticsApiService } from './analyticsApiService';

export const vendorService = {
  // Vendor operations
  getVendors: vendorApiService.getVendors,
  addVendor: vendorApiService.addVendor,
  updateVendor: vendorApiService.updateVendor,
  deleteVendor: vendorApiService.deleteVendor,
  getVendorContacts: vendorApiService.getVendorContacts,
  addVendorContact: vendorApiService.addVendorContact,
  updateVendorContact: vendorApiService.updateVendorContact,
  deleteVendorContact: vendorApiService.deleteVendorContact,
  getVendorNotes: vendorApiService.getVendorNotes,
  addVendorNote: vendorApiService.addVendorNote,
  updateVendorNote: vendorApiService.updateVendorNote,
  getVendorDocuments: vendorApiService.getVendorDocuments,
  uploadDocument: vendorApiService.uploadDocument,

  // Expense operations
  getExpenses: expenseApiService.getExpenses,
  addExpense: expenseApiService.addExpense,
  updateExpense: expenseApiService.updateExpense,
  deleteExpense: expenseApiService.deleteExpense,

  // Order operations
  getVendorOrders: orderApiService.getVendorOrders,
  getVendorPayments: orderApiService.getVendorPayments,
  createNewOrder: orderApiService.createNewOrder,
  createPayment: orderApiService.createPayment,
  generateOrderPdf: orderApiService.generateOrderPdf,

  // Analytics operations
  getAccountingSummary: analyticsApiService.getAccountingSummary,
  getBudgetAnalysis: analyticsApiService.getBudgetAnalysis,
  getTopVendors: analyticsApiService.getTopVendors
};
