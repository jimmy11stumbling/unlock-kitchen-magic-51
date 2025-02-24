
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { StaffMember, PayrollEntry } from "@/types/staff";

interface PayrollHistoryProps {
  staff: StaffMember[];
  payrollHistory: PayrollEntry[];
  onGeneratePayStub: (payrollEntryId: number) => Promise<string>;
}

export const PayrollHistory = ({
  staff,
  payrollHistory,
  onGeneratePayStub,
}: PayrollHistoryProps) => {
  const handleGeneratePayStub = async (payrollEntryId: number) => {
    try {
      const documentUrl = await onGeneratePayStub(payrollEntryId);
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Error generating pay stub:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Member</TableHead>
            <TableHead>Pay Period</TableHead>
            <TableHead>Gross Pay</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollHistory.map((entry) => {
            const staffMember = staff.find(s => s.id === entry.staffId);
            return (
              <TableRow key={entry.id}>
                <TableCell>{staffMember?.name || 'Unknown'}</TableCell>
                <TableCell>
                  {format(new Date(entry.payPeriodStart), 'MMM d')} - {format(new Date(entry.payPeriodEnd), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>${entry.grossPay.toFixed(2)}</TableCell>
                <TableCell>${entry.netPay.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    entry.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGeneratePayStub(entry.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Pay Stub
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
