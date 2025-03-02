
import React from 'react';
import { PayrollEntry, PayrollSettings } from '@/types/staff/payroll';
import { StaffMember } from '@/types/staff';

export interface PayrollTabContentProps {
  staff: StaffMember[];
  selectedStaffId: number;
  payrollHistory?: PayrollEntry[];
  payrollEntries?: PayrollEntry[];
  activeTab?: string;
  staffId?: number;
}

export const PayrollTabContent: React.FC<PayrollTabContentProps> = ({ 
  staff, 
  selectedStaffId, 
  payrollHistory = [] 
}) => {
  const selectedStaff = staff.find(s => s.id === selectedStaffId);
  
  if (!selectedStaff) {
    return <div>No staff member selected</div>;
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Payroll Information for {selectedStaff.name}</h3>
      
      {payrollHistory.length > 0 ? (
        <div className="space-y-4">
          {payrollHistory.map(entry => (
            <div key={entry.id} className="p-4 border rounded-md">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">Pay Period: {entry.payPeriodStart} to {entry.payPeriodEnd}</p>
                  <p>Status: {entry.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${entry.netPay.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Gross: ${entry.grossPay.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No payroll history found for this staff member.</p>
      )}
      
      <div className="mt-6">
        <h4 className="text-md font-medium">Payroll Settings</h4>
        {selectedStaff.payrollSettings ? (
          <div className="mt-2 space-y-2">
            <p>Payment Method: {selectedStaff.payrollSettings.paymentMethod || 'Not set'}</p>
            <p>Federal Tax Withholding: {selectedStaff.payrollSettings.federalTaxWithholding || 0}%</p>
            <p>State Tax Withholding: {selectedStaff.payrollSettings.stateTaxWithholding || 0}%</p>
          </div>
        ) : (
          <p>No payroll settings configured for this staff member.</p>
        )}
      </div>
    </div>
  );
};
