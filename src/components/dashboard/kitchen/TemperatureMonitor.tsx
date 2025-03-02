
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Thermometer, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemperatureMonitorProps {
  stationId: string;
}

interface TemperatureReading {
  time: string;
  temperature: number;
  threshold?: number;
}

interface StationData {
  id: string;
  name: string;
  currentTemp: number;
  safeMin: number;
  safeMax: number;
  status: 'normal' | 'warning' | 'critical';
  readings: TemperatureReading[];
}

export function TemperatureMonitor({ stationId }: TemperatureMonitorProps) {
  const [stations, setStations] = useState<Record<string, StationData>>({
    'main-kitchen': {
      id: 'main-kitchen',
      name: 'Main Kitchen',
      currentTemp: 72,
      safeMin: 68,
      safeMax: 74,
      status: 'normal',
      readings: Array(12).fill(0).map((_, i) => ({
        time: `${12 - i}m ago`,
        temperature: 72 + Math.floor(Math.random() * 4) - 2,
      }))
    },
    'grill': {
      id: 'grill',
      name: 'Grill Station',
      currentTemp: 85,
      safeMin: 75,
      safeMax: 90,
      status: 'normal',
      readings: Array(12).fill(0).map((_, i) => ({
        time: `${12 - i}m ago`,
        temperature: 85 + Math.floor(Math.random() * 6) - 3,
      }))
    },
    'fry': {
      id: 'fry',
      name: 'Fry Station',
      currentTemp: 82,
      safeMin: 75,
      safeMax: 85,
      status: 'normal',
      readings: Array(12).fill(0).map((_, i) => ({
        time: `${12 - i}m ago`,
        temperature: 82 + Math.floor(Math.random() * 6) - 3,
      }))
    },
    'cold': {
      id: 'cold',
      name: 'Cold Storage',
      currentTemp: 38,
      safeMin: 36,
      safeMax: 40,
      status: 'normal',
      readings: Array(12).fill(0).map((_, i) => ({
        time: `${12 - i}m ago`,
        temperature: 38 + Math.floor(Math.random() * 2) - 1,
      }))
    }
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Set up interval to simulate temperature readings
    const intervalId = setInterval(() => {
      addTemperatureReading();
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, []);
  
  const selectedStation = stations[stationId] || stations['main-kitchen'];
  
  const addTemperatureReading = () => {
    setStations(prev => {
      const updated = { ...prev };
      
      // Update each station with a new temperature reading
      Object.keys(updated).forEach(key => {
        const station = updated[key];
        const randomVariation = Math.floor(Math.random() * 4) - 2; // -2 to +2
        
        const newTemp = station.currentTemp + randomVariation;
        const newStatus = getTemperatureStatus(newTemp, station.safeMin, station.safeMax);
        
        const newReadings = [
          { time: 'now', temperature: newTemp },
          ...station.readings.slice(0, -1).map((r, i) => ({
            ...r,
            time: `${i + 1}m ago`
          }))
        ];
        
        updated[key] = {
          ...station,
          currentTemp: newTemp,
          status: newStatus,
          readings: newReadings
        };
      });
      
      return updated;
    });
  };
  
  const getTemperatureStatus = (temp: number, min: number, max: number): StationData['status'] => {
    if (temp < min - 3 || temp > max + 3) return 'critical';
    if (temp < min || temp > max) return 'warning';
    return 'normal';
  };
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate API call and add a new temperature reading
    setTimeout(() => {
      addTemperatureReading();
      setLoading(false);
    }, 800);
  };
  
  const getStatusColor = (status: StationData['status']) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
    }
  };
  
  // Add threshold lines to the chart data
  const chartData = selectedStation.readings.map(reading => ({
    ...reading,
    safeMin: selectedStation.safeMin,
    safeMax: selectedStation.safeMax
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">
              {selectedStation.name} Temperature
            </CardTitle>
            <Badge className={getStatusColor(selectedStation.status)}>
              {selectedStation.status}
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <div className="flex items-center mt-1">
          <Thermometer className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className={`text-lg font-semibold ${
            selectedStation.status === 'critical' 
              ? 'text-red-600' 
              : selectedStation.status === 'warning' 
                ? 'text-yellow-600' 
                : ''
          }`}>
            {selectedStation.currentTemp}°F
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            ({selectedStation.safeMin}°F - {selectedStation.safeMax}°F safe range)
          </span>
        </div>
        
        {selectedStation.status !== 'normal' && (
          <div className="flex items-center mt-2 gap-1.5 text-sm">
            <AlertTriangle className={`h-4 w-4 ${
              selectedStation.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <span className={
              selectedStation.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
            }>
              {selectedStation.status === 'critical' 
                ? 'Critical temperature deviation detected!' 
                : 'Temperature outside of safe range.'}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis dataKey="time" fontSize={10} tick={{ fill: 'var(--gray-500)' }} />
              <YAxis fontSize={10} tick={{ fill: 'var(--gray-500)' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="safeMax" 
                stroke="#f97316" 
                strokeDasharray="3 3" 
                strokeWidth={1} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="safeMin" 
                stroke="#f97316" 
                strokeDasharray="3 3" 
                strokeWidth={1} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
