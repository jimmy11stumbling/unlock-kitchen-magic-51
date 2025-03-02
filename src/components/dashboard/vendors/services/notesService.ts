
import { v4 as uuidv4 } from 'uuid';
import type { VendorNote } from '@/types/vendor';

export const notesService = {
  async getVendorNotes(vendorId: number): Promise<VendorNote[]> {
    // For demonstration, returning simulated data
    return [
      {
        id: uuidv4(),
        vendorId,
        content: "Negotiated new payment terms - NET 45",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "Admin User"
      },
      {
        id: uuidv4(),
        vendorId,
        content: "Quality issues with last shipment - follow up required",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: "Jane Manager"
      }
    ];
  },

  async addVendorNote(vendorId: number, content: string): Promise<VendorNote> {
    // For demonstration, returning a simulated response
    return {
      id: uuidv4(),
      vendorId,
      content,
      createdAt: new Date().toISOString(),
      createdBy: "Current User"
    };
  },

  async updateVendorNote(noteId: string, content: string) {
    // For demonstration, returning a simulated response
    return {
      id: noteId,
      content,
      updatedAt: new Date().toISOString()
    };
  }
};
