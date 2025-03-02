
import React from 'react';
import { StaffMember } from '@/types/staff';
import { PayrollPanel } from './PayrollPanel';

interface PayrollPanelWrapperProps {
  staff: StaffMember[];
}

export const PayrollPanelWrapper: React.FC<PayrollPanelWrapperProps> = ({ staff }) => {
  const handleGeneratePayroll = async (staffId: number, startDate: string, endDate: string) => {
    console.log(`Generating payroll for staff ${staffId} from ${startDate} to ${endDate}`);
    return Promise.resolve();
  };

  const handleGeneratePayStub = async (payrollEntryId: number) => {
    console.log(`Generating pay stub for payroll entry ${payrollEntryId}`);
    return Promise.resolve("https://example.com/paystub.pdf");
  };

  const handleUpdatePayrollSettings = async (staffId: number, settings: any) => {
    console.log(`Updating payroll settings for staff ${staffId}`, settings);
    return Promise.resolve();
  };

  return (
    <PayrollPanel
      staff={staff}
      onGeneratePayroll={handleGeneratePayroll}
      onGeneratePayStub={handleGeneratePayStub}
      onUpdatePayrollSettings={handleUpdatePayrollSettings}
    />
  );
};
