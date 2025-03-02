
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Layers, MoveHorizontal } from "lucide-react";
import type { KitchenOrder } from "@/types/staff";

interface CoursePlannerDialogProps {
  order: KitchenOrder;
  onUpdateCoursing: (orderId: number, itemId: number, course: string) => void;
}

type Course = {
  id: string;
  name: string;
  description: string;
};

const COURSES: Course[] = [
  { id: "appetizer", name: "Appetizer", description: "Served first" },
  { id: "first", name: "First Course", description: "Soups, salads, light starters" },
  { id: "main", name: "Main Course", description: "Primary entrée" },
  { id: "dessert", name: "Dessert", description: "Sweet final course" },
  { id: "beverage", name: "Beverage", description: "Drinks, served throughout" },
];

export function CoursePlannerDialog({ order, onUpdateCoursing }: CoursePlannerDialogProps) {
  const [open, setOpen] = useState(false);
  const [itemCourses, setItemCourses] = useState<Record<number, string>>(() => {
    const initialCourses: Record<number, string> = {};
    order.items.forEach(item => {
      initialCourses[item.id] = item.course || "main";
    });
    return initialCourses;
  });

  const handleCourseChange = (itemId: number, courseId: string) => {
    setItemCourses(prev => ({
      ...prev,
      [itemId]: courseId
    }));
    onUpdateCoursing(order.id, itemId, courseId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs flex items-center gap-1">
          <Layers className="h-3 w-3" /> Coursing
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order #{order.order_id} Coursing</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="text-sm font-medium mb-2">Course Arrangement</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Organize items by course to coordinate timing of preparation and delivery.
          </p>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {COURSES.map(course => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{course.name}</h4>
                    <span className="text-xs text-muted-foreground">{course.description}</span>
                  </div>
                  
                  {order.items.filter(item => itemCourses[item.id] === course.id).length > 0 ? (
                    <div className="space-y-2">
                      {order.items
                        .filter(item => itemCourses[item.id] === course.id)
                        .map(item => (
                          <div 
                            key={item.id} 
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                          >
                            <div>
                              <p className="font-medium text-sm">{item.name}</p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                              )}
                            </div>
                            <Select 
                              value={itemCourses[item.id]} 
                              onValueChange={(value) => handleCourseChange(item.id, value)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                              <SelectContent>
                                {COURSES.map(c => (
                                  <SelectItem key={c.id} value={c.id} className="text-xs">
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-md p-3 text-center text-sm text-muted-foreground flex items-center justify-center h-12">
                      <MoveHorizontal className="h-4 w-4 mr-2" />
                      Drag items here
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Save Arrangement</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
