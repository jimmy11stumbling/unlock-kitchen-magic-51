
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStaffMember, updateStaffInfo, updateStaffStatus } from '../queries/writeQueries';
import type { StaffMember } from '@/types/staff/employee';
import { staffMappers } from '../../utils/staffMapper';

export const useCreateStaffMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (staffData: Omit<StaffMember, 'id'>) => {
      return await createStaffMember(staffData);
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
      return await updateStaffStatus(staffId, status as any);
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
      return await updateStaffInfo(staffId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
};
