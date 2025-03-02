
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import type { DailyReport } from "@/types/staff";

interface SalesHeatmapProps {
  reports: DailyReport[];
}

export function SalesHeatmap({ reports }: SalesHeatmapProps) {
  const [metric, setMetric] = useState<'revenue' | 'orders'>('revenue');
  
  // Create a mock hourly sales distribution since our data doesn't include this detail
  const hourlyData = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = Array.from({ length: 12 }, (_, i) => `${i + 9}:00`); // 9am to 8pm
    
    // Generate synthetic hourly data based on daily reports
    return days.map(day => {
      const dayData = reports.find(r => new Date(r.date).toLocaleDateString('en-US', { weekday: 'long' }) === day);
      const baseValue = dayData ? (metric === 'revenue' ? dayData.totalRevenue : dayData.totalOrders) : 0;
      
      // Create a simulated hourly distribution with some peak hours
      return {
        day,
        ...hours.reduce((acc, hour, i) => {
          // Create a bell curve with peak hours during lunch and dinner
          let factor = 0.5;
          if (i >= 3 && i <= 4) factor = 1.5; // Lunch peak (12-1pm)
          if (i >= 9 && i <= 10) factor = 1.8; // Dinner peak (6-7pm)
          
          // Add some randomness
          const randomFactor = 0.8 + Math.random() * 0.4;
          
          // Calculate hourly value
          const hourlyValue = baseValue ? Math.round((baseValue / 12) * factor * randomFactor) : 0;
          
          return { ...acc, [hour]: hourlyValue };
        }, {})
      };
    });
  }, [reports, metric]);
  
  // Find the max value for color scaling
  const maxValue = useMemo(() => {
    let max = 0;
    hourlyData.forEach(day => {
      Object.entries(day).forEach(([key, value]) => {
        if (key !== 'day' && typeof value === 'number' && value > max) {
          max = value;
        }
      });
    });
    return max;
  }, [hourlyData]);
  
  // Generate color based on value
  const getColor = (value: number) => {
    const intensity = Math.min(value / maxValue, 1);
    return `rgba(56, 189, 248, ${intensity})`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Heatmap</CardTitle>
          <CardDescription>Hourly sales distribution by day of week</CardDescription>
        </div>
        <Select
          value={metric}
          onValueChange={(value: 'revenue' | 'orders') => setMetric(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="orders">Orders</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="font-medium text-left p-2">Day</th>
                {Object.keys(hourlyData[0] || {}).filter(k => k !== 'day').map(hour => (
                  <th key={hour} className="font-medium p-2 text-xs">{hour}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hourlyData.map((day, i) => (
                <tr key={i}>
                  <td className="font-medium p-2">{day.day}</td>
                  {Object.entries(day).filter(([key]) => key !== 'day').map(([hour, value]) => (
                    <td 
                      key={hour} 
                      className="p-1"
                    >
                      <div 
                        className="w-14 h-10 flex items-center justify-center rounded-sm"
                        style={{ 
                          backgroundColor: getColor(value as number),
                          color: (value as number) / maxValue > 0.6 ? 'white' : 'black'
                        }}
                      >
                        {metric === 'revenue' ? '$' : ''}{value}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
