
import { useState, useCallback } from 'react';
import { useCreateStaffMember, useUpdateStaffInfo, useUpdateStaffStatus } from '../services/mutations/staffMutations';
import { useReadStaffMembers } from '../services/queries/readQueries';
import type { StaffMember } from '@/types/staff/employee';
import { mapDatabaseToStaffMember } from '../utils/staffMapper';

export const useStaffManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { data: staffData, isLoading: isLoadingStaff } = useReadStaffMembers();
  const createStaffMutation = useCreateStaffMember();
  const updateStatusMutation = useUpdateStaffStatus();
  const updateInfoMutation = useUpdateStaffInfo();
  
  const staff = staffData || [];
  
  const addStaffMember = useCallback(async (data: Omit<StaffMember, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await createStaffMutation.mutateAsync(data);
      
      if (!result) {
        throw new Error('Failed to create staff member');
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createStaffMutation]);
  
  const updateStaffStatus = useCallback(async (staffId: number, newStatus: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateStatusMutation.mutateAsync({ 
        staffId, 
        status: newStatus 
      });
      
      if (!result) {
        throw new Error('Failed to update staff status');
      }
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update staff status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateStatusMutation]);
  
  const updateStaffInfo = useCallback(async (staffId: number, updates: Partial<StaffMember>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateInfoMutation.mutateAsync({
        staffId,
        updates
      });
      
      if (!result) {
        throw new Error('Failed to update staff information');
      }
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to update staff information');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateInfoMutation]);
  
  const getStaffMember = useCallback((id: number) => {
    return staff.find(member => member.id === id) || null;
  }, [staff]);
  
  const calculateAttendance = useCallback((staffId: number): number => {
    const member = getStaffMember(staffId);
    if (!member?.schedule) return 0;
    
    const scheduledDays = Object.values(member.schedule).filter(day => day !== "OFF").length;
    return Math.round((scheduledDays / 7) * 100);
  }, [getStaffMember]);
  
  const calculateWeeklyHours = useCallback((staffId: number): number => {
    const member = getStaffMember(staffId);
    if (!member?.schedule) return 0;
    
    return Object.values(member.schedule)
      .filter(time => time !== "OFF")
      .reduce((total, time) => {
        if (!time.includes('-')) return total;
        
        const [start, end] = time.split('-');
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  }, [getStaffMember]);
  
  return {
    staff,
    loading: loading || isLoadingStaff,
    error,
    addStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    getStaffMember,
    calculateAttendance,
    calculateWeeklyHours
  };
};
