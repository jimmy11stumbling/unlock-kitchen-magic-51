
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import type { Vendor } from '@/types/vendor';
import { mapTransactionToVendor } from './utils/mappingUtils';

// Type for valid payment methods
type ValidPaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'check';

export const vendorApiService = {
  async getVendors(): Promise<Vendor[]> {
    try {
      // This is a mock implementation
      // In a real app, you would have a vendors table in your database
      const mockVendors = [
        {
          id: 1,
          name: "Quality Produce",
          contact_name: "John Smith",
          category: "Produce",
          email: "jsmith@qualityproduce.com",
          phone: "555-123-4567",
          address: "123 Farm Road",
          status: "active",
          payment_terms: "net_30"
        },
        {
          id: 2,
          name: "Premium Meats",
          contact_name: "Alice Jones",
          category: "Meat",
          email: "alice@premiummeats.com",
          phone: "555-987-6543",
          address: "456 Butcher Lane",
          status: "active",
          payment_terms: "net_15"
        }
      ];
      
      return mockVendors.map(vendor => mapTransactionToVendor(vendor));
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }
  },
  
  async createVendor(vendorData: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    try {
      // Map the payment terms to a valid value if needed
      const paymentMethod = mapToValidPaymentMethod(vendorData.paymentTerms);
      
      // This would be an actual database insertion in a real app
      const newVendor = {
        id: Math.floor(Math.random() * 1000),
        name: vendorData.name,
        contact_name: vendorData.contactName,
        category: vendorData.category,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
        status: vendorData.status,
        payment_terms: paymentMethod,
        notes: vendorData.notes,
        tax_id: vendorData.taxId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return mapTransactionToVendor(newVendor);
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  }
};

// Helper function to map any payment method string to valid enum values
function mapToValidPaymentMethod(method: string): ValidPaymentMethod {
  const validMethods: Record<string, ValidPaymentMethod> = {
    'cash': 'cash',
    'card': 'card',
    'bank_transfer': 'bank_transfer',
    'bank transfer': 'bank_transfer',
    'check': 'check',
    'cheque': 'check'
  };
  
  return validMethods[method.toLowerCase()] || 'card'; // Default to card if invalid
}
