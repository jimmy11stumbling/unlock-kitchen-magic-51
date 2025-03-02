
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStaffMember, updateStaffInfo, updateStaffStatus } from '../queries/writeQueries';
import type { StaffMember } from '@/types/staff/employee';
import { mapStaffMemberToDatabase } from '../../utils/staffMapper';
import { mapStaffStatusToDatabase } from '../../types/databaseTypes';

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: Omit<StaffMember, 'id'>) => {
      // Fix status before sending to database
      const updatedData = { ...staffData };
      if (updatedData.status) {
        // @ts-ignore - we'll handle the type conversion in the function
        updatedData.status = mapStaffStatusToDatabase(updatedData.status);
      }
      return await createStaffMember(updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaffStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      staffId, 
      status 
    }: { 
      staffId: number; 
      status: string; 
    }) => {
      // Map status to database compatible value
      const dbStatus = mapStaffStatusToDatabase(status as any);
      return await updateStaffStatus(staffId, dbStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};

export const useUpdateStaffInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      staffId, 
      updates 
    }: { 
      staffId: number; 
      updates: Partial<StaffMember>; 
    }) => {
      // Fix status if it exists
      const updatedInfo = { ...updates };
      if (updatedInfo.status) {
        // @ts-ignore - we'll handle the type conversion
        updatedInfo.status = mapStaffStatusToDatabase(updatedInfo.status);
      }
      
      return await updateStaffInfo(staffId, updatedInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
