
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Thermometer, AlertTriangle } from "lucide-react";

interface TemperatureReading {
  id: number;
  station: string;
  temperature: number;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

interface TemperatureMonitorProps {
  stationId: string;
}

export function TemperatureMonitor({ stationId }: TemperatureMonitorProps) {
  const [readings, setReadings] = useState<TemperatureReading[]>([]);

  useEffect(() => {
    // Simulate temperature readings
    const interval = setInterval(() => {
      const newReading: TemperatureReading = {
        id: Date.now(),
        station: stationId,
        temperature: 165 + Math.random() * 10 - 5, // Simulate fluctuation around 165°F
        timestamp: new Date().toISOString(),
        status: 'normal'
      };

      if (newReading.temperature < 160) {
        newReading.status = 'critical';
      } else if (newReading.temperature < 163) {
        newReading.status = 'warning';
      }

      setReadings(prev => [...prev.slice(-11), newReading]);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [stationId]);

  const getStatusColor = (status: TemperatureReading['status']) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
    }
  };

  const latestReading = readings[readings.length - 1];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          <h3 className="font-semibold">Temperature Monitor</h3>
        </div>
        {latestReading && (
          <Badge className={getStatusColor(latestReading.status)}>
            {Math.round(latestReading.temperature)}°F
          </Badge>
        )}
      </div>

      {latestReading?.status !== 'normal' && (
        <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg mb-4">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">
            Temperature {latestReading?.status === 'critical' ? 'critically' : ''} below safe threshold
          </span>
        </div>
      )}

      <div className="space-y-2">
        {readings.slice().reverse().map((reading) => (
          <div key={reading.id} className="flex items-center justify-between text-sm p-2 border rounded">
            <span>{new Date(reading.timestamp).toLocaleTimeString()}</span>
            <Badge className={getStatusColor(reading.status)}>
              {Math.round(reading.temperature)}°F
            </Badge>
          </div>
        ))}
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4"
        onClick={() => setReadings([])}
      >
        Clear History
      </Button>
    </Card>
  );
}
