
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface InventoryItem {
  id: number;
  name: string;
  available: number;
  total: number;
  threshold: number;
  unit: string;
}

interface InventoryTrackerProps {
  order?: KitchenOrder;
}

export function InventoryTracker({ order }: InventoryTrackerProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Ground Beef', available: 8.2, total: 10, threshold: 2, unit: 'lbs' },
    { id: 2, name: 'Mixed Greens', available: 4, total: 20, threshold: 5, unit: 'lbs' },
    { id: 3, name: 'Sliced Cheese', available: 32, total: 100, threshold: 20, unit: 'slices' },
    { id: 4, name: 'Chicken Breast', available: 12, total: 30, threshold: 6, unit: 'lbs' },
    { id: 5, name: 'Potatoes', available: 28, total: 50, threshold: 10, unit: 'lbs' },
    { id: 6, name: 'Tomatoes', available: 5, total: 15, threshold: 3, unit: 'lbs' },
    { id: 7, name: 'Burger Buns', available: 15, total: 40, threshold: 10, unit: 'count' },
    { id: 8, name: 'Olive Oil', available: 1.2, total: 3, threshold: 0.5, unit: 'gallons' },
  ]);
  
  const [loading, setLoading] = useState(false);
  const [lowStock, setLowStock] = useState<InventoryItem[]>([]);
  const [orderImpact, setOrderImpact] = useState<{
    item: InventoryItem;
    amount: number;
  }[]>([]);
  
  useEffect(() => {
    // Find low stock items
    const low = inventory.filter(item => 
      item.available <= item.threshold
    );
    setLowStock(low);
    
    // Calculate impact of current order
    if (order) {
      const impact: { item: InventoryItem; amount: number }[] = [];
      
      // This is a simplified example. In a real app, we would have a mapping
      // between menu items and their ingredient requirements
      order.items.forEach(item => {
        // Example mapping logic - this would be more sophisticated in a real app
        if (item.name.toLowerCase().includes('burger')) {
          const beef = inventory.find(i => i.name === 'Ground Beef');
          const buns = inventory.find(i => i.name === 'Burger Buns');
          const cheese = inventory.find(i => i.name === 'Sliced Cheese');
          
          if (beef) impact.push({ item: beef, amount: 0.3 * item.quantity });
          if (buns) impact.push({ item: buns, amount: 1 * item.quantity });
          if (cheese) impact.push({ item: cheese, amount: 2 * item.quantity });
        }
        
        if (item.name.toLowerCase().includes('salad')) {
          const greens = inventory.find(i => i.name === 'Mixed Greens');
          const tomatoes = inventory.find(i => i.name === 'Tomatoes');
          
          if (greens) impact.push({ item: greens, amount: 0.5 * item.quantity });
          if (tomatoes) impact.push({ item: tomatoes, amount: 0.25 * item.quantity });
        }
        
        if (item.name.toLowerCase().includes('chicken')) {
          const chicken = inventory.find(i => i.name === 'Chicken Breast');
          if (chicken) impact.push({ item: chicken, amount: 0.5 * item.quantity });
        }
        
        if (item.name.toLowerCase().includes('fries') || item.name.toLowerCase().includes('potato')) {
          const potatoes = inventory.find(i => i.name === 'Potatoes');
          if (potatoes) impact.push({ item: potatoes, amount: 0.5 * item.quantity });
        }
      });
      
      // Combine multiple impacts on the same item
      const combinedImpact: { item: InventoryItem; amount: number }[] = [];
      impact.forEach(imp => {
        const existing = combinedImpact.find(ci => ci.item.id === imp.item.id);
        if (existing) {
          existing.amount += imp.amount;
        } else {
          combinedImpact.push(imp);
        }
      });
      
      setOrderImpact(combinedImpact);
    }
  }, [inventory, order]);
  
  const refillInventory = (itemId: number) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInventory(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, available: item.total } 
            : item
        )
      );
      setLoading(false);
    }, 800);
  };
  
  const getProgressColor = (available: number, total: number, threshold: number) => {
    const percentage = (available / total) * 100;
    
    if (available <= threshold) return "text-red-500";
    if (percentage < 30) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Inventory Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        {lowStock.length > 0 && (
          <Alert className="mb-4 bg-yellow-50 text-yellow-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {lowStock.length} items below minimum threshold
            </AlertDescription>
          </Alert>
        )}
        
        {order && orderImpact.length > 0 && (
          <div className="mb-4 p-3 border rounded-md bg-blue-50">
            <h4 className="text-sm font-medium mb-2 text-blue-800">Order Impact</h4>
            <div className="space-y-2">
              {orderImpact.map(impact => (
                <div key={impact.item.id} className="flex items-center justify-between text-sm">
                  <span>{impact.item.name}</span>
                  <div className="flex items-center">
                    <span className="text-muted-foreground">
                      {impact.item.available.toFixed(1)}{impact.item.unit} 
                    </span>
                    <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                    <span className={
                      impact.item.available - impact.amount <= impact.item.threshold 
                        ? "text-red-600 font-medium" 
                        : ""
                    }>
                      {(impact.item.available - impact.amount).toFixed(1)}{impact.item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {inventory.slice(0, 5).map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{item.name}</span>
                  {item.available <= item.threshold && (
                    <AlertTriangle className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${
                    getProgressColor(item.available, item.total, item.threshold)
                  }`}>
                    {item.available.toFixed(1)}{item.unit}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    / {item.total}{item.unit}
                  </span>
                  {item.available <= item.threshold && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => refillInventory(item.id)}
                      disabled={loading}
                      className="h-6 w-6 p-0 ml-1"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
              <Progress 
                value={(item.available / item.total) * 100} 
                className={`h-1.5 ${
                  item.available <= item.threshold ? "bg-red-100" : ""
                }`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
