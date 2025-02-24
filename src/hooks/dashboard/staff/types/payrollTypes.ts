
import type { StaffMember } from "@/types/staff";

export interface PayrollCalculation {
  grossPay: number;
  netPay: number;
  deductions: {
    federal: number;
    state: number;
    local: number;
    insurance: number;
    retirement: number;
  };
  taxes: {
    federal: number;
    state: number;
    local: number;
    fica: number;
  };
  hours: {
    regular: number;
    overtime: number;
  };
}

export interface PayrollSettings {
  payPeriod: "weekly" | "biweekly" | "monthly";
  paymentMethod: "direct_deposit" | "check";
  taxWithholding: {
    federal: number;
    state: number;
    local: number;
  };
  benefits: {
    insurance: number;
    retirement: number;
  };
}

export interface PayStubData {
  employeeId: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  earnings: {
    regular: number;
    overtime: number;
    bonus?: number;
    total: number;
  };
  deductions: {
    federal: number;
    state: number;
    local: number;
    insurance: number;
    retirement: number;
    total: number;
  };
  netPay: number;
}
