
import { StaffPanel } from "@/components/dashboard/StaffPanel";
import { useDashboardState } from "@/hooks/useDashboardState";

const Staff = () => {
  const { staff, addStaffMember, updateStaffStatus, addShift } = useDashboardState();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Staff Management</h1>
      <StaffPanel
        staff={staff}
        onAddStaff={addStaffMember}
        onUpdateStatus={updateStaffStatus}
        onAddShift={addShift}
      />
    </div>
  );
};

export default Staff;
