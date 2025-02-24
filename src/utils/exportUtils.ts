
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import type { DailyReport, InventoryItem } from "@/types/staff";

export const exportToPDF = async (data: any[], title: string): Promise<void> => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Add data
  doc.setFontSize(12);
  let yPos = 40;
  
  data.forEach((item) => {
    const text = JSON.stringify(item, null, 2);
    doc.text(text, 20, yPos);
    yPos += 10;
    
    if (yPos > 280) {
      doc.addPage();
      yPos = 20;
    }
  });
  
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToCSV = <T>(data: T[], filename: string): void => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Modern browsers
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportReport = async (
  reports: DailyReport[],
  filename: string,
  format: 'csv' | 'pdf'
): Promise<void> => {
  if (format === 'csv') {
    exportToCSV(reports, filename);
  } else {
    await exportToPDF(reports, filename);
  }
};

export const exportData = <T>(data: T[], filename: string, format: 'csv' | 'pdf'): void => {
  if (format === 'csv') {
    exportToCSV(data, filename);
  } else {
    exportToPDF(data, filename);
  }
};

export const exportInventory = (items: InventoryItem[], filename: string, format: 'csv' | 'pdf'): void => {
  exportData(items, filename, format);
};

export const importFromCSV = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};
