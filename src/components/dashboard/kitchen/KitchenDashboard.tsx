import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useIngredientManagement } from '@/hooks/dashboard/useIngredientManagement';
import { Progress } from "@/components/ui/progress";

export function KitchenDashboard() {
  const [alerts, setAlerts] = useState<string[]>([]);
  const { ingredients, checkLowStock, calculatePrepTime } = useIngredientManagement();
  
  useEffect(() => {
    const lowStockItems = checkLowStock();
    if (lowStockItems.length > 0) {
      setAlerts(lowStockItems.map(item => 
        `Low stock alert: ${item.name} (${item.current_stock} ${item.unit} remaining)`
      ));
    }
  }, [ingredients]);

  useEffect(() => {
    const updatePrepTimes = async () => {
      console.log('Updating prep times based on ingredient availability');
    };

    updatePrepTimes();
    const interval = setInterval(updatePrepTimes, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full p-6">
          <h2 className="text-xl font-semibold mb-4">Kitchen Alerts</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert variant="destructive" key={index}>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Stock Alert</AlertTitle>
                <AlertDescription>{alert}</AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Ingredient Status</h2>
          <div className="space-y-4">
            {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{ingredient.name}</span>
                  <Badge variant={ingredient.current_stock <= ingredient.minimum_stock ? "destructive" : "default"}>
                    {ingredient.current_stock} {ingredient.unit}
                  </Badge>
                </div>
                <Progress 
                  value={(ingredient.current_stock / (ingredient.minimum_stock * 2)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Active Orders</h2>
          <div className="space-y-4">
            {/* Active orders would be mapped here */}
          </div>
        </Card>
      </div>
    </div>
  );
}
