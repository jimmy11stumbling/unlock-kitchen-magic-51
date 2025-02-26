import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  CreditCard,
  Wallet,
  Smartphone,
  Receipt,
  Check,
  Download,
} from "lucide-react";

interface PaymentTransaction {
  id: number;
  orderId: number;
  amount: number;
  method: "cash" | "card" | "mobile";
  status: "pending" | "completed" | "failed" | "refunded";
  timestamp: string;
}

const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 1,
    orderId: 101,
    amount: 45.50,
    method: "card",
    status: "completed",
    timestamp: "2024-03-23T14:30:00",
  },
  {
    id: 2,
    orderId: 102,
    amount: 22.75,
    method: "cash",
    status: "completed",
    timestamp: "2024-03-23T15:00:00",
  },
  {
    id: 3,
    orderId: 103,
    amount: 78.20,
    method: "mobile",
    status: "completed",
    timestamp: "2024-03-23T15:30:00",
  },
];

export const PaymentPanel = () => {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number | "">("");
  const [orderId, setOrderId] = useState<number | "">("");

  const handlePayment = (method: "cash" | "card" | "mobile") => {
    const paymentMethod = method;

    if (!amount || !orderId) {
      toast({
        title: "Error",
        description: "Please enter both amount and order ID.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Payment processed",
      description: `Payment of $${amount} processed for order #${orderId} via ${paymentMethod}.`,
    });

    setAmount("");
    setOrderId("");
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Process Payment</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orderId">Order ID</Label>
          <Input
            type="number"
            id="orderId"
            placeholder="Enter order ID"
            value={orderId}
            onChange={(e) => setOrderId(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            type="number"
            id="amount"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex justify-around">
        <Button onClick={() => handlePayment("cash")} className="gap-2">
          <Wallet className="h-4 w-4" />
          Cash
        </Button>
        <Button onClick={() => handlePayment("card")} className="gap-2">
          <CreditCard className="h-4 w-4" />
          Card
        </Button>
        <Button onClick={() => handlePayment("mobile")} className="gap-2">
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
      </div>

      <div>
        <h3 className="text-md font-semibold">Recent Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TRANSACTIONS.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.orderId}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.method}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>{transaction.timestamp}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Receipt
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
