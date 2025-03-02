
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { KitchenOrder } from "@/types/staff";

interface Station {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'maintenance';
  equipment: Equipment[];
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'maintenance' | 'offline';
  lastMaintenance: string;
  temperature?: number;
}

const KITCHEN_STATIONS: Station[] = [
  {
    id: 'grill',
    name: 'Grill Station',
    status: 'active',
    equipment: [
      { id: 'grill1', name: 'Main Grill', status: 'operational', lastMaintenance: '2024-01-01', temperature: 350 },
      { id: 'grill2', name: 'Side Grill', status: 'operational', lastMaintenance: '2024-01-01', temperature: 325 }
    ]
  },
  {
    id: 'fry',
    name: 'Fry Station',
    status: 'active',
    equipment: [
      { id: 'fryer1', name: 'Deep Fryer 1', status: 'operational', lastMaintenance: '2024-01-01', temperature: 375 },
      { id: 'fryer2', name: 'Deep Fryer 2', status: 'operational', lastMaintenance: '2024-01-01', temperature: 375 }
    ]
  },
  {
    id: 'salad',
    name: 'Salad Station',
    status: 'active',
    equipment: [
      { id: 'prep1', name: 'Prep Table', status: 'operational', lastMaintenance: '2024-01-01' },
      { id: 'fridge1', name: 'Prep Fridge', status: 'operational', lastMaintenance: '2024-01-01', temperature: 38 }
    ]
  }
];

export interface KitchenLayoutProps {
  orders: KitchenOrder[];
}

export function KitchenLayout({ orders = [] }: KitchenLayoutProps) {
  const [stations, setStations] = useState<Station[]>(KITCHEN_STATIONS);

  useEffect(() => {
    // Subscribe to real-time equipment status updates
    const channel = supabase
      .channel('equipment-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'equipment_status'
        },
        (payload) => {
          updateEquipmentStatus(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateEquipmentStatus = (newStatus: any) => {
    setStations(currentStations => 
      currentStations.map(station => ({
        ...station,
        equipment: station.equipment.map(eq => 
          eq.id === newStatus.equipment_id 
            ? { ...eq, status: newStatus.status, temperature: newStatus.temperature }
            : eq
        )
      }))
    );
  };

  const getStationLoad = (stationId: string) => {
    return orders.filter(order => 
      order.items.some(item => item.cooking_station === stationId)
    ).length;
  };

  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-blue-100 text-blue-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stations.map(station => (
        <Card key={station.id} className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold">{station.name}</h3>
              <p className="text-sm text-muted-foreground">
                Current Load: {getStationLoad(station.id)} orders
              </p>
            </div>
            <Badge className={getStatusColor(station.status === 'active' ? 'operational' : 'offline')}>
              {station.status}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {station.equipment.map(equipment => (
              <div key={equipment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">{equipment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last maintenance: {new Date(equipment.lastMaintenance).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className={getStatusColor(equipment.status)}>
                    {equipment.status}
                  </Badge>
                  {equipment.temperature && (
                    <span className="text-sm text-muted-foreground">
                      {equipment.temperature}°F
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
