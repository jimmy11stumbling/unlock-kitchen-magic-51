import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboardState } from "@/hooks/useDashboardState";
import { RecipeInstructionsDialog } from "@/components/dashboard/kitchen/RecipeInstructionsDialog";
import type { KitchenOrder } from "@/types/staff";

export const KitchenDashboard = () => {
  const [filter, setFilter] = useState<"all" | KitchenOrder["status"]>("all");
  const [search, setSearch] = useState("");
  const { kitchenOrders } = useDashboardState();

  const filteredOrders = kitchenOrders?.filter(order => {
    if (filter === 'all' || (filter === order.status)) {
      return order.items.some(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return false;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter kitchen orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Command>
              <CommandInput placeholder="Search items..." value={search} onValueChange={setSearch} />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup heading="Items">
                  {kitchenOrders?.flatMap(order => order.items).map((item) => (
                    <CommandItem key={item.id} value={item.name} onSelect={() => setSearch(item.name)}>
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
            <div>
              <h4 className="mb-2 font-medium">Status</h4>
              <div className="flex flex-col space-y-1">
                <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
                  All
                </Button>
                <Button variant={filter === "pending" ? "default" : "outline"} onClick={() => setFilter("pending")}>
                  Pending
                </Button>
                <Button variant={filter === "preparing" ? "default" : "outline"} onClick={() => setFilter("preparing")}>
                  Preparing
                </Button>
                <Button variant={filter === "ready" ? "default" : "outline"} onClick={() => setFilter("ready")}>
                  Ready
                </Button>
                <Button variant={filter === "delivered" ? "default" : "outline"} onClick={() => setFilter("delivered")}>
                  Delivered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Kitchen Orders</CardTitle>
            <CardDescription>List of current kitchen orders</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[80vh] w-full">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredOrders?.map((order) => (
                  <Card key={order.id} className="bg-muted/50">
                    <CardHeader>
                      <CardTitle>Order #{order.order_id}</CardTitle>
                      <CardDescription>Table {order.tableNumber}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <Badge variant="secondary">{item.quantity}</Badge>
                            <RecipeInstructionsDialog menuItemId={item.menu_item_id} />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <Badge variant="outline">{order.status}</Badge>
                        <span>{order.priority} Priority</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
