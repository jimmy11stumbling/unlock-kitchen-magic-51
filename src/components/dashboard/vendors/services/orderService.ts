import { v4 as uuidv4 } from 'uuid';
import type { VendorOrder } from '@/types/vendor';

export const orderService = {
  async getVendorOrders(vendorId: number): Promise<VendorOrder[]> {
    // Simulated order data
    return [
      {
        id: uuidv4(),
        vendorId,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: "delivered",
        amount: 1200.50,
        items: [
          { name: "Ingredient A", quantity: 5, unitPrice: 15.50 },
          { name: "Ingredient B", quantity: 10, unitPrice: 8.25 },
          { name: "Ingredient C", quantity: 3, unitPrice: 22.75 }
        ]
      },
      {
        id: uuidv4(),
        vendorId,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: "shipped",
        amount: 950.75,
        items: [
          { name: "Ingredient D", quantity: 8, unitPrice: 12.75 },
          { name: "Ingredient E", quantity: 5, unitPrice: 9.50 },
          { name: "Ingredient F", quantity: 7, unitPrice: 14.25 }
        ]
      }
    ];
  },

  // Add the missing methods
  async createNewOrder(vendorId: number, items: any[], totalAmount: number): Promise<VendorOrder> {
    // Simulated order creation
    return {
      id: uuidv4(),
      vendorId,
      date: new Date().toISOString(),
      status: "pending",
      amount: totalAmount,
      items
    };
  },

  async generateOrderPdf(orderId: string): Promise<{ success: boolean; downloadUrl: string }> {
    // Simulate PDF generation
    console.log(`Generating PDF for order: ${orderId}`);
    // In a real implementation, this would generate a PDF and return a download URL
    return {
      success: true,
      downloadUrl: `https://example.com/orders/${orderId}.pdf`
    };
  }
};
