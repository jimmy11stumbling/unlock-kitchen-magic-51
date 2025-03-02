
import React from 'react';
import { Card } from '@/components/ui/card';
import { Thermometer } from 'lucide-react';

interface TemperatureMonitorProps {
  stationId: string;
}

export function TemperatureMonitor({ stationId }: TemperatureMonitorProps) {
  return (
    <Card className="p-3 bg-slate-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">Station Temperature</span>
        </div>
        <span className="text-sm">175°F</span>
      </div>
    </Card>
  );
}
