
import type { Vendor, Expense } from '@/types/vendor';

export const mapApiToVendor = (apiData: any): Vendor => {
  return {
    id: apiData.id,
    name: apiData.name,
    email: apiData.email,
    phone: apiData.phone,
    address: apiData.address,
    taxId: apiData.taxId,
    status: apiData.status || 'active',
    paymentTerms: apiData.paymentTerms || 'net_30',
    notes: apiData.notes,
    createdAt: apiData.createdAt,
    updatedAt: apiData.updatedAt,
    // Add the required properties
    contactName: apiData.contactName || apiData.contact_person || '',
    category: apiData.category || 'general',
    // Optional properties
    website: apiData.website,
    rating: apiData.rating
  };
};

export const mapApiToExpense = (apiData: any): Expense => {
  return {
    id: apiData.id,
    vendorId: apiData.vendorId,
    vendorName: apiData.vendorName || '',
    amount: apiData.amount,
    date: apiData.date,
    category: apiData.category,
    description: apiData.description,
    paymentMethod: apiData.paymentMethod,
    status: apiData.status || 'pending',
    receiptUrl: apiData.receiptUrl,
    taxDeductible: apiData.taxDeductible || false,
    notes: apiData.notes,
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || new Date().toISOString()
  };
};
