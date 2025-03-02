
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { vendorService } from "./services/vendorService";
import { PaymentDetailsDialog } from "./payments/PaymentDetailsDialog";
import { AddPaymentDialog } from "./payments/AddPaymentDialog";

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  reference: string;
}

interface PaymentHistoryProps {
  payments: Payment[];
  vendorId: number;
}

export const PaymentHistory = ({ payments, vendorId }: PaymentHistoryProps) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const { toast } = useToast();

  const handleCreatePayment = async (paymentData: any) => {
    try {
      // Fix the function call to include all required parameters
      await vendorService.createPayment(vendorId, paymentData.amount, paymentData.method, paymentData.reference);
      
      toast({
        title: "Payment created",
        description: "A new payment record has been created."
      });
      
      setShowAddPayment(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create payment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment History</h3>
        <Button variant="outline" size="sm" onClick={() => setShowAddPayment(true)}>
          Record Payment
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No payment records found
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">PMT-{payment.id.substring(0, 8)}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{payment.method.replace('_', ' ')}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "default"
                          : payment.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.reference || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog 
        payment={selectedPayment} 
        onClose={() => setSelectedPayment(null)} 
      />

      {/* Add Payment Dialog */}
      <AddPaymentDialog 
        isOpen={showAddPayment} 
        onClose={() => setShowAddPayment(false)}
        onConfirm={handleCreatePayment}
        vendorId={vendorId}
      />
    </div>
  );
};
