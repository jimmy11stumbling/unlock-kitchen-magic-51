
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { VolumeX, Volume2 } from "lucide-react";
import { useKitchenOrders } from "./hooks/useKitchenOrders";
import { KitchenStationTabs } from "./components/KitchenStationTabs";

export function KitchenDashboard() {
  const [activeStation, setActiveStation] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { orders, isLoading, fetchOrders, handleStatusUpdate, handleFlag } = useKitchenOrders();

  useEffect(() => {
    fetchOrders();
    
    const channel = supabase
      .channel('kitchen-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kitchen_orders' },
        (payload) => {
          console.log('Change received!', payload);
          if (soundEnabled) {
            playNotificationSound();
          }
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled, fetchOrders]);

  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(console.error);
  };

  if (isLoading) {
    return <div>Loading kitchen orders...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kitchen Display System</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSoundEnabled(!soundEnabled)}
        >
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>
      </div>

      <KitchenStationTabs
        activeStation={activeStation}
        setActiveStation={setActiveStation}
        orders={orders}
        onStatusUpdate={handleStatusUpdate}
        onFlag={handleFlag}
      />
    </div>
  );
}
