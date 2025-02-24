
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  tax_id?: string;
  website?: string;
  status: 'active' | 'inactive';
  payment_terms?: any;
  delivery_terms?: any;
  rating?: number;
  created_at?: string;
  updated_at?: string;
}

export const useSupplierManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Supplier[];
    }
  });

  const addSupplierMutation = useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert(supplier)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Added",
        description: "New supplier has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add supplier: " + error.message,
        variant: "destructive"
      });
    }
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from('suppliers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Updated",
        description: "Supplier information has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update supplier: " + error.message,
        variant: "destructive"
      });
    }
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast({
        title: "Supplier Deleted",
        description: "Supplier has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete supplier: " + error.message,
        variant: "destructive"
      });
    }
  });

  return {
    suppliers,
    isLoading,
    addSupplier: (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => 
      addSupplierMutation.mutate(supplier),
    updateSupplier: (id: string, updates: Partial<Omit<Supplier, 'id'>>) => 
      updateSupplierMutation.mutate({ id, ...updates }),
    deleteSupplier: (id: string) => deleteSupplierMutation.mutate(id),
  };
};
