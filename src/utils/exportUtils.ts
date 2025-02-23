
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export type ExportFormat = 'csv' | 'pdf';

export const exportToCSV = (data: any[], filename: string) => {
  // Get all unique headers from all objects
  const headers = Array.from(
    new Set(
      data.flatMap(obj => Object.keys(obj))
    )
  ).filter(header => 
    // Filter out complex objects and arrays except for specific calculations
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
        if (['totalRevenue', 'laborCosts', 'inventoryCosts', 'netProfit', 'averageOrderValue'].includes(header)) {
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
  const headers = ['Date', 'Total Orders', 'Revenue', 'Labor Costs', 'Inventory Costs', 'Net Profit', 'Avg Order Value'];
  
  // Add title
  pdf.setFontSize(16);
  pdf.text('Daily Reports Summary', 14, 20);
  pdf.setFontSize(10);

  // Add date range
  const dateRange = `${data[data.length - 1].date} to ${data[0].date}`;
  pdf.text(`Period: ${dateRange}`, 14, 30);

  // Add metadata
  const today = new Date().toLocaleDateString();
  pdf.text(`Generated on: ${today}`, 14, 35);

  // Table configuration
  const startY = 45;
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
  data.forEach((row, rowIndex) => {
    const y = startY + ((rowIndex + 1) * lineHeight);
    
    // Check if we need a new page
    if (y >= pdf.internal.pageSize.height - 20) {
      pdf.addPage();
      return;
    }

    // Format and draw each cell
    [
      new Date(row.date).toLocaleDateString(),
      row.totalOrders.toString(),
      `$${row.totalRevenue.toFixed(2)}`,
      `$${row.laborCosts.toFixed(2)}`,
      `$${row.inventoryCosts.toFixed(2)}`,
      `$${row.netProfit.toFixed(2)}`,
      `$${row.averageOrderValue.toFixed(2)}`
    ].forEach((text, colIndex) => {
      pdf.text(text, margin + (colIndex * 25), y);
    });
  });

  pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportReport = (data: any[], filename: string, format: ExportFormat) => {
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
