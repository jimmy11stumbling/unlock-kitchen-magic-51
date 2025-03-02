
import { v4 as uuidv4 } from 'uuid';
import type { VendorContact } from '@/types/vendor';

export const contactService = {
  async getVendorContacts(vendorId: number): Promise<VendorContact[]> {
    // For demonstration, returning simulated data
    // In a real implementation, this would fetch from a contacts table
    return [
      { 
        id: uuidv4(),
        name: "John Smith", 
        role: "Sales Representative", 
        email: "john.smith@example.com", 
        phone: "555-123-4567",
        primary: true
      },
      { 
        id: uuidv4(),
        name: "Emma Johnson", 
        role: "Account Manager", 
        email: "emma.j@example.com", 
        phone: "555-987-6543",
        primary: false
      }
    ];
  }
};
