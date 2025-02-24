
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import { parse } from 'papaparse';
import type { InventoryItem } from '@/hooks/dashboard/useInventoryData';
import type { DailyReport } from '@/types/staff';

export type ExportFormat = 'csv' | 'pdf';

export const exportToCSV = (data: any[], filename: string) => {
  // Get all unique headers from all objects
  const headers = Array.from(
    new Set(
      data.flatMap(obj => Object.keys(obj))
    )
  ).filter(header => 
    // Filter out complex objects and arrays
    !['topSellingItems'].includes(header)
  );

  const csvContent = [
    // Headers row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        
        // Format numbers to 2 decimal places if they're currency values
        if (['price', 'totalValue', 'totalRevenue', 'laborCosts', 'inventoryCosts', 'netProfit'].includes(header)) {
          return typeof value === 'number' ? value.toFixed(2) : value;
        }

        // Handle special cases
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        
        // Escape quotes and commas in string values
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToPDF = (data: any[], filename: string) => {
  const pdf = new jsPDF();
  const headers = ['Name', 'Quantity', 'Unit', 'Price', 'Category', 'Min Quantity'];
  
  // Add title
  pdf.setFontSize(16);
  pdf.text('Inventory Report', 14, 20);
  pdf.setFontSize(10);

  // Add metadata
  const today = new Date().toLocaleDateString();
  pdf.text(`Generated on: ${today}`, 14, 30);

  // Table configuration
  const startY = 40;
  const margin = 14;
  const cellPadding = 2;
  const fontSize = 10;
  const lineHeight = 8;

  // Draw headers
  pdf.setFontSize(fontSize);
  pdf.setTextColor(0, 0, 0);
  headers.forEach((header, i) => {
    pdf.text(header, margin + (i * 25), startY);
  });

  // Draw data rows
  data.forEach((row: any, rowIndex) => {
    const y = startY + ((rowIndex + 1) * lineHeight);
    
    // Check if we need a new page
    if (y >= pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      return;
    }

    // Format and draw each cell
    [
      row.name,
      row.quantity?.toString() || '',
      row.unit || '',
      row.price ? `$${row.price.toFixed(2)}` : '',
      row.category || '',
      row.minQuantity?.toString() || ''
    ].forEach((text, colIndex) => {
      pdf.text(text, margin + (colIndex * 25), y);
    });
  });

  pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const importFromCSV = async (file: File): Promise<InventoryItem[]> => {
  return new Promise((resolve, reject) => {
    parse(file, {
      header: true,
      complete: (results) => {
        try {
          const items = results.data.map((row: any) => ({
            id: parseInt(row.id) || 0,
            name: row.name || '',
            quantity: parseInt(row.quantity) || 0,
            unit: row.unit || 'pcs',
            minQuantity: parseInt(row.minQuantity) || 0,
            price: parseFloat(row.price) || 0,
            category: row.category || 'uncategorized'
          }));
          resolve(items);
        } catch (error) {
          reject(new Error('Invalid CSV format'));
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const exportInventory = (data: InventoryItem[], filename: string, format: ExportFormat) => {
  try {
    if (format === 'csv') {
      exportToCSV(data, filename);
    } else {
      exportToPDF(data, filename);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export inventory');
  }
};

export const exportReport = async (data: any[], filename: string, format: ExportFormat) => {
  try {
    if (format === 'csv') {
      exportToCSV(data, filename);
    } else {
      exportToPDF(data, filename);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export report');
  }
};
