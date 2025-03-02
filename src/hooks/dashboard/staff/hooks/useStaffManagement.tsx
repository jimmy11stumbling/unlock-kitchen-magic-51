
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { StaffMember } from '@/types/staff/employee';
import { mapDatabaseToStaffMember } from '../utils/staffMapper';

export const useStaffManagement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  
  // Instead of using useReadStaffMembers which doesn't exist, let's implement fetchStaffMembers
  const fetchStaffMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select('*');
        
      if (error) throw new Error(error.message);
      
      // Map database result to StaffMember type
      const staffMembers = (data || []).map(item => mapDatabaseToStaffMember(item));
      setStaff(staffMembers);
      return staffMembers;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch staff members');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createStaffMember = useCallback(async (data: Omit<StaffMember, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Transform staff member data for database
      const { data: result, error } = await supabase
        .from('staff_members')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          department: data.department,
          status: data.status || 'active'
        }])
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      const newStaffMember = mapDatabaseToStaffMember(result);
      setStaff(prev => [...prev, newStaffMember]);
      
      return newStaffMember;
    } catch (err: any) {
      setError(err.message || 'Failed to add staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateStaffStatus = useCallback(async (staffId: number, newStatus: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ status: newStatus })
        .eq('id', staffId);
      
      if (error) throw new Error(error.message);
      
      setStaff(prev => prev.map(member => 
        member.id === staffId ? { ...member, status: newStatus as any } : member
      ));
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update staff status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const updateStaffInfo = useCallback(async (staffId: number, updates: Partial<StaffMember>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('staff_members')
        .update(updates)
        .eq('id', staffId);
      
      if (error) throw new Error(error.message);
      
      setStaff(prev => prev.map(member => 
        member.id === staffId ? { ...member, ...updates } : member
      ));
      
      return { ...staff.find(s => s.id === staffId), ...updates };
    } catch (err: any) {
      setError(err.message || 'Failed to update staff information');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [staff]);
  
  const getStaffMember = useCallback((id: number) => {
    return staff.find(member => member.id === id) || null;
  }, [staff]);
  
  const calculateAttendance = useCallback((staffId: number): number => {
    const member = getStaffMember(staffId);
    if (!member?.schedule) return 0;
    
    const scheduledDays = Object.values(member.schedule).filter(day => 
      typeof day === 'string' && day !== "OFF"
    ).length;
    
    return Math.round((scheduledDays / 7) * 100);
  }, [getStaffMember]);
  
  const calculateWeeklyHours = useCallback((staffId: number): number => {
    const member = getStaffMember(staffId);
    if (!member?.schedule) return 0;
    
    return Object.values(member.schedule)
      .filter(time => typeof time === 'string' && time !== "OFF")
      .reduce((total, time) => {
        if (typeof time !== 'string' || !time.includes('-')) return total;
        
        const [start, end] = time.split('-');
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        
        return total + (endHour > startHour ? endHour - startHour : 24 - startHour + endHour);
      }, 0);
  }, [getStaffMember]);
  
  return {
    staff,
    loading,
    error,
    fetchStaffMembers,
    addStaffMember: createStaffMember,
    updateStaffStatus,
    updateStaffInfo,
    getStaffMember,
    calculateAttendance,
    calculateWeeklyHours
  };
};
