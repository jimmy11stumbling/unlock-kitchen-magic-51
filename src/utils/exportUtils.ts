
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

export const exportToCSV = <T extends Record<string, any>>(
  data: T[],
  filename: string
) => {
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value instanceof Date) {
          return format(value, 'yyyy-MM-dd HH:mm:ss');
        }
        return typeof value === 'string' ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
};
