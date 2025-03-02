import { useMutation } from "react-query";
import { updateStaffMember } from "../services";
import type { StaffMember, StaffStatus } from "@/types/staff";
import { staffMappers } from "../../utils/staffMapper";

// Mutation to update staff member status
export const useUpdateStaffStatusMutation = () => {
  return useMutation(
    ({ staffId, newStatus }: { staffId: number; newStatus: StaffStatus }) => {
      return updateStaffMember(staffId, { status: newStatus });
    }
  );
};

// Mutation to update staff member information
export const useUpdateStaffInfoMutation = () => {
  return useMutation(
    ({ staffId, updates }: { staffId: number; updates: Partial<StaffMember> }) => {
      return updateStaffMember(staffId, updates);
    }
  );
};
