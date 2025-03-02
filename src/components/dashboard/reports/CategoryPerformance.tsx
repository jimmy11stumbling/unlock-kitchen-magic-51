
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { DailyReport } from "@/types/staff";

interface CategoryPerformanceProps {
  reports: DailyReport[];
}

export function CategoryPerformance({ reports }: CategoryPerformanceProps) {
  // Aggregate sales by category across all reports
  const categorySales = reports.reduce((acc, report) => {
    report.topSellingItems.forEach(item => {
      const category = item.category || 'uncategorized';
      const revenue = (item.orderCount || 0) * item.price;
      
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, count: 0 };
      }
      
      acc[category].value += revenue;
      acc[category].count += (item.orderCount || 0);
    });
    
    return acc;
  }, {} as Record<string, { name: string; value: number; count: number }>);

  const categoryData = Object.values(categorySales).sort((a, b) => b.value - a.value);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#83a6ed', '#8dd1e1'];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
        <CardDescription>Revenue breakdown by menu category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => {
                  return [`$${typeof value === 'number' ? value.toFixed(2) : value}`, 'Revenue'];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {categoryData.map((category, index) => (
            <div key={index} className="flex justify-between">
              <span className="font-medium capitalize">{category.name}</span>
              <span>${category.value.toFixed(2)} ({category.count} orders)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
