
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PayrollEntry } from '@/types/staff';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PayrollChartProps {
  entries: PayrollEntry[];
}

const PayrollChart: React.FC<PayrollChartProps> = ({ entries }) => {
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.payPeriodStart).getTime() - new Date(b.payPeriodStart).getTime()
  );

  // Create chart data
  const chartData = sortedEntries.map(entry => ({
    period: `${new Date(entry.payPeriodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
    grossPay: entry.grossPay,
    netPay: entry.netPay,
    deductions: entry.grossPay - entry.netPay
  }));

  // Format currency for the tooltip
  const formatCurrency = (value: any) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Summary</CardTitle>
        <CardDescription>View your earnings and deductions over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="grossPay" name="Gross Pay" fill="#4f46e5" />
              <Bar dataKey="netPay" name="Net Pay" fill="#84cc16" />
              <Bar dataKey="deductions" name="Deductions" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollChart;
