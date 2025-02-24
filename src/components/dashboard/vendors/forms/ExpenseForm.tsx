
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Expense, PaymentMethod } from "@/types/vendor";
import { vendorService } from "../services/vendorService";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  vendorId: z.number(),
  amount: z.number().min(0),
  date: z.string(),
  category: z.string(),
  description: z.string(),
  paymentMethod: z.enum(["cash", "card", "bank_transfer", "check"]),
  taxDeductible: z.boolean(),
  status: z.enum(["pending", "paid", "void"])
});

export interface ExpenseFormProps {
  expense?: Expense;
  initialVendorId?: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const ExpenseForm = ({ expense, initialVendorId, onSuccess, onClose }: ExpenseFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorId: initialVendorId || expense?.vendorId || 0,
      amount: expense?.amount || 0,
      date: expense?.date || new Date().toISOString().split('T')[0],
      category: expense?.category || '',
      description: expense?.description || '',
      paymentMethod: (expense?.paymentMethod as PaymentMethod) || 'cash',
      taxDeductible: expense?.taxDeductible || false,
      status: expense?.status || 'pending'
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await vendorService.addExpense({
        vendorId: data.vendorId,
        amount: data.amount,
        date: data.date,
        category: data.category,
        description: data.description,
        paymentMethod: data.paymentMethod,
        taxDeductible: data.taxDeductible,
        status: data.status,
      });
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting expense form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxDeductible"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Deductible</FormLabel>
              <FormControl>
                <input 
                  type="checkbox"
                  checked={field.value}
                  onChange={e => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="void">Void</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};
