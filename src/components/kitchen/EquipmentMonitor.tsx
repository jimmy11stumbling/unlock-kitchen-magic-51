
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";

const equipmentStatus = [
  {
    id: 'oven1',
    name: 'Main Oven',
    status: 'operational',
    temperature: 350,
    targetTemperature: 350,
    maintenanceNeeded: false,
    lastMaintenance: '2023-12-15',
    nextMaintenance: '2024-03-15',
  },
  {
    id: 'freezer1',
    name: 'Walk-in Freezer',
    status: 'warning',
    temperature: -5,
    targetTemperature: -18,
    maintenanceNeeded: true,
    lastMaintenance: '2023-10-10',
    nextMaintenance: '2024-01-10',
  },
  {
    id: 'grill1',
    name: 'Main Grill',
    status: 'operational',
    temperature: 425,
    targetTemperature: 425,
    maintenanceNeeded: false,
    lastMaintenance: '2023-11-20',
    nextMaintenance: '2024-02-20',
  }
];

export function EquipmentMonitor() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'offline':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTemperatureStatus = (current: number, target: number) => {
    const diff = Math.abs(current - target);
    const percentage = Math.min(100, 100 - (diff / target) * 100);
    
    if (percentage > 90) return { color: "text-green-500", progress: percentage };
    if (percentage > 75) return { color: "text-amber-500", progress: percentage };
    return { color: "text-red-500", progress: percentage };
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Equipment Status</h3>
      <div className="space-y-4">
        {equipmentStatus.map((equipment) => {
          const tempStatus = getTemperatureStatus(equipment.temperature, equipment.targetTemperature);
          
          return (
            <div key={equipment.id} className="border rounded-md p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(equipment.status)}
                    <h4 className="font-medium">{equipment.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Next maintenance: {new Date(equipment.nextMaintenance).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${tempStatus.color}`}>
                    {equipment.temperature}°F
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Target: {equipment.targetTemperature}°F
                  </p>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Temperature</span>
                  <span>{Math.round(tempStatus.progress)}%</span>
                </div>
                <Progress value={tempStatus.progress} className="h-2" />
              </div>
              
              {equipment.maintenanceNeeded && (
                <div className="mt-2 text-xs flex items-center gap-1 text-amber-500">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Maintenance recommended</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
