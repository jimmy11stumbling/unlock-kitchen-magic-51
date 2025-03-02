
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: string;
  method: string;
  reference: string;
}

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  onClose: () => void;
}

export const PaymentDetailsDialog = ({ payment, onClose }: PaymentDetailsDialogProps) => {
  if (!payment) return null;

  return (
    <Dialog open={payment !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Payment ID</h4>
              <p>PMT-{payment.id.substring(0, 8)}</p>
            </div>
            <div>
              <h4 className="font-medium">Date</h4>
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>{new Date(payment.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <h4 className="font-medium">Amount</h4>
              <p className="text-lg font-bold">${payment.amount.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="font-medium">Method</h4>
              <p className="capitalize">{payment.method.replace('_', ' ')}</p>
            </div>
            <div>
              <h4 className="font-medium">Status</h4>
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
            </div>
            <div>
              <h4 className="font-medium">Reference</h4>
              <p>{payment.reference || "No reference provided"}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
