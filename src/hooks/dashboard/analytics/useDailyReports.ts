
import { useState } from "react";
import type { DailyReport } from "@/types/staff";
import { initialDailyReports } from "./data/initialDailyReports";

export const useDailyReports = () => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialDailyReports);
  const [error, setError] = useState<string | null>(null);

  return {
    dailyReports,
    error,
  };
};
