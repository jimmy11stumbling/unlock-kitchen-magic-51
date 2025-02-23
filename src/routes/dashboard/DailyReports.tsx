import { useState, useEffect } from "react";
import { DailyReportsPanel } from "@/components/dashboard/DailyReportsPanel";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DailyReports() {
  const [reports, setReports] = useState([]);
  const { hasAccess, isLoading } = useFeatureAccess('advanced_reports');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      // Mock data for demonstration
      const mockReports = [
        {
          date: '2024-01-01',
          totalRevenue: 1500,
          laborCosts: 500,
          inventoryCosts: 300,
          netProfit: 700,
          totalOrders: 150,
          averageOrderValue: 10,
          topSellingItems: [
            { id: 1, name: 'Burger', category: 'Main Course', orderCount: 50 },
            { id: 2, name: 'Fries', category: 'Side Dish', orderCount: 45 },
            { id: 3, name: 'Coke', category: 'Beverage', orderCount: 40 },
          ],
        },
        {
          date: '2024-01-02',
          totalRevenue: 1600,
          laborCosts: 520,
          inventoryCosts: 320,
          netProfit: 760,
          totalOrders: 160,
          averageOrderValue: 10,
          topSellingItems: [
            { id: 1, name: 'Burger', category: 'Main Course', orderCount: 55 },
            { id: 2, name: 'Fries', category: 'Side Dish', orderCount: 50 },
            { id: 3, name: 'Coke', category: 'Beverage', orderCount: 45 },
          ],
        },
        {
          date: '2024-01-03',
          totalRevenue: 1700,
          laborCosts: 540,
          inventoryCosts: 340,
          netProfit: 820,
          totalOrders: 170,
          averageOrderValue: 10,
          topSellingItems: [
            { id: 1, name: 'Burger', category: 'Main Course', orderCount: 60 },
            { id: 2, name: 'Fries', category: 'Side Dish', orderCount: 55 },
            { id: 3, name: 'Coke', category: 'Beverage', orderCount: 50 },
          ],
        },
      ];

      setReports(mockReports);
    };

    fetchReports();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!hasAccess) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            This feature requires a Professional subscription and appropriate role permissions.
            Please upgrade your subscription or contact your administrator.
          </AlertDescription>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </Button>
        </Alert>
      </div>
    );
  }

  return <DailyReportsPanel reports={reports} />;
}
