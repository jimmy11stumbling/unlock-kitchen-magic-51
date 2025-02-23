
import { useState, useCallback } from "react";
import type { DailyReport } from "@/types/staff";
import { initialDailyReports } from "./data/initialDailyReports";

export const useDailyReports = () => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(
    initialDailyReports.map(report => ({
      ...report,
      averageOrderValue: Number((report.totalRevenue / report.totalOrders).toFixed(2)),
      netProfit: Number((report.totalRevenue - (report.laborCosts + report.inventoryCosts)).toFixed(2))
    }))
  );
  const [error, setError] = useState<string | null>(null);

  const addDailyReport = useCallback((report: Omit<DailyReport, 'averageOrderValue' | 'netProfit'>) => {
    try {
      const averageOrderValue = Number((report.totalRevenue / report.totalOrders).toFixed(2));
      const netProfit = Number((report.totalRevenue - (report.laborCosts + report.inventoryCosts)).toFixed(2));

      const newReport: DailyReport = {
        ...report,
        averageOrderValue,
        netProfit
      };

      setDailyReports(prev => [...prev, newReport]);
    } catch (err) {
      setError("Failed to add daily report: Invalid data");
      console.error("Error adding daily report:", err);
    }
  }, []);

  const updateDailyReport = useCallback((date: string, updates: Partial<DailyReport>) => {
    try {
      setDailyReports(prev => prev.map(report => {
        if (report.date === date) {
          const updatedReport = { ...report, ...updates };
          return {
            ...updatedReport,
            averageOrderValue: Number((updatedReport.totalRevenue / updatedReport.totalOrders).toFixed(2)),
            netProfit: Number((updatedReport.totalRevenue - (updatedReport.laborCosts + updatedReport.inventoryCosts)).toFixed(2))
          };
        }
        return report;
      }));
    } catch (err) {
      setError("Failed to update daily report: Invalid data");
      console.error("Error updating daily report:", err);
    }
  }, []);

  return {
    dailyReports,
    error,
    addDailyReport,
    updateDailyReport
  };
};
