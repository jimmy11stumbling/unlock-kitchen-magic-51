
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Timer, Thermometer, AlertTriangle } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface RecipeInstructionsDialogProps {
  item: MenuItem;
}

export function RecipeInstructionsDialog({ item }: RecipeInstructionsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ChefHat className="h-4 w-4 mr-2" />
          View Recipe
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.name} - Preparation Instructions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {/* Recipe Overview */}
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <Timer className="h-4 w-4 mr-2" />
                <span>{item.preparationTime} mins</span>
              </div>
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                <span>Cook temp: 165°F</span>
              </div>
              {item.allergens?.length > 0 && (
                <div className="flex items-center text-destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span>Contains: {item.allergens.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="font-medium mb-2">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-1">
                {item.prep_details?.ingredients?.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Equipment */}
            <div>
              <h3 className="font-medium mb-2">Equipment Needed</h3>
              <ul className="list-disc pl-5 space-y-1">
                {item.prep_details?.equipment_needed?.map((equipment, index) => (
                  <li key={index}>{equipment}</li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h3 className="font-medium mb-2">Preparation Steps</h3>
              <div className="space-y-3">
                {item.prep_details?.steps?.map((step, index) => (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg">
                    <span className="font-medium text-muted-foreground">
                      {index + 1}.
                    </span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Control */}
            <div>
              <h3 className="font-medium mb-2">Quality Checkpoints</h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 border rounded">
                  <Thermometer className="h-4 w-4 mr-2 text-orange-500" />
                  <span>Internal temperature must reach 165°F</span>
                </div>
                {item.prep_details?.quality_checks?.map((check, index) => (
                  <div key={index} className="flex items-center p-2 border rounded">
                    <span>• {check}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
