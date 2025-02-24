
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupplierIngredient } from "@/hooks/dashboard/useSupplierIngredients";
import type { Ingredient } from "@/hooks/dashboard/useIngredientManagement";

const formSchema = z.object({
  supplier_id: z.string(),
  ingredient_id: z.number(),
  unit_price: z.number().min(0, "Price must be positive"),
  minimum_order_quantity: z.number().min(1, "Minimum order must be at least 1"),
  lead_time_days: z.number().min(0, "Lead time cannot be negative"),
});

interface SupplierIngredientFormProps {
  supplierId: string;
  supplierIngredient?: SupplierIngredient;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
}

export const SupplierIngredientForm = ({
  supplierId,
  supplierIngredient,
  onSubmit,
  onCancel,
}: SupplierIngredientFormProps) => {
  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Ingredient[];
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      supplier_id: supplierId,
      ingredient_id: supplierIngredient?.ingredient_id || 0,
      unit_price: supplierIngredient?.unit_price || 0,
      minimum_order_quantity: supplierIngredient?.minimum_order_quantity || 1,
      lead_time_days: supplierIngredient?.lead_time_days || 1,
    },
  });

  if (isLoading) {
    return <div>Loading ingredients...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ingredient_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an ingredient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ingredients.map((ingredient) => (
                    <SelectItem
                      key={ingredient.id}
                      value={ingredient.id.toString()}
                    >
                      {ingredient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="minimum_order_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Order Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lead_time_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lead Time (days)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {supplierIngredient ? "Update" : "Add"} Ingredient
          </Button>
        </div>
      </form>
    </Form>
  );
};
