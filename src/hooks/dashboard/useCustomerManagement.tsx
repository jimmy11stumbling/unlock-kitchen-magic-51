
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CustomerProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  preferences: Record<string, any>;
  last_visit?: string;
  created_at: string;
}

export interface LoyaltyPoints {
  id: string;
  customer_id: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  created_at: string;
  updated_at: string;
}

export const useCustomerManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch customers
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .select(`
          *,
          loyalty_points (*)
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  // Add new customer
  const addCustomerMutation = useMutation({
    mutationFn: async (customer: Omit<CustomerProfile, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .insert(customer)
        .select()
        .single();

      if (error) throw error;

      // Create initial loyalty points entry
      const { error: loyaltyError } = await supabase
        .from('loyalty_points')
        .insert({
          customer_id: data.id,
          points: 0,
          tier: 'bronze'
        });

      if (loyaltyError) throw loyaltyError;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Customer Added",
        description: "New customer profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add customer: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Update customer points
  const updatePointsMutation = useMutation({
    mutationFn: async ({ customerId, points }: { customerId: string; points: number }) => {
      const { data: currentData, error: fetchError } = await supabase
        .from('loyalty_points')
        .select('points, tier')
        .eq('customer_id', customerId)
        .single();

      if (fetchError) throw fetchError;

      const newPoints = (currentData?.points || 0) + points;
      const newTier = calculateTier(newPoints);

      const { data, error } = await supabase
        .from('loyalty_points')
        .update({ 
          points: newPoints,
          tier: newTier,
          updated_at: new Date().toISOString()
        })
        .eq('customer_id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Points Updated",
        description: "Customer loyalty points have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update points: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Calculate loyalty tier based on points
  const calculateTier = (points: number): LoyaltyPoints['tier'] => {
    if (points >= 1000) return 'platinum';
    if (points >= 500) return 'gold';
    if (points >= 200) return 'silver';
    return 'bronze';
  };

  // Update customer preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async ({ 
      customerId, 
      preferences 
    }: { 
      customerId: string; 
      preferences: Record<string, any> 
    }) => {
      const { data, error } = await supabase
        .from('customer_profiles')
        .update({ preferences })
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Preferences Updated",
        description: "Customer preferences have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update preferences: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    customers,
    isLoading,
    addCustomer: (customer: Omit<CustomerProfile, 'id' | 'created_at'>) => 
      addCustomerMutation.mutate(customer),
    updatePoints: (customerId: string, points: number) => 
      updatePointsMutation.mutate({ customerId, points }),
    updatePreferences: (customerId: string, preferences: Record<string, any>) =>
      updatePreferencesMutation.mutate({ customerId, preferences }),
    calculateTier
  };
};
