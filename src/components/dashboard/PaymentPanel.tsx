
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { CreditCard, DollarSign, Receipt } from "lucide-react";
import type { PaymentTransaction } from "@/types/staff";

interface PaymentPanelProps {
  payments: PaymentTransaction[];
  onProcessPayment: (payment: Omit<PaymentTransaction, "id" | "timestamp">) => void;
}

export const PaymentPanel = ({ payments, onProcessPayment }: PaymentPanelProps) => {
  const [newPayment, setNewPayment] = useState({
    orderId: 0,
    amount: 0,
    method: "credit" as PaymentTransaction["method"],
    status: "pending" as PaymentTransaction["status"],
  });

  const getStatusColor = (status: PaymentTransaction["status"]) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "pending": return "text-yellow-600";
      case "failed": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Payment Processing</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <DollarSign className="w-4 h-4 mr-2" />
              New Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Process New Payment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Order ID</label>
                <Input
                  type="number"
                  value={newPayment.orderId}
                  onChange={(e) => setNewPayment({ ...newPayment, orderId: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <Input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value: PaymentTransaction["method"]) =>
                    setNewPayment({ ...newPayment, method: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="debit">Debit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  onProcessPayment(newPayment);
                  setNewPayment({
                    orderId: 0,
                    amount: 0,
                    method: "credit",
                    status: "pending",
                  });
                }}
              >
                Process Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{payments.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Average Transaction</p>
                <p className="text-2xl font-bold">
                  ${(payments.reduce((sum, payment) => sum + payment.amount, 0) / payments.length || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>#{payment.id}</TableCell>
                <TableCell>#{payment.orderId}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{payment.method}</TableCell>
                <TableCell className={getStatusColor(payment.status)}>
                  {payment.status}
                </TableCell>
                <TableCell>{new Date(payment.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
