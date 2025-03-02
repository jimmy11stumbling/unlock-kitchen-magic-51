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
    contactName: apiData.contactName || apiData.contact_person || '',
    category: apiData.category || 'general',
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

export const mapTransactionToExpense = (transaction: any): Expense => {
  return {
    id: transaction.id || 0,
    vendorId: transaction.vendor_id || 0,
    vendorName: transaction.vendor_name || 'Unknown Vendor',
    amount: transaction.amount || 0,
    date: transaction.date || new Date().toISOString(),
    description: transaction.description || '',
    category: transaction.category || 'Other',
    paymentMethod: transaction.payment_method || 'card',
    status: transaction.status || 'pending',
    receiptUrl: transaction.receipt_url || '',
    notes: transaction.notes || '',
    taxDeductible: transaction.tax_deductible || false,
    createdAt: transaction.created_at || new Date().toISOString(),
    updatedAt: transaction.updated_at || new Date().toISOString(),
  };
};

export const mapTransactionToVendor = (data: any): Vendor => {
  return {
    id: data.id || 0,
    name: data.name || '',
    contactName: data.contact_name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    category: data.category || 'General',
    website: data.website,
    status: data.status || 'active',
    paymentTerms: data.payment_terms || 'net_30',
    notes: data.notes,
    taxId: data.tax_id,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString()
  };
};
