
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFeatureAccess = (featureName: string) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setHasAccess(false);
          return;
        }

        const { data, error } = await supabase.rpc('has_feature_access', {
          user_id: user.id,
          feature_name: featureName,
        });

        if (error) throw error;
        setHasAccess(data || false);
      } catch (error) {
        console.error('Error checking feature access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkFeatureAccess();
  }, [featureName]);

  return { hasAccess, loading };
};
