
import { useState, useEffect } from "react";
import { DailyReportsPanel } from "@/components/dashboard/DailyReportsPanel";
import { useAnalyticsState } from "@/hooks/dashboard/useAnalyticsState";
import { useToast } from "@/components/ui/use-toast";

export default function DailyReports() {
  const { toast } = useToast();
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
