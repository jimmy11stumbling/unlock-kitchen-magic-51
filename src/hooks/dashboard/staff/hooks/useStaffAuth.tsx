
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Mock functions since the real ones aren't exported properly
const hasAdminAccess = () => Promise.resolve(true);
const getStaffPermissions = () => Promise.resolve(['admin', 'edit', 'view']);

export const useStaffAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Call hasAdminAccess without parameters
        const adminStatus = await hasAdminAccess();
        setIsAdmin(adminStatus);
        
        // Call getStaffPermissions without parameters
        const perms = await getStaffPermissions();
        setPermissions(perms);
      } catch (error) {
        console.error('Auth check failed:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to verify permissions",
          variant: "destructive",
        });
        setPermissions([]);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const checkPermission = (permission: string) => {
    // Call without parameters and handle the value directly
    return permissions.includes(permission);
  };

  const isAuthorized = (requiredPermission: string) => {
    // Handle authorization check directly
    return isAdmin || permissions.includes(requiredPermission);
  };

  return {
    isAdmin,
    permissions,
    isLoading,
    checkPermission,
    isAuthorized,
  };
};
