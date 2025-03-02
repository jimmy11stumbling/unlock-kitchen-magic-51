
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { KitchenOrder } from '@/types/staff';

interface CoursePlannerDialogProps {
  order: KitchenOrder;
  onUpdateCoursing: (orderId: number, itemId: number, course: string) => void;
}

export function CoursePlannerDialog({ order, onUpdateCoursing }: CoursePlannerDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Course Planner</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Course Planning</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">Course planning functionality would appear here</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
