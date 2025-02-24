
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface CustomerFeedback {
  id: string;
  order_id: number;
  customer_id: string;
  rating: number;
  comment?: string;
  status: 'pending' | 'resolved';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
}

export const useFeedbackManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch feedback
  const { data: feedback = [], isLoading } = useQuery({
    queryKey: ['customer-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .select(`
          *,
          customer_profiles (name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Add new feedback
  const addFeedbackMutation = useMutation({
    mutationFn: async (feedbackData: Omit<CustomerFeedback, 'id' | 'created_at' | 'status'>) => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .insert({
          ...feedbackData,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-feedback'] });
      toast({
        title: "Feedback Submitted",
        description: "Customer feedback has been recorded successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Resolve feedback
  const resolveFeedbackMutation = useMutation({
    mutationFn: async ({ 
      feedbackId, 
      resolvedBy 
    }: { 
      feedbackId: string; 
      resolvedBy: string; 
    }) => {
      const { data, error } = await supabase
        .from('customer_feedback')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy
        })
        .eq('id', feedbackId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-feedback'] });
      toast({
        title: "Feedback Resolved",
        description: "Customer feedback has been marked as resolved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to resolve feedback: " + error.message,
        variant: "destructive",
      });
    }
  });

  return {
    feedback,
    isLoading,
    addFeedback: (data: Omit<CustomerFeedback, 'id' | 'created_at' | 'status'>) => 
      addFeedbackMutation.mutate(data),
    resolveFeedback: (feedbackId: string, resolvedBy: string) =>
      resolveFeedbackMutation.mutate({ feedbackId, resolvedBy }),
  };
};
