
import { supabase } from '@/integrations/supabase/client';
import type { Vendor } from '@/types/vendor';
import { v4 as uuidv4 } from 'uuid';
import { mapDatabaseToVendor, mapVendorToTransaction } from './utils/mappingUtils';

export const vendorApiService = {
  async getAllVendors(): Promise<Vendor[]> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*');

      if (error) throw error;
      
      return (data || []).map(mapDatabaseToVendor);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    }
  },

  async createVendor(vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vendor> {
    try {
      // Convert payment method to a valid enum value if needed
      let paymentTerms = vendor.paymentTerms;
      if (typeof paymentTerms === 'string' && !['cash', 'card', 'bank_transfer', 'check'].includes(paymentTerms)) {
        paymentTerms = 'cash'; // Default to cash if invalid
      }

      const { data, error } = await supabase
        .from('suppliers')
        .insert({
          id: uuidv4(),
          name: vendor.name,
          contact_person: vendor.contactName,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          website: vendor.website || '',
          category: vendor.category,
          status: vendor.status || 'active',
          payment_terms: paymentTerms,
          notes: vendor.notes || '',
          rating: vendor.rating || 0,
          tax_id: vendor.taxId || '',
        })
        .select()
        .single();

      if (error) throw error;

      return mapDatabaseToVendor(data);
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  async getVendorById(id: number): Promise<Vendor | null> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id.toString())
        .single();

      if (error) throw error;
      if (!data) return null;

      return mapDatabaseToVendor(data);
    } catch (error) {
      console.error(`Error fetching vendor with ID ${id}:`, error);
      return null;
    }
  },

  async updateVendor(id: number, vendor: Partial<Vendor>): Promise<Vendor | null> {
    try {
      const dbVendor = mapVendorToTransaction(vendor);
      
      const { data, error } = await supabase
        .from('suppliers')
        .update(dbVendor)
        .eq('id', id.toString())
        .select()
        .single();

      if (error) throw error;
      
      return mapDatabaseToVendor(data);
    } catch (error) {
      console.error(`Error updating vendor with ID ${id}:`, error);
      return null;
    }
  }
};
