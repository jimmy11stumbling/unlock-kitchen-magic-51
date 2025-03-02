
// Only fixing the temperature handling part of the file
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChefHat, Clock, Thermometer, Utensils, Check } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface RecipeInstructionsDialogProps {
  menuItem: MenuItem;
}

export function RecipeInstructionsDialog({
  menuItem,
}: RecipeInstructionsDialogProps) {
  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  };

  const prepDetails = menuItem.prep_details || {};

  // Parse temperature values to numbers if they're strings
  const parseTemperature = (tempStr: string | undefined): number | undefined => {
    if (!tempStr) return undefined;
    const numMatch = tempStr.match(/\d+/);
    return numMatch ? parseInt(numMatch[0], 10) : undefined;
  };

  // Get min and max temperatures if present
  const getTemperatureRange = () => {
    if (!prepDetails.temperature_requirements) return null;
    
    // Handle the case where temperature is a string
    const tempReq = prepDetails.temperature_requirements;
    const tempText = typeof tempReq === 'string' ? tempReq : '';
    
    // Try to extract min and max temperatures from text
    const minMatch = tempText.match(/min[imum]*\s+(\d+)/i);
    const maxMatch = tempText.match(/max[imum]*\s+(\d+)/i);
    
    const min = minMatch ? parseInt(minMatch[1], 10) : undefined;
    const max = maxMatch ? parseInt(maxMatch[1], 10) : undefined;
    
    return { min, max, text: tempText };
  };

  const tempRange = getTemperatureRange();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ChefHat className="h-4 w-4 mr-2" />
          Preparation Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Recipe: {menuItem.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preparation Time</CardTitle>
                <CardDescription>
                  Total time: {formatTime(menuItem.preparationTime)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Prep Time
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatTime(prepDetails.prepTime || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Cook Time
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatTime(prepDetails.cookTime || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                {prepDetails.equipment_needed && prepDetails.equipment_needed.length > 0 ? (
                  <ul className="space-y-2">
                    {Array.isArray(prepDetails.equipment_needed) && prepDetails.equipment_needed.map((equipment, i) => (
                      <li key={i} className="flex items-center">
                        <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{equipment}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No special equipment needed
                  </p>
                )}
              </CardContent>
            </Card>

            {tempRange && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Temperature</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm">{tempRange.text}</p>
                      {tempRange.min && tempRange.max && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Range: {tempRange.min}°F - {tempRange.max}°F
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {prepDetails.quality_checks && prepDetails.quality_checks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quality Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {prepDetails.quality_checks.map((check, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{check}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                {menuItem.ingredients && menuItem.ingredients.length > 0 ? (
                  <ul className="space-y-1">
                    {menuItem.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-sm">
                        • {ingredient}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No ingredients listed
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Preparation Steps</CardTitle>
              </CardHeader>
              <CardContent>
                {prepDetails.steps && prepDetails.steps.length > 0 ? (
                  <ol className="space-y-3 ml-4 list-decimal">
                    {prepDetails.steps.map((step, i) => (
                      <li key={i} className="text-sm pl-1">{step}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No preparation steps provided
                  </p>
                )}
              </CardContent>
            </Card>

            {prepDetails.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{prepDetails.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
