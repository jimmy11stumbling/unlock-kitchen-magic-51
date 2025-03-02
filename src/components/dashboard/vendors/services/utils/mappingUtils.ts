
import type { Vendor, VendorContact, Expense, AccountingSummary } from '@/types/vendor';

// Map database records to Vendor objects
export const mapDatabaseToVendor = (record: any): Vendor => {
  return {
    id: record.id ? parseInt(record.id) : 0,
    name: record.name || '',
    contactName: record.contact_name || '',
    email: record.email || '',
    phone: record.phone || '',
    address: record.address || '',
    website: record.website || '',
    category: record.category || 'general',
    status: record.status || 'active',
    paymentTerms: record.payment_terms || '',
    notes: record.notes || '',
    rating: record.rating || 0,
    taxId: record.tax_id || '',
    createdAt: record.created_at || '',
    updatedAt: record.updated_at || ''
  };
};

// Map API vendor data to database format
export const mapVendorToDatabase = (vendor: Partial<Vendor>): any => {
  return {
    name: vendor.name,
    contact_name: vendor.contactName,
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address,
    website: vendor.website,
    category: vendor.category,
    status: vendor.status,
    payment_terms: vendor.paymentTerms,
    notes: vendor.notes,
    rating: vendor.rating,
    tax_id: vendor.taxId
  };
};

// Map transaction to expense
export const mapTransactionToExpense = (transaction: any): Expense => {
  return {
    id: parseInt(transaction.id) || 0,
    vendorId: parseInt(transaction.vendor_id) || 0,
    vendorName: transaction.vendor_name || '',
    amount: transaction.amount || 0,
    date: transaction.date || new Date().toISOString().split('T')[0],
    description: transaction.description || '',
    category: transaction.category || transaction.category_id || '',
    paymentMethod: transaction.payment_method || 'cash',
    status: transaction.status || 'pending',
    receiptUrl: transaction.receipt_url || '',
    notes: transaction.notes || '',
    taxDeductible: transaction.tax_deductible || false,
    createdAt: transaction.created_at || new Date().toISOString(),
    updatedAt: transaction.updated_at || new Date().toISOString(),
  };
};

// Map vendor to transaction (for API)
export const mapVendorToTransaction = (vendor: any): any => {
  return {
    name: vendor.name,
    contact_person: vendor.contactName,
    email: vendor.email,
    phone: vendor.phone,
    address: vendor.address,
    website: vendor.website,
    status: vendor.status,
    payment_terms: vendor.paymentTerms,
    notes: vendor.notes,
    rating: vendor.rating,
    tax_id: vendor.taxId
  };
};
