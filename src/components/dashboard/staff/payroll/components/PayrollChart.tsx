
import React from 'react';
import { PayrollEntry } from '@/types/staff/payroll';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PayrollChartProps {
  entries: PayrollEntry[];
}

const PayrollChart: React.FC<PayrollChartProps> = ({ entries }) => {
  // Transform entries into chart data
  const chartData = entries.map(entry => ({
    period: `${new Date(entry.payPeriodStart).toLocaleDateString()} - ${new Date(entry.payPeriodEnd).toLocaleDateString()}`,
    grossPay: entry.grossPay,
    netPay: entry.netPay,
    deductions: entry.grossPay - entry.netPay
  }));

  return (
    <div className="h-72 w-full">
      {entries.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="grossPay" name="Gross Pay" fill="#8884d8" />
            <Bar dataKey="netPay" name="Net Pay" fill="#82ca9d" />
            <Bar dataKey="deductions" name="Deductions" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-md">
          <p className="text-gray-500">No payroll data available to display chart</p>
        </div>
      )}
    </div>
  );
};

export default PayrollChart;
