import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useMenuState } from "@/hooks/dashboard/useMenuState";
import { useEffect, useState } from "react";
import { MenuItem } from "@/types/staff";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Info, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { ReactNode } from 'react';

interface RecipeInstructionsDialogProps {
  menuItemId: number;
}

export function RecipeInstructionsDialog({ menuItemId }: RecipeInstructionsDialogProps) {
  const { menuItems } = useMenuState();
  const [menuItem, setMenuItem] = useState<MenuItem | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    if (menuItems && menuItemId) {
      const item = menuItems.find(item => item.id === menuItemId);
      setMenuItem(item);
    }
  }, [menuItems, menuItemId]);

  if (!menuItem) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">View Recipe</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recipe Instructions</DialogTitle>
            <DialogDescription>
              Loading...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Recipe</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{menuItem.name} - Recipe Instructions</DialogTitle>
          <DialogDescription>
            Detailed preparation guide for the {menuItem.name}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Ingredients</h3>
            <ul className="list-disc pl-5 space-y-1">
              {menuItem.ingredients?.map((ingredient: any, index: number) => (
                <li key={index}>{ingredient.name} - {ingredient.quantity}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Preparation Steps</h3>
            <div className="space-y-1">
              {(menuItem.prep_details?.steps as React.ReactNode) || "No preparation steps available."}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Quality Checks</h3>
            <ul className="list-disc pl-5 space-y-1">
              {menuItem.quality_checks?.map((check, index) => (
                <li key={index}>{check}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Allergen Information</h3>
            {menuItem.allergens && menuItem.allergens.length > 0 ? (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-muted-foreground">
                  Contains: {menuItem.allergens.join(', ')}
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">
                  No known allergens
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Equipment Needed</h3>
            <ul className="list-disc pl-5 space-y-1">
              {menuItem.equipment_needed?.map((equipment, index) => (
                <li key={index}>{equipment}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Temperature Requirements</h3>
            <p className="text-sm text-muted-foreground">
              {menuItem.temperature_requirements || "Not specified"}
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
