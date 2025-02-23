
import { useState, useEffect } from "react";
import { DailyReportsPanel } from "@/components/dashboard/DailyReportsPanel";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAnalyticsState } from "@/hooks/dashboard/useAnalyticsState";
import { useToast } from "@/components/ui/use-toast";

export default function DailyReports() {
  const { toast } = useToast();
  const { hasAccess, isLoading } = useFeatureAccess('advanced_reports');
  const navigate = useNavigate();
  const { 
    dailyReports, 
    salesData, 
    addSalesData, 
    error: analyticsError 
  } = useAnalyticsState();

  useEffect(() => {
    if (analyticsError) {
      toast({
        title: "Error loading reports",
        description: analyticsError || "There was a problem loading the reports data. Please try again.",
        variant: "destructive",
      });
    }
  }, [analyticsError, toast]);

  if (isLoading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            This feature requires appropriate subscription and role permissions.
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
      <DailyReportsPanel 
        reports={dailyReports} 
        salesData={salesData}
        onAddSalesData={addSalesData}
      />
    </div>
  );
}
