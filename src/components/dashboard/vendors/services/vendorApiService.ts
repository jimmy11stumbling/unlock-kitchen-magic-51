
import { supabase } from "@/integrations/supabase/client";
import type { Vendor } from "@/types/vendor";
import { v4 as uuidv4 } from 'uuid';
import { mapTransactionToVendor } from "./utils/mappingUtils";

export const vendorApiService = {
  async getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const vendorMap = new Map<string, Vendor>();
    (data || []).forEach(transaction => {
      if (transaction.description && !vendorMap.has(transaction.description)) {
        vendorMap.set(transaction.description, mapTransactionToVendor(transaction));
      }
    });
    
    return Array.from(vendorMap.values());
  },

  async addVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: 0,
        category_id: uuidv4(),
        date: new Date().toISOString(),
        description: vendor.name,
        payment_method: vendor.paymentTerms,
        type: 'expense',
        reference_number: vendor.taxId,
        created_by: uuidv4()
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create vendor');
    
    return mapTransactionToVendor(data);
  },

  async updateVendor(id: string, updates: Partial<Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Vendor> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({
        description: updates.name,
        payment_method: updates.paymentTerms,
        reference_number: updates.taxId
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Vendor not found');
    
    return mapTransactionToVendor(data);
  },

  async deleteVendor(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getVendorContacts(vendorId: number): Promise<any[]> {
    return [
      {
        id: uuidv4(),
        name: 'John Smith',
        email: 'john.smith@vendor.com',
        phone: '(555) 123-4567',
        role: 'Account Manager'
      },
      {
        id: uuidv4(),
        name: 'Jane Doe',
        email: 'jane.doe@vendor.com',
        phone: '(555) 987-6543',
        role: 'Sales Representative'
      }
    ];
  },

  async addVendorContact(vendorId: number, contactData: any): Promise<any> {
    return {
      id: uuidv4(),
      ...contactData,
      vendorId
    };
  },

  async updateVendorContact(contactId: string, contactData: any): Promise<any> {
    return {
      id: contactId,
      ...contactData
    };
  },

  async deleteVendorContact(contactId: string): Promise<void> {
    return;
  },

  async getVendorNotes(vendorId: number): Promise<any[]> {
    return [
      {
        id: uuidv4(),
        content: 'Negotiated new payment terms. They agreed to Net 15 for orders over $5,000.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Admin User'
      },
      {
        id: uuidv4(),
        content: 'Quality issues with last shipment discussed. They promised to improve QC process.',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'Admin User'
      }
    ];
  },

  async addVendorNote(vendorId: number, content: string): Promise<any> {
    return {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
  },

  async updateVendorNote(noteId: string, content: string): Promise<any> {
    return {
      id: noteId,
      content,
      updatedAt: new Date().toISOString()
    };
  },

  async getVendorDocuments(vendorId: number): Promise<any[]> {
    return [
      {
        id: uuidv4(),
        name: 'Vendor Agreement',
        type: 'pdf',
        size: 2457600, // 2.4 MB
        uploadedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
      },
      {
        id: uuidv4(),
        name: 'Price List 2023',
        type: 'xlsx',
        size: 1228800, // 1.2 MB
        uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        url: '#'
      }
    ];
  },

  async uploadDocument(formData: FormData): Promise<any> {
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    
    return {
      id: uuidv4(),
      name: name || file.name,
      type: file.name.split('.').pop(),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      url: '#'
    };
  }
};
