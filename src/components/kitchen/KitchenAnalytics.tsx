
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { KitchenOrder } from "@/types/staff";

interface KitchenAnalyticsProps {
  orders: KitchenOrder[];
}

export function KitchenAnalytics({ orders }: KitchenAnalyticsProps) {
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const preparingOrders = orders.filter(order => order.status === 'preparing').length;
  const readyOrders = orders.filter(order => order.status === 'ready').length;
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">Kitchen Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-3 bg-amber-50">
          <div className="text-amber-800">
            <h3 className="font-medium">Pending</h3>
            <p className="text-2xl font-bold">{pendingOrders}</p>
          </div>
        </Card>
        
        <Card className="p-3 bg-blue-50">
          <div className="text-blue-800">
            <h3 className="font-medium">Preparing</h3>
            <p className="text-2xl font-bold">{preparingOrders}</p>
          </div>
        </Card>
        
        <Card className="p-3 bg-green-50">
          <div className="text-green-800">
            <h3 className="font-medium">Ready</h3>
            <p className="text-2xl font-bold">{readyOrders}</p>
          </div>
        </Card>
      </div>
      
      <Tabs defaultValue="performance">
        <TabsList className="mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Performance chart would render here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Trends chart would render here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="stations">
          <div className="h-64 flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Stations chart would render here</p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
