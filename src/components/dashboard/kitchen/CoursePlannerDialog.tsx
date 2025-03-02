
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, AlertTriangle } from "lucide-react";
import type { KitchenOrder, KitchenOrderItem } from "@/types/staff";

interface CoursePlannerDialogProps {
  order: KitchenOrder;
  onUpdateCoursing: (orderId: number, itemId: number, course: string) => void;
}

export function CoursePlannerDialog({
  order,
  onUpdateCoursing
}: CoursePlannerDialogProps) {
  const courseOptions = ["appetizer", "main", "dessert"];
  
  const itemsByCourse = order.items.reduce<Record<string, KitchenOrderItem[]>>((acc, item) => {
    const course = item.course || "uncategorized";
    if (!acc[course]) acc[course] = [];
    acc[course].push(item);
    return acc;
  }, {} as Record<string, KitchenOrderItem[]>);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Courses</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Course Planning - Order #{order.order_id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {Object.entries(itemsByCourse).map(([course, items]) => (
            <div key={course} className="space-y-2">
              <h3 className="font-medium capitalize">{course}</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}x {item.name}</span>
                      {item.allergens?.length > 0 && (
                        <Badge variant="destructive" className="h-5">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Allergens
                        </Badge>
                      )}
                    </div>
                    <Select
                      value={item.course || ""}
                      onValueChange={(value) => onUpdateCoursing(order.id, item.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
