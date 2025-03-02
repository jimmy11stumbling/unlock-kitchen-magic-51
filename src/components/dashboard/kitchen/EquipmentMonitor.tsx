
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, RefreshCw, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'maintenance' | 'offline';
  temperature?: number;
  lastMaintenance: string;
  nextMaintenance?: string;
}

export function EquipmentMonitor() {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'oven1',
      name: 'Main Oven',
      status: 'operational',
      temperature: 375,
      lastMaintenance: '2024-03-15',
      nextMaintenance: '2024-06-15'
    },
    {
      id: 'fridge1',
      name: 'Walk-in Cooler',
      status: 'operational',
      temperature: 38,
      lastMaintenance: '2024-02-10',
      nextMaintenance: '2024-05-10'
    },
    {
      id: 'mixer1',
      name: 'Stand Mixer',
      status: 'warning',
      lastMaintenance: '2023-12-01',
      nextMaintenance: '2024-03-01'
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // In a real app, we would fetch equipment data here
    // For now, we'll simulate real-time updates with a subscription
    const channel = supabase
      .channel('equipment-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment'
        },
        (payload) => {
          // In a real app, this would update the equipment state
          console.log('Equipment update:', payload);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simulate an API call
    setTimeout(() => {
      // Randomly update one piece of equipment for demo purposes
      const randomIndex = Math.floor(Math.random() * equipment.length);
      const randomEquipment = { ...equipment[randomIndex] };
      
      if (randomEquipment.temperature) {
        // Randomly adjust temperature by +/- 5 degrees
        randomEquipment.temperature += Math.floor(Math.random() * 10) - 5;
        
        // Set status based on new temperature
        if (randomEquipment.name.includes('Oven') && 
            (randomEquipment.temperature < 350 || randomEquipment.temperature > 400)) {
          randomEquipment.status = 'warning';
        } else if (randomEquipment.name.includes('Cooler') && 
                  (randomEquipment.temperature < 35 || randomEquipment.temperature > 41)) {
          randomEquipment.status = 'warning';
        } else {
          randomEquipment.status = 'operational';
        }
      }
      
      // Update the equipment list
      const updatedEquipment = [...equipment];
      updatedEquipment[randomIndex] = randomEquipment;
      setEquipment(updatedEquipment);
      setLoading(false);
    }, 1000);
  };
  
  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800">Maintenance</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800">Offline</Badge>;
    }
  };
  
  const calculateMaintenanceStatus = (nextMaintenance?: string) => {
    if (!nextMaintenance) return 'unknown';
    
    const today = new Date();
    const maintenance = new Date(nextMaintenance);
    const diffTime = maintenance.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays < 7) return 'soon';
    return 'ok';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Equipment Status</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {equipment.map((item) => (
            <div 
              key={item.id} 
              className={`flex justify-between items-center p-2 rounded ${
                item.status === 'warning' 
                  ? 'bg-yellow-50' 
                  : item.status === 'offline' 
                    ? 'bg-red-50' 
                    : 'bg-muted/20'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{item.name}</p>
                  {getStatusBadge(item.status)}
                </div>
                {item.temperature && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Thermometer className="h-3 w-3" />
                    <span>{item.temperature}°F</span>
                  </div>
                )}
              </div>
              
              <div className="text-right text-xs">
                <p className="text-muted-foreground">
                  Last maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}
                </p>
                {item.nextMaintenance && (
                  <p className={`mt-1 ${
                    calculateMaintenanceStatus(item.nextMaintenance) === 'overdue'
                      ? 'text-red-600 flex items-center justify-end gap-1'
                      : calculateMaintenanceStatus(item.nextMaintenance) === 'soon'
                        ? 'text-yellow-600 flex items-center justify-end gap-1'
                        : 'text-muted-foreground'
                  }`}>
                    {calculateMaintenanceStatus(item.nextMaintenance) !== 'ok' && (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    Next: {new Date(item.nextMaintenance).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
