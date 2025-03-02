import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface RecipeInstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItem: MenuItem;
}

export function RecipeInstructionsDialog({ open, onOpenChange, menuItem }: RecipeInstructionsDialogProps) {
  const [activeTab, setActiveTab] = useState("recipe");
  
  const recipeDetails = useMemo(() => {
    const defaultRecipe = {
      temperature_requirements: {},
      prepTime: 0,
      cookTime: 0,
      equipment_needed: [],
      quality_checks: [],
      steps: [],
      notes: ""
    };
    
    return menuItem?.prep_details 
      ? { ...defaultRecipe, ...(typeof menuItem.prep_details === 'string' 
          ? JSON.parse(menuItem.prep_details) 
          : menuItem.prep_details) }
      : defaultRecipe;
  }, [menuItem]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{menuItem?.name} Instructions</DialogTitle>
          <DialogDescription>
            Complete preparation instructions and requirements
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue={activeTab} className="mt-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="recipe">Recipe</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipe" className="mt-6">
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Temperature Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(recipeDetails.temperature_requirements).length > 0 ? 
                    Object.entries(recipeDetails.temperature_requirements).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 border rounded-md">
                        <span className="font-medium capitalize">{key.replace('_', ' ')}</span>
                        <span>{value}°F</span>
                      </div>
                    )) : 
                    <p className="text-muted-foreground">No temperature requirements specified</p>
                  }
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Time Requirements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3 border rounded-md">
                    <span className="font-medium">Prep Time</span>
                    <span>{typeof recipeDetails.prepTime === 'number' ? `${recipeDetails.prepTime} minutes` : "15 minutes"}</span>
                  </div>
                  <div className="flex justify-between p-3 border rounded-md">
                    <span className="font-medium">Cook Time</span>
                    <span>{typeof recipeDetails.cookTime === 'number' ? `${recipeDetails.cookTime} minutes` : "20 minutes"}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Equipment</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Array.isArray(recipeDetails.equipment_needed) && recipeDetails.equipment_needed.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {recipeDetails.equipment_needed.map((item, idx) => (
                        <li key={idx}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Standard kitchen equipment</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quality Checks</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Array.isArray(recipeDetails.quality_checks) && recipeDetails.quality_checks.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {recipeDetails.quality_checks.map((check, idx) => (
                        <li key={idx}>• {check}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Verify appearance, temperature, and taste.</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Preparation Steps</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Array.isArray(recipeDetails.steps) && recipeDetails.steps.length > 0 ? (
                    <ol className="space-y-3 list-decimal list-inside">
                      {recipeDetails.steps.map((step, idx) => (
                        <li key={idx} className="text-sm">{step}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground">Follow standard kitchen procedures</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                <div className="p-3 border rounded-md">
                  {typeof recipeDetails.notes === 'string' && recipeDetails.notes ? (
                    <div className="text-sm">
                      {recipeDetails.notes}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No special notes</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <div className="grid grid-cols-1 gap-2">
                {menuItem && Array.isArray(menuItem.ingredients) && menuItem.ingredients.length > 0 ? (
                  menuItem.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between p-2 border rounded-md">
                      <span>{ingredient.name}</span>
                      <span>{ingredient.quantity} {ingredient.unit}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No ingredients specified</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
