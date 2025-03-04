
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, TrendingDown, ShoppingCart, Calendar, ArrowRight, Clock } from "lucide-react";
import type { InventoryItem } from "@/types/staff";

interface InventoryAlertsProps {
  items: InventoryItem[];
  onAutoOrder?: (itemId: number) => void;
}

export function InventoryAlerts({ items, onAutoOrder }: InventoryAlertsProps) {
  const [selectedTab, setSelectedTab] = useState("low-stock");
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const lowStockItems = items.filter(item => 
    item.quantity <= item.minQuantity && item.quantity > 0
  );

  const outOfStockItems = items.filter(item => 
    item.quantity === 0
  );

  const expiringItems = items.filter(item => 
    item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const handleReorder = (item: InventoryItem) => {
    setSelectedItem(item);
    setReorderDialogOpen(true);
  };

  const confirmReorder = () => {
    if (selectedItem && onAutoOrder) {
      onAutoOrder(selectedItem.id);
      setReorderDialogOpen(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </div>
          <Badge variant="destructive" className="ml-2">
            {lowStockItems.length + outOfStockItems.length + expiringItems.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-3 mx-6">
            <TabsTrigger value="low-stock" className="relative">
              Low Stock
              {lowStockItems.length > 0 && (
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {lowStockItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="out-of-stock" className="relative">
              Out of Stock
              {outOfStockItems.length > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {outOfStockItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="expiring" className="relative">
              Expiring Soon
              {expiringItems.length > 0 && (
                <Badge variant="outline" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
                  {expiringItems.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[300px] px-6 py-4">
            <TabsContent value="low-stock" className="m-0">
              {lowStockItems.length > 0 ? (
                <div className="space-y-4">
                  {lowStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-2 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <TrendingDown className="h-4 w-4 text-amber-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} left (Min: {item.minQuantity})
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleReorder(item)}>
                        Reorder
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No low stock items
                </div>
              )}
            </TabsContent>

            <TabsContent value="out-of-stock" className="m-0">
              {outOfStockItems.length > 0 ? (
                <div className="space-y-4">
                  {outOfStockItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-2 border border-red-200 rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-red-500">
                            Out of stock! (Min: {item.minQuantity})
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="default" onClick={() => handleReorder(item)}>
                        <ShoppingCart className="h-3 w-3 mr-1" /> Order Now
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No out of stock items
                </div>
              )}
            </TabsContent>

            <TabsContent value="expiring" className="m-0">
              {expiringItems.length > 0 ? (
                <div className="space-y-4">
                  {expiringItems.map((item) => {
                    const daysToExpiry = item.expiryDate 
                      ? Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                      : 0;
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-2 border border-yellow-200 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Calendar className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-yellow-600">
                              Expires in {daysToExpiry} day{daysToExpiry !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          daysToExpiry <= 2 ? "destructive" : 
                          daysToExpiry <= 5 ? "secondary" : "outline"
                        }>
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "Unknown"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No items expiring soon
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>

      <Dialog open={reorderDialogOpen} onOpenChange={setReorderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reorder {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Confirm reorder details for this inventory item
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Current stock</h4>
                <p>{selectedItem?.quantity} {selectedItem?.unit}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Minimum quantity</h4>
                <p>{selectedItem?.minQuantity} {selectedItem?.unit}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recommended order</h4>
                <p>{selectedItem ? (selectedItem.minQuantity * 2 - selectedItem.quantity) : 0} {selectedItem?.unit}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Estimated arrival</h4>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span>3-5 business days</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <Button variant="outline" onClick={() => setReorderDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmReorder}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Confirm Reorder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
