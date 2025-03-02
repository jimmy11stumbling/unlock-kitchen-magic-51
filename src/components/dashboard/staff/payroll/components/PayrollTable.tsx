
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayrollEntry } from '@/types/staff';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface PayrollTableProps {
  entries: PayrollEntry[];
  onGeneratePayStub?: (payrollId: number) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ entries, onGeneratePayStub }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Period</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Gross Pay</TableHead>
          <TableHead>Deductions</TableHead>
          <TableHead>Net Pay</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="font-medium">{entry.payPeriodStart}</div>
                <div className="text-sm text-muted-foreground">to {entry.payPeriodEnd}</div>
              </TableCell>
              <TableCell>
                <div>{entry.regularHours} Reg</div>
                {entry.overtimeHours > 0 && (
                  <div className="text-orange-500">{entry.overtimeHours} OT</div>
                )}
              </TableCell>
              <TableCell>${entry.grossPay.toFixed(2)}</TableCell>
              <TableCell>
                <div>Federal: ${entry.deductions.federalTax.toFixed(2)}</div>
                <div>State: ${entry.deductions.stateTax.toFixed(2)}</div>
                {entry.deductions.healthInsurance && (
                  <div>Insurance: ${entry.deductions.healthInsurance.toFixed(2)}</div>
                )}
              </TableCell>
              <TableCell className="font-medium">${entry.netPay.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  entry.status === 'paid' ? 'bg-green-100 text-green-800' :
                  entry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  entry.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onGeneratePayStub && onGeneratePayStub(entry.id)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Pay Stub
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-4">
              No payroll entries found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default PayrollTable;
