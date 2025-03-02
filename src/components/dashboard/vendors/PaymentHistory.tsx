
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { CalendarIcon, Receipt } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { vendorService } from "./services/vendorService";

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

  const handleCreatePayment = async () => {
    try {
      await vendorService.createPayment({ 
        vendorId, 
        amount: 0,
        date: new Date().toISOString(),
        method: "bank_transfer", 
        status: "pending" 
      });
      
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
      <Dialog open={selectedPayment !== null} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Payment ID</h4>
                  <p>PMT-{selectedPayment.id.substring(0, 8)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Date</h4>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{new Date(selectedPayment.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Amount</h4>
                  <p className="text-lg font-bold">${selectedPayment.amount.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Method</h4>
                  <p className="capitalize">{selectedPayment.method.replace('_', ' ')}</p>
                </div>
                <div>
                  <h4 className="font-medium">Status</h4>
                  <Badge
                    variant={
                      selectedPayment.status === "completed"
                        ? "default"
                        : selectedPayment.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Reference</h4>
                  <p>{selectedPayment.reference || "No reference provided"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record New Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>This will create a new payment record for this vendor.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddPayment(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePayment}>
                Create Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
