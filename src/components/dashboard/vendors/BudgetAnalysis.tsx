
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { vendorService } from "./services/vendorService";
import { Loader2 } from "lucide-react";

export const BudgetAnalysis = () => {
  const [budgetData, setBudgetData] = useState<any | null>(null);
  const [topVendors, setTopVendors] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [budgetAnalysis, vendors] = await Promise.all([
          vendorService.getBudgetAnalysis(),
          vendorService.getTopVendors()
        ]);
        
        setBudgetData(budgetAnalysis);
        setTopVendors(vendors);
      } catch (error) {
        console.error("Failed to fetch budget data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Transform budget data for charts
  const prepareBudgetChartData = () => {
    if (!budgetData) return [];
    
    return Object.entries(budgetData.monthlyBudgets).map(([month, data]: [string, any]) => {
      const date = new Date(month + '-01');
      return {
        name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        Planned: data.planned,
        Actual: data.actual,
        Variance: data.variance
      };
    }).sort((a, b) => {
      return new Date(a.name).getTime() - new Date(b.name).getTime();
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const budgetChartData = prepareBudgetChartData();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="budget" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="budget">Budget Analysis</TabsTrigger>
          <TabsTrigger value="vendors">Top Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {budgetData ? formatCurrency(budgetData.totalPlanned) : '$0'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Actual Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {budgetData ? formatCurrency(budgetData.totalActual) : '$0'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Variance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  budgetData && (budgetData.totalPlanned - budgetData.totalActual) < 0 
                    ? 'text-destructive' 
                    : 'text-green-600'
                }`}>
                  {budgetData 
                    ? formatCurrency(budgetData.totalPlanned - budgetData.totalActual) 
                    : '$0'}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Budget vs. Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {budgetChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={budgetChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)} 
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="Planned" fill="#8884d8" name="Planned" />
                      <Bar dataKey="Actual" fill="#82ca9d" name="Actual" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No budget data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Variance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {budgetChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={budgetChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="Variance" 
                        stroke="#ff7300" 
                        name="Variance"
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No variance data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Vendors by Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {topVendors && topVendors.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={topVendors.map(v => ({ 
                        name: v.name.length > 20 
                          ? v.name.substring(0, 20) + '...' 
                          : v.name,
                        spend: v.totalSpent
                      }))}
                      layout="vertical"
                      margin={{ left: 20, right: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                      <YAxis type="category" dataKey="name" width={150} />
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                        labelFormatter={(label) => `Vendor: ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="spend" fill="#8884d8" name="Total Spend" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No vendor data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Vendor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Last Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Transaction Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-gray-200">
                {topVendors && topVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(vendor.totalSpent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {new Date(vendor.lastTransaction).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {vendor.transactionCount}
                    </td>
                  </tr>
                ))}
                
                {(!topVendors || topVendors.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                      No vendor data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
