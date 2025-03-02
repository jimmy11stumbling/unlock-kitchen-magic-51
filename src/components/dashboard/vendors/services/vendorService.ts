import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Vendor, Expense, AccountingSummary } from "@/types/vendor";
import { v4 as uuidv4 } from 'uuid';

type FinancialTransaction = Database["public"]["Tables"]["financial_transactions"]["Row"];
type FinancialTransactionInsert = Database["public"]["Tables"]["financial_transactions"]["Insert"];

const mapTransactionToVendor = (transaction: FinancialTransaction): Vendor => ({
  id: Number(transaction.id),
  name: transaction.description || '',
  email: '',
  phone: '',
  address: '',
  taxId: transaction.reference_number || '',
  status: 'active',
  paymentTerms: transaction.payment_method,
  notes: '',
  createdAt: transaction.created_at || '',
  updatedAt: transaction.updated_at || ''
});

const mapTransactionToExpense = (transaction: FinancialTransaction): Expense => ({
  id: Number(transaction.id),
  vendorId: transaction.category_id ? Number(transaction.category_id) : 0,
  vendorName: transaction.reference_number || undefined,
  amount: transaction.amount,
  date: transaction.date,
  category: transaction.category_id || '',
  description: transaction.description || '',
  paymentMethod: transaction.payment_method,
  receiptUrl: undefined,
  taxDeductible: false,
  status: transaction.reference_number?.includes('paid') ? 'paid' : 'pending',
  createdAt: transaction.created_at || '',
  updatedAt: transaction.updated_at || ''
});

export const vendorService = {
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

  async getExpenses(): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('type', 'expense')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(mapTransactionToExpense);
  },

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'vendorName'>): Promise<Expense> {
    let vendorName = '';
    if (expense.vendorId) {
      const { data } = await supabase
        .from('financial_transactions')
        .select('description')
        .eq('id', expense.vendorId.toString())
        .maybeSingle();
        
      vendorName = data?.description || '';
    }
    
    const statusRef = expense.status === 'paid' ? 'paid-' + Date.now() : '';
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        amount: expense.amount,
        category_id: expense.vendorId.toString(),
        date: expense.date,
        description: expense.description,
        payment_method: expense.paymentMethod,
        type: 'expense',
        created_by: uuidv4(),
        reference_number: vendorName ? `${vendorName} ${statusRef}` : statusRef
      })
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to create expense');
    
    return {
      ...mapTransactionToExpense(data),
      vendorName,
      vendorId: expense.vendorId,
      category: expense.category,
      taxDeductible: expense.taxDeductible,
      status: expense.status
    };
  },

  async updateExpense(id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'vendorName'>>): Promise<Expense> {
    let vendorName = '';
    if (updates.vendorId) {
      const { data } = await supabase
        .from('financial_transactions')
        .select('description')
        .eq('id', updates.vendorId.toString())
        .maybeSingle();
        
      vendorName = data?.description || '';
    }
    
    const statusRef = updates.status === 'paid' ? 'paid-' + Date.now() : '';
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({
        amount: updates.amount,
        category_id: updates.vendorId?.toString(),
        date: updates.date,
        description: updates.description,
        payment_method: updates.paymentMethod,
        reference_number: vendorName ? `${vendorName} ${statusRef}` : statusRef
      })
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    if (!data) throw new Error('Expense not found');
    
    return {
      ...mapTransactionToExpense(data),
      vendorName,
      vendorId: updates.vendorId || 0,
      category: updates.category || '',
      taxDeductible: updates.taxDeductible || false,
      status: updates.status || 'pending'
    };
  },

  async deleteExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getAccountingSummary(): Promise<AccountingSummary> {
    const expenses = await this.getExpenses();
    
    const summary: AccountingSummary = {
      totalExpenses: 0,
      totalPaid: 0,
      totalPending: 0,
      taxDeductibleAmount: 0,
      expensesByCategory: {},
      expensesByVendor: {},
      monthlyTotals: {}
    };

    expenses.forEach((expense) => {
      summary.totalExpenses += expense.amount;
      if (expense.status === 'paid') {
        summary.totalPaid += expense.amount;
      } else if (expense.status === 'pending') {
        summary.totalPending += expense.amount;
      }
      if (expense.taxDeductible) {
        summary.taxDeductibleAmount += expense.amount;
      }

      summary.expensesByCategory[expense.category] = 
        (summary.expensesByCategory[expense.category] || 0) + expense.amount;

      summary.expensesByVendor[expense.vendorId] = 
        (summary.expensesByVendor[expense.vendorId] || 0) + expense.amount;

      const month = expense.date.substring(0, 7);
      summary.monthlyTotals[month] = 
        (summary.monthlyTotals[month] || 0) + expense.amount;
    });

    return summary;
  },

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
  },

  async getBudgetAnalysis(): Promise<any> {
    const expenses = await this.getExpenses();
    
    const monthlyBudgets: Record<string, { 
      planned: number; 
      actual: number; 
      variance: number;
    }> = {};
    
    const plannedMonthlyBudget = 15000;
    
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      if (!monthlyBudgets[month]) {
        monthlyBudgets[month] = {
          planned: plannedMonthlyBudget,
          actual: 0,
          variance: 0
        };
      }
      
      monthlyBudgets[month].actual += expense.amount;
      monthlyBudgets[month].variance = 
        monthlyBudgets[month].planned - monthlyBudgets[month].actual;
    });
    
    return {
      monthlyBudgets,
      totalPlanned: Object.values(monthlyBudgets).reduce((sum, month) => sum + month.planned, 0),
      totalActual: Object.values(monthlyBudgets).reduce((sum, month) => sum + month.actual, 0)
    };
  },

  async getTopVendors(): Promise<any[]> {
    const expenses = await this.getExpenses();
    
    const vendorMap = new Map<number, {
      id: number;
      name: string;
      totalSpent: number;
      lastTransaction: string;
      transactionCount: number;
    }>();
    
    expenses.forEach(expense => {
      if (!vendorMap.has(expense.vendorId)) {
        vendorMap.set(expense.vendorId, {
          id: expense.vendorId,
          name: expense.vendorName || `Vendor #${expense.vendorId}`,
          totalSpent: 0,
          lastTransaction: expense.date,
          transactionCount: 0
        });
      }
      
      const vendor = vendorMap.get(expense.vendorId)!;
      vendor.totalSpent += expense.amount;
      vendor.transactionCount += 1;
      
      if (new Date(expense.date) > new Date(vendor.lastTransaction)) {
        vendor.lastTransaction = expense.date;
      }
    });
    
    return Array.from(vendorMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);
  }
};
