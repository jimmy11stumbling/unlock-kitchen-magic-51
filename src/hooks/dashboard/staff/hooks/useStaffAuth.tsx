
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from '@/types/staff';
import { supabase } from '@/integrations/supabase/client';
import { hasAdminAccess, getStaffPermissions } from '../services/queries';

export const useStaffAuth = (staffMember: StaffMember | null) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!staffMember) return;
      
      setLoading(true);
      try {
        const staffPermissions = await getStaffPermissions(staffMember.id);
        setPermissions(staffPermissions);
      } catch (error) {
        console.error('Error fetching staff permissions:', error);
        toast({
          title: "Error",
          description: "Failed to load staff permissions",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [staffMember, toast]);

  const hasPermission = (permission: string): boolean => {
    if (!staffMember) return false;
    
    // Manager role has all permissions
    if (hasAdminAccess(staffMember)) return true;
    
    return permissions.includes(permission);
  };

  const isAdmin = (): boolean => {
    return hasAdminAccess(staffMember);
  };

  return {
    permissions,
    hasPermission,
    isAdmin,
    loading
  };
};
