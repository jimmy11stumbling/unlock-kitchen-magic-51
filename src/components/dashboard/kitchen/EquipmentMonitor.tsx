
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ThermometerSun } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'maintenance' | 'offline';
  temperature?: number;
  targetTemp?: number;
  lastMaintenance: string;
  nextMaintenance: string;
}

const EQUIPMENT_DATA: Equipment[] = [
  {
    id: 'oven1',
    name: 'Main Oven',
    status: 'operational',
    temperature: 350,
    targetTemp: 350,
    lastMaintenance: '2024-01-15',
    nextMaintenance: '2024-02-15'
  },
  {
    id: 'fridge1',
    name: 'Walk-in Fridge',
    status: 'operational',
    temperature: 38,
    targetTemp: 38,
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-02-10'
  },
  {
    id: 'grill1',
    name: 'Main Grill',
    status: 'operational',
    temperature: 400,
    targetTemp: 400,
    lastMaintenance: '2024-01-05',
    nextMaintenance: '2024-02-05'
  }
];

export function EquipmentMonitor() {
  const [equipment, setEquipment] = useState<Equipment[]>(EQUIPMENT_DATA);

  useEffect(() => {
    // Simulate real-time temperature updates
    const interval = setInterval(() => {
      setEquipment(current => 
        current.map(eq => {
          if (!eq.temperature || !eq.targetTemp) return eq;
          
          // Simulate temperature fluctuations
          const tempDiff = Math.random() * 10 - 5;
          const newTemp = eq.temperature + tempDiff;
          
          // Check if temperature is too far from target
          const isCritical = Math.abs(newTemp - eq.targetTemp) > 20;
          
          if (isCritical) {
            toast({
              title: "Temperature Alert",
              description: `${eq.name} temperature is out of range!`,
              variant: "destructive",
            });
          }
          
          return {
            ...eq,
            temperature: newTemp,
            status: isCritical ? 'warning' : 'operational'
          };
        })
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-red-100 text-red-800';
    }
  };

  const getTempStatus = (current?: number, target?: number) => {
    if (!current || !target) return null;
    const diff = Math.abs(current - target);
    if (diff > 20) return 'text-red-500';
    if (diff > 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Equipment Status</h3>
      <div className="space-y-4">
        {equipment.map(eq => (
          <div key={eq.id} className="border rounded p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{eq.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Next maintenance: {eq.nextMaintenance}
                </p>
              </div>
              <Badge className={getStatusColor(eq.status)}>
                {eq.status}
              </Badge>
            </div>
            
            {eq.temperature && eq.targetTemp && (
              <div className="flex items-center gap-2 mt-2">
                <ThermometerSun className={`h-4 w-4 ${getTempStatus(eq.temperature, eq.targetTemp)}`} />
                <span className="text-sm">
                  {eq.temperature.toFixed(1)}°F / {eq.targetTemp}°F
                </span>
              </div>
            )}
            
            {eq.status === 'warning' && (
              <div className="flex items-center gap-2 mt-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Maintenance required</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
