
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { DailyReport } from "@/types/staff";

interface DetailedRevenueProps {
  reports: DailyReport[];
}

export function DetailedRevenue({ reports }: DetailedRevenueProps) {
  // Transforming data for charts
  const revenueData = reports.map(report => ({
    date: new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: report.totalRevenue,
    profit: report.netProfit,
    orders: report.totalOrders,
    averageOrder: report.averageOrderValue
  }));

  // Calculate daily growth percentages
  const revenueGrowthData = revenueData.map((item, index) => {
    if (index === 0) return { ...item, growth: 0 };
    const prevRevenue = revenueData[index - 1].revenue;
    const growth = prevRevenue ? ((item.revenue - prevRevenue) / prevRevenue) * 100 : 0;
    return { ...item, growth: parseFloat(growth.toFixed(2)) };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Revenue Analysis</CardTitle>
        <CardDescription>Comprehensive view of revenue streams and growth</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="growth">Growth</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="avg">Average Order</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="growth" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueGrowthData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Growth Rate']} />
                <Legend />
                <Line type="monotone" dataKey="growth" name="Daily Growth %" stroke="#ff7300" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="orders" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" name="Order Count" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="avg" className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Average Order Value']} />
                <Legend />
                <Line type="monotone" dataKey="averageOrder" name="Average Order Value" stroke="#82ca9d" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
