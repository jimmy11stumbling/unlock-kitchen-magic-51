
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { StaffMember } from "@/types/staff";
import { hasAdminAccess, getStaffPermissions } from "../services/queries/staffQueries";

export const useStaffAuth = (currentUser: StaffMember | null) => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<string[]>([]);

  const checkPermissions = async (staffId: number) => {
    try {
      const userPermissions = await getStaffPermissions(staffId);
      setPermissions(userPermissions);
      return userPermissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      toast({
        title: "Error",
        description: "Failed to check staff permissions",
        variant: "destructive",
      });
      return [];
    }
  };

  const isAdmin = hasAdminAccess(currentUser);

  const verifyAccess = (requiredPermission: 'admin' | 'basic' = 'basic'): boolean => {
    if (requiredPermission === 'admin') {
      return isAdmin;
    }
    return true;
  };

  return {
    isAdmin,
    permissions,
    checkPermissions,
    verifyAccess,
  };
};
