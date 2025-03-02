
import { v4 as uuidv4 } from 'uuid';

export const orderApiService = {
  async getVendorOrders(vendorId: number): Promise<any[]> {
    return [
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        amount: 1250.00,
        status: 'completed',
        items: [
          { name: 'Product A', quantity: 5, unitPrice: 100 },
          { name: 'Product B', quantity: 10, unitPrice: 75 }
        ]
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 850.00,
        status: 'pending',
        items: [
          { name: 'Product C', quantity: 2, unitPrice: 200 },
          { name: 'Product D', quantity: 3, unitPrice: 150 }
        ]
      }
    ];
  },

  async getVendorPayments(vendorId: number): Promise<any[]> {
    return [
      {
        id: uuidv4(),
        date: new Date().toISOString(),
        amount: 1250.00,
        method: 'bank_transfer',
        status: 'completed',
        reference: 'INV-20230515'
      },
      {
        id: uuidv4(),
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 850.00,
        method: 'credit_card',
        status: 'pending',
        reference: 'INV-20230410'
      }
    ];
  },

  async createNewOrder(vendorId: number): Promise<any> {
    return {
      id: uuidv4(),
      vendorId,
      date: new Date().toISOString(),
      status: 'draft'
    };
  },

  async createPayment(paymentData: any): Promise<any> {
    return {
      id: uuidv4(),
      ...paymentData,
      date: new Date().toISOString(),
      status: 'pending'
    };
  },

  async generateOrderPdf(orderId: string): Promise<string> {
    return `https://example.com/orders/${orderId}.pdf`;
  }
};
