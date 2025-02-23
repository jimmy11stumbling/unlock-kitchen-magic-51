
import { saveAs } from 'file-saver';

export const exportToCSV = (data: any[], filename: string) => {
  // Convert data to CSV format
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle nested objects and arrays
        const cellContent = typeof value === 'object' ? 
          JSON.stringify(value).replace(/,/g, ';') : 
          value;
        // Escape commas and quotes
        return `"${String(cellContent).replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and save the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
};
