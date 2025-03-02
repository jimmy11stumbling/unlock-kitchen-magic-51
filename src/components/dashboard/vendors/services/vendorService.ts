
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
  },

  // Add missing methods to fix errors

  async getVendors() {
    // Simulated vendor data
    return [
      {
        id: 1,
        name: "Farm Fresh Suppliers",
        contactName: "John Doe",
        email: "john@farmfresh.com",
        phone: "555-123-4567",
        address: "123 Farm Road, Rural County",
        category: "Produce",
        status: "active"
      },
      {
        id: 2,
        name: "Premium Meats Inc.",
        contactName: "Jane Smith",
        email: "jane@premiummeats.com",
        phone: "555-987-6543",
        address: "456 Butcher Lane, Metro City",
        category: "Meats",
        status: "active"
      },
      {
        id: 3,
        name: "Global Spice Traders",
        contactName: "Ahmed Hassan",
        email: "ahmed@globalspice.com",
        phone: "555-456-7890",
        address: "789 Spice Market, Harbor District",
        category: "Spices",
        status: "active"
      }
    ];
  },

  async addVendor(vendorData: any) {
    // Simulate adding a vendor
    const newVendor = {
      id: Math.floor(Math.random() * 1000) + 10,
      ...vendorData,
      status: "active"
    };
    console.log("Adding vendor:", newVendor);
    return newVendor;
  },

  async updateVendor(vendorId: number, updates: any) {
    // Simulate updating a vendor
    console.log("Updating vendor:", vendorId, updates);
    return {
      id: vendorId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteVendor(vendorId: number) {
    // Simulate deleting a vendor
    console.log("Deleting vendor:", vendorId);
    return { success: true };
  },

  async getExpenses(vendorId?: number) {
    // Simulated expense data
    const allExpenses = [
      {
        id: uuidv4(),
        vendorId: 1,
        amount: 1250.50,
        description: "Monthly produce order",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Ingredients",
        paymentStatus: "paid",
        paymentMethod: "bank_transfer"
      },
      {
        id: uuidv4(),
        vendorId: 2,
        amount: 875.25,
        description: "Premium meat delivery",
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Ingredients",
        paymentStatus: "pending",
        paymentMethod: "credit_card"
      },
      {
        id: uuidv4(),
        vendorId: 3,
        amount: 320.75,
        description: "Specialty spice order",
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        category: "Ingredients",
        paymentStatus: "paid",
        paymentMethod: "check"
      }
    ];

    // If vendorId is provided, filter by vendor
    if (vendorId) {
      return allExpenses.filter(expense => expense.vendorId === vendorId);
    }
    
    return allExpenses;
  },

  async addExpense(expenseData: any) {
    // Simulate adding an expense
    const newExpense = {
      id: uuidv4(),
      ...expenseData,
      date: expenseData.date || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    console.log("Adding expense:", newExpense);
    return newExpense;
  },

  async updateExpense(expenseId: string, updates: any) {
    // Simulate updating an expense
    console.log("Updating expense:", expenseId, updates);
    return {
      id: expenseId,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteExpense(expenseId: string) {
    // Simulate deleting an expense
    console.log("Deleting expense:", expenseId);
    return { success: true };
  },

  async getAccountingSummary(vendorId?: number) {
    // Simulated accounting summary
    return {
      totalExpenses: 12450.75,
      totalPaid: 9875.50,
      totalPending: 2575.25,
      taxDeductibleAmount: 10250.50,
      lastMonthExpenses: 4320.25,
      thisMonthExpenses: 3150.50,
      yearToDateExpenses: 37580.25
    };
  },

  async getBudgetAnalysis() {
    // Simulated budget analysis data
    return {
      monthlyData: [
        { month: "Jan", planned: 5000, actual: 4800 },
        { month: "Feb", planned: 5000, actual: 5200 },
        { month: "Mar", planned: 5000, actual: 5100 },
        { month: "Apr", planned: 5500, actual: 5700 },
        { month: "May", planned: 5500, actual: 5300 },
        { month: "Jun", planned: 5500, actual: 5800 },
        { month: "Jul", planned: 6000, actual: 6200 },
        { month: "Aug", planned: 6000, actual: 5900 },
        { month: "Sep", planned: 6000, actual: 6100 },
        { month: "Oct", planned: 5800, actual: 5700 },
        { month: "Nov", planned: 5800, actual: 6000 },
        { month: "Dec", planned: 6500, actual: 6300 }
      ],
      categoryData: [
        { category: "Ingredients", planned: 45000, actual: 46500 },
        { category: "Equipment", planned: 12000, actual: 11200 },
        { category: "Services", planned: 8000, actual: 8300 },
        { category: "Maintenance", planned: 5000, actual: 4800 },
        { category: "Other", planned: 3000, actual: 2900 }
      ]
    };
  },

  async getTopVendors() {
    // Simulated top vendors data
    return [
      { id: 1, name: "Farm Fresh Suppliers", totalSpent: 25400.50, orderCount: 24 },
      { id: 2, name: "Premium Meats Inc.", totalSpent: 18750.75, orderCount: 18 },
      { id: 3, name: "Global Spice Traders", totalSpent: 9320.25, orderCount: 36 },
      { id: 4, name: "Metro Beverage Co.", totalSpent: 6450.00, orderCount: 12 },
      { id: 5, name: "Quality Dairy Products", totalSpent: 5800.50, orderCount: 20 }
    ];
  },

  async createNewOrder(vendorId: number, orderData: any) {
    // Simulate creating a new order
    const newOrder = {
      id: uuidv4(),
      vendorId,
      ...orderData,
      date: new Date().toISOString(),
      status: "pending"
    };
    console.log("Creating new order:", newOrder);
    return newOrder;
  },

  async generateOrderPdf(orderId: string) {
    // Simulate generating a PDF
    console.log("Generating PDF for order:", orderId);
    // In a real application, this would generate and return a PDF file
    return {
      success: true,
      downloadUrl: `https://example.com/orders/pdf/${orderId}.pdf`
    };
  },

  async createPayment(paymentData: any) {
    // Simulate creating a payment
    const newPayment = {
      id: uuidv4(),
      ...paymentData,
      date: new Date().toISOString(),
      status: "completed"
    };
    console.log("Creating payment:", newPayment);
    return newPayment;
  }
};
