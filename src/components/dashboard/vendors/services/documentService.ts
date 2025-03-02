
import { v4 as uuidv4 } from 'uuid';
import type { VendorDocument } from '@/types/vendor';

export const documentService = {
  async getVendorDocuments(vendorId: number): Promise<VendorDocument[]> {
    // For demonstration, returning simulated data
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
