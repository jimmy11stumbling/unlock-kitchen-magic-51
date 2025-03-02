
import { v4 as uuidv4 } from 'uuid';
import type { VendorPayment } from '@/types/vendor';

export const paymentService = {
  async getVendorPayments(vendorId: number): Promise<VendorPayment[]> {
    // For demonstration, returning simulated data
    // In a real implementation, this would fetch from a payments table
    return [
      {
        id: uuidv4(),
        vendorId,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 1250.00,
        method: "bank_transfer",
        status: "completed",
        reference: "INV-2023-05-15"
      },
      {
        id: uuidv4(),
        vendorId,
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 850.75,
        method: "check",
        status: "pending",
        reference: "INV-2023-04-30"
      },
      {
        id: uuidv4(),
        vendorId,
        date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 1100.25,
        method: "bank_transfer",
        status: "completed",
        reference: "INV-2023-04-15"
      }
    ];
  },

  async makePayment(vendorId: number, amount: number, method: string, reference: string): Promise<VendorPayment> {
    // For demonstration, returning a simulated response
    return {
      id: uuidv4(),
      vendorId,
      date: new Date().toISOString(),
      amount,
      method,
      status: "completed",
      reference
    };
  },

  async schedulePayment(vendorId: number, amount: number, method: string, date: string, reference: string): Promise<VendorPayment> {
    // For demonstration, returning a simulated response
    return {
      id: uuidv4(),
      vendorId,
      date,
      amount,
      method,
      status: "scheduled",
      reference
    };
  }
};
