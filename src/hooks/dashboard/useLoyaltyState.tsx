
import { useCustomerManagement } from './useCustomerManagement';
import { useToast } from "@/components/ui/use-toast";

export const useLoyaltyState = () => {
  const { toast } = useToast();
  const { 
    customers,
    isLoading,
    addCustomer,
    updatePoints,
    updatePreferences,
    calculateTier
  } = useCustomerManagement();

  const addMember = async (memberData: { 
    name: string;
    email: string;
    phone?: string;
  }) => {
    try {
      await addCustomer({
        ...memberData,
        preferences: {}
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Error",
        description: "Failed to add member to loyalty program",
        variant: "destructive",
      });
    }
  };

  const addPoints = async (memberId: string, points: number) => {
    try {
      await updatePoints(memberId, points);
    } catch (error) {
      console.error('Error adding points:', error);
      toast({
        title: "Error",
        description: "Failed to add loyalty points",
        variant: "destructive",
      });
    }
  };

  return {
    members: customers,
    isLoading,
    addMember,
    addPoints,
  };
};
