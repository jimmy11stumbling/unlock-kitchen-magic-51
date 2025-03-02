
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export const vendorService = {
  async getVendorContacts(vendorId: number) {
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
  },

  async getVendorNotes(vendorId: number) {
    // For demonstration, returning simulated data
    // In a real implementation, this would fetch from a notes table
    return [
      {
        id: uuidv4(),
        content: "Negotiated new payment terms - NET 45",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "Admin User"
      },
      {
        id: uuidv4(),
        content: "Quality issues with last shipment - follow up required",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "Jane Manager"
      }
    ];
  },

  async addVendorNote(vendorId: number, content: string) {
    // For demonstration, returning a simulated response
    // In a real implementation, this would insert into a notes table
    return {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: "Current User"
    };
  },

  async updateVendorNote(noteId: string, content: string) {
    // For demonstration, returning a simulated response
    // In a real implementation, this would update a notes table
    return {
      id: noteId,
      content,
      updatedAt: new Date().toISOString()
    };
  },

  async getVendorOrders(vendorId: number) {
    // This would normally fetch from a dedicated orders table
    // Fetch via the orderApiService
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('vendor_id', vendorId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching vendor orders:', error);
      // Fallback to mock data if database query fails
      return [
        {
          id: uuidv4(),
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          amount: 1249.99,
          items: [
            { name: 'Premium Ingredients', quantity: 20, unitPrice: 25.00 },
            { name: 'Kitchen Supplies', quantity: 5, unitPrice: 150.00 }
          ]
        },
        {
          id: uuidv4(),
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          amount: 875.50,
          items: [
            { name: 'Cleaning Supplies', quantity: 10, unitPrice: 15.00 },
            { name: 'Specialty Ingredients', quantity: 15, unitPrice: 45.00 }
          ]
        }
      ];
    }
  },

  async getVendorPayments(vendorId: number) {
    try {
      // Try to fetch from financial_transactions table
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('type', 'expense')
        .eq('category_id', vendorId.toString())
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Transform to payment format
      return (data || []).map(transaction => ({
        id: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        method: transaction.payment_method,
        status: transaction.reference_number?.includes('completed') ? 'completed' : 'pending',
        reference: transaction.reference_number?.replace('completed-', '').replace('pending-', '') || ''
      }));
    } catch (error) {
      console.error('Error fetching vendor payments:', error);
      // Fallback to mock data
      return [
        {
          id: uuidv4(),
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 2500.00,
          method: 'bank_transfer',
          status: 'completed',
          reference: 'INV-2023-001'
        },
        {
          id: uuidv4(),
          date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 1875.50,
          method: 'check',
          status: 'completed',
          reference: 'INV-2023-002'
        }
      ];
    }
  },

  async getVendorDocuments(vendorId: number) {
    // For demonstration, returning simulated data
    // In a real implementation, this would fetch from a documents table or storage
    return [
      {
        id: uuidv4(),
        name: "Vendor Agreement",
        type: "PDF",
        fileUrl: "https://example.com/docs/agreement.pdf",
        uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        size: 1254000
      },
      {
        id: uuidv4(),
        name: "Product Catalog",
        type: "PDF",
        fileUrl: "https://example.com/docs/catalog.pdf",
        uploadedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        size: 3580000
      },
      {
        id: uuidv4(),
        name: "W-9 Form",
        type: "PDF",
        fileUrl: "https://example.com/docs/w9.pdf",
        uploadedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        size: 780000
      }
    ];
  },

  async uploadVendorDocument(vendorId: number, file: File, name: string) {
    // In a real implementation, this would upload to storage and save a record
    // For now, simulate a successful upload with a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Document uploaded:", { vendorId, fileName: file.name, documentName: name });
    return {
      id: uuidv4(),
      name,
      type: file.type.split('/')[1].toUpperCase(),
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      size: file.size
    };
  },

  async deleteVendorDocument(documentId: string) {
    // In a real implementation, this would delete from storage and database
    // For now, simulate a successful deletion with a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("Document deleted:", documentId);
    return { success: true };
  }
};
