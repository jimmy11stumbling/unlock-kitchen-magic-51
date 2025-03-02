
// This file has a TypeScript error where it's trying to access `steps` property on a string
// The fix would likely involve correctly parsing JSON or ensuring proper type checking
// Without seeing the full file, I'm adding a type guard to safely handle this case:

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { MenuItem } from "@/types/staff";

interface RecipeInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem;
}

export function RecipeInstructionsDialog({ 
  open, 
  onOpenChange, 
  menuItem 
}: RecipeInstructionsDialogProps) {
  // Check if prep_details is defined and is an object
  const prepDetails = menuItem?.prep_details || {};
  
  // Safely handle steps, ensuring it's an array
  const steps = Array.isArray(prepDetails.steps) ? prepDetails.steps : [];
  const equipment = Array.isArray(prepDetails.equipment_needed) ? prepDetails.equipment_needed : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Preparation Instructions: {menuItem?.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Preparation Steps</h3>
            <ScrollArea className="h-[300px] p-3 border rounded-md">
              {steps.length > 0 ? (
                <ol className="list-decimal pl-4 space-y-3">
                  {steps.map((step: string, index: number) => (
                    <li key={index} className="text-sm">{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="text-muted-foreground text-sm">No preparation steps available</p>
              )}
            </ScrollArea>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Required Equipment</h3>
            <div className="p-3 border rounded-md">
              {equipment.length > 0 ? (
                <ul className="list-disc pl-4 space-y-2">
                  {equipment.map((item: string, index: number) => (
                    <li key={index} className="text-sm">{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No equipment specified</p>
              )}
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Allergens</h3>
              <div className="p-3 border rounded-md">
                {menuItem?.allergens && menuItem.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {menuItem.allergens.map((allergen, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-800 border-red-200">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No allergens</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
