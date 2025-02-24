
import type { StaffMember } from "@/types/staff";
import type { PayrollCalculation, PayrollSettings } from "../types/payrollTypes";

const DEFAULT_TAX_RATES = {
  federal: 0.22,
  state: 0.08,
  local: 0.02,
  fica: 0.0765,
};

const DEFAULT_BENEFIT_RATES = {
  insurance: 0.05,
  retirement: 0.06,
};

export const calculatePayroll = (
  staff: StaffMember,
  hours: { regular: number; overtime: number },
  settings?: PayrollSettings
): PayrollCalculation => {
  // Calculate base pay
  const hourlyRate = staff.hourlyRate || staff.salary / 2080; // 2080 = 40 hours * 52 weeks
  const overtimeRate = staff.overtimeRate || hourlyRate * 1.5;
  
  const regularPay = hours.regular * hourlyRate;
  const overtimePay = hours.overtime * overtimeRate;
  const grossPay = regularPay + overtimePay;

  // Calculate taxes
  const taxRates = settings?.taxWithholding || DEFAULT_TAX_RATES;
  const taxes = {
    federal: grossPay * taxRates.federal,
    state: grossPay * taxRates.state,
    local: grossPay * taxRates.local,
    fica: grossPay * DEFAULT_TAX_RATES.fica,
  };

  // Calculate deductions
  const benefitRates = settings?.benefits || DEFAULT_BENEFIT_RATES;
  const deductions = {
    federal: taxes.federal,
    state: taxes.state,
    local: taxes.local,
    insurance: grossPay * benefitRates.insurance,
    retirement: grossPay * benefitRates.retirement,
  };

  const totalDeductions = Object.values(deductions).reduce((sum, val) => sum + val, 0);
  const netPay = grossPay - totalDeductions;

  return {
    grossPay,
    netPay,
    deductions,
    taxes,
    hours,
  };
};

export const generatePayStub = async (
  staffId: number,
  payrollData: PayrollCalculation,
  payPeriod: { start: string; end: string }
) => {
  const payStub = {
    employeeId: staffId,
    payPeriodStart: payPeriod.start,
    payPeriodEnd: payPeriod.end,
    payDate: new Date().toISOString(),
    earnings: {
      regular: payrollData.hours.regular * (payrollData.grossPay / (payrollData.hours.regular + payrollData.hours.overtime)),
      overtime: payrollData.hours.overtime * (payrollData.grossPay / (payrollData.hours.regular + payrollData.hours.overtime)),
      total: payrollData.grossPay,
    },
    deductions: {
      ...payrollData.deductions,
      total: Object.values(payrollData.deductions).reduce((sum, val) => sum + val, 0),
    },
    netPay: payrollData.netPay,
  };

  // In a production environment, you would:
  // 1. Save to database
  // 2. Generate PDF
  // 3. Send email notification
  // 4. Store in document management system

  return payStub;
};

export const validatePayrollSettings = (settings: PayrollSettings): boolean => {
  if (!settings.payPeriod || !settings.paymentMethod) {
    return false;
  }

  const validTaxRates = Object.values(settings.taxWithholding).every(
    rate => typeof rate === 'number' && rate >= 0 && rate <= 1
  );

  const validBenefitRates = Object.values(settings.benefits).every(
    rate => typeof rate === 'number' && rate >= 0 && rate <= 1
  );

  return validTaxRates && validBenefitRates;
};
