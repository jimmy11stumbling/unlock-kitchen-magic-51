
import { Card } from "@/components/ui/card";
import type { AccountingSummary as AccountingSummaryType } from "@/types/vendor";

interface AccountingSummaryProps {
  summary: AccountingSummaryType;
}

export const AccountingSummary = ({ summary }: AccountingSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Total Expenses</h3>
        <p className="text-2xl">${summary.totalExpenses.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Tax Deductible Amount</h3>
        <p className="text-2xl">${summary.taxDeductibleAmount.toFixed(2)}</p>
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold mb-2">Pending Payments</h3>
        <p className="text-2xl">${summary.totalPending.toFixed(2)}</p>
      </Card>
    </div>
  );
};
