
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Ingredient } from "@/types";

interface IngredientStatusProps {
  ingredients: Ingredient[];
}

export const IngredientStatus = ({ ingredients }: IngredientStatusProps) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Ingredient Status</h2>
      <div className="space-y-4">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{ingredient.name}</span>
              <Badge 
                variant={
                  ingredient.current_stock <= ingredient.minimum_stock 
                    ? "destructive" 
                    : "default"
                }
              >
                {ingredient.current_stock} {ingredient.unit}
              </Badge>
            </div>
            <Progress 
              value={(ingredient.current_stock / (ingredient.minimum_stock * 2)) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
