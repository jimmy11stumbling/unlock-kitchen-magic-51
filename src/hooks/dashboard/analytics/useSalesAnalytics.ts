
import { useState } from "react";
import type { SalesData } from "@/types/staff";
import { initialSalesData } from "./data/initialSalesData";

export const useSalesAnalytics = () => {
  const [salesData, setSalesData] = useState<SalesData[]>(initialSalesData);
  const [error, setError] = useState<string | null>(null);

  const addSalesData = (data: Omit<SalesData, "profit">) => {
    try {
      const profit = data.revenue - data.costs;
      const newSalesData: SalesData = {
        ...data,
        profit,
      };
      setSalesData([...salesData, newSalesData]);
    } catch (err) {
      setError("Failed to add sales data");
      throw err;
    }
  };

  return {
    salesData,
    error,
    addSalesData,
  };
};
