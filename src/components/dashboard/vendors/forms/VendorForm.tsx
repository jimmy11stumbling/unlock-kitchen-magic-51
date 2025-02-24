
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Vendor } from "@/types/vendor";
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

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  taxId: z.string().optional(),
  paymentTerms: z.enum(["cash", "card", "bank_transfer", "check"]),
  notes: z.string().optional()
});

export interface VendorFormProps {
  vendor?: Vendor;
  onSuccess?: () => void;
  onClose?: () => void;
}

export const VendorForm = ({ vendor, onSuccess, onClose }: VendorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: vendor?.name || '',
      email: vendor?.email || '',
      phone: vendor?.phone || '',
      address: vendor?.address || '',
      taxId: vendor?.taxId || '',
      paymentTerms: vendor?.paymentTerms || 'cash',
      notes: vendor?.notes || ''
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (vendor) {
        await vendorService.updateVendor(vendor.id.toString(), {
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          taxId: data.taxId || '',
          paymentTerms: data.paymentTerms,
          notes: data.notes || ''
        });
      } else {
        await vendorService.addVendor({
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          taxId: data.taxId || '',
          status: 'active',
          paymentTerms: data.paymentTerms,
          notes: data.notes || ''
        });
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting vendor form:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentTerms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="check">Check</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Input {...field} />
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
