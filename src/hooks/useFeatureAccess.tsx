
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';

export function useFeatureAccess(featureName: string) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function checkAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasAccess(false);
          return;
        }

        const { data, error } = await supabase.rpc('has_feature_access', {
          user_id: user.id,
          feature_name: featureName,
        });

        if (error) throw error;
        setHasAccess(!!data);
      } catch (error) {
        console.error('Error checking feature access:', error);
        toast({
          title: "Error",
          description: "Could not verify feature access",
          variant: "destructive",
        });
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [featureName, toast]);

  return { hasAccess, isLoading };
}
