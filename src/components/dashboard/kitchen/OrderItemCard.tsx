
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ItemStatusControls } from "./ItemStatusControls";
import { Coffee, Utensils, AlertTriangle, Clock } from "lucide-react";
import type { KitchenOrderItem } from "@/types/staff";

interface OrderItemCardProps {
  item: KitchenOrderItem;
  orderId: number;
  onUpdateItemStatus: (
    orderId: number,
    itemId: number,
    status: KitchenOrderItem["status"],
    assignedChef?: string
  ) => void;
}

export function OrderItemCard({ item, orderId, onUpdateItemStatus }: OrderItemCardProps) {
  const [itemNotes, setItemNotes] = useState(item.notes || "");

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "preparing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready": return "bg-green-100 text-green-800 border-green-200";
      case "delivered": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCookingStationIcon = (station: string | undefined) => {
    switch (station) {
      case "grill": return <Utensils className="h-4 w-4" />;
      case "fry": return <Utensils className="h-4 w-4" />;
      case "salad": return <Utensils className="h-4 w-4" />;
      case "dessert": return <Coffee className="h-4 w-4" />;
      case "beverage": return <Coffee className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };
  
  const getElapsedTime = (startTime: string | undefined) => {
    if (!startTime) return null;
    
    const start = new Date(startTime);
    const now = new Date();
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 60000); // minutes
    
    return elapsed;
  };
  
  const elapsedTime = getElapsedTime(item.start_time);

  return (
    <Card className={`p-4 border-l-4 ${getItemStatusColor(item.status)}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{item.name}</h4>
            <Badge variant="outline">x{item.quantity}</Badge>
            
            {item.allergen_alert && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Allergen
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {item.cooking_station && (
              <Badge variant="secondary" className="flex items-center gap-1 capitalize">
                {getCookingStationIcon(item.cooking_station)}
                {item.cooking_station}
              </Badge>
            )}
            
            {item.assigned_chef && (
              <Badge variant="outline">Chef: {item.assigned_chef}</Badge>
            )}
            
            {item.status === "preparing" && elapsedTime !== null && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{elapsedTime} min</span>
              </div>
            )}
          </div>
          
          {item.notes && (
            <p className="mt-2 text-sm text-muted-foreground italic">
              Note: {item.notes}
            </p>
          )}
        </div>
        
        <Badge className={`${getItemStatusColor(item.status)} capitalize`}>
          {item.status}
        </Badge>
      </div>
      
      {/* Show modifications if any */}
      {item.modifications && item.modifications.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium mb-1">Modifications:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {item.modifications.map((mod, index) => (
              <li key={index}>• {mod}</li>
            ))}
          </ul>
        </div>
      )}
      
      {item.status !== "delivered" && (
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">Add Notes</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Item Notes</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Textarea 
                    value={itemNotes} 
                    onChange={(e) => setItemNotes(e.target.value)}
                    placeholder="Add preparation notes or instructions"
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={() => {
                      // In a real app, we would update the notes in the database
                      console.log("Updating notes for item", item.id, itemNotes);
                    }}
                  >
                    Save Notes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <ItemStatusControls
              item={item}
              orderId={orderId}
              onUpdateItemStatus={onUpdateItemStatus}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
