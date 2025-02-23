
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { MenuSetupInfo } from "../types";

interface MenuTabProps {
  menuInfo: MenuSetupInfo;
  setMenuInfo: (info: MenuSetupInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const MenuTab = ({ menuInfo, setMenuInfo, onValidationChange }: MenuTabProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [newAllergen, setNewAllergen] = useState("");

  const addCategory = () => {
    if (newCategory && !menuInfo.categories.includes(newCategory)) {
      setMenuInfo({
        ...menuInfo,
        categories: [...menuInfo.categories, newCategory]
      });
      setNewCategory("");
    }
  };

  const addAllergen = () => {
    if (newAllergen && !menuInfo.itemDefaults.allergenOptions.includes(newAllergen)) {
      setMenuInfo({
        ...menuInfo,
        itemDefaults: {
          ...menuInfo.itemDefaults,
          allergenOptions: [...menuInfo.itemDefaults.allergenOptions, newAllergen]
        }
      });
      setNewAllergen("");
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Menu Categories</h3>
          <div className="flex gap-2 mb-4">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Add new category"
            />
            <Button onClick={addCategory}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {menuInfo.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
                <button
                  onClick={() => setMenuInfo({
                    ...menuInfo,
                    categories: menuInfo.categories.filter(c => c !== category)
                  })}
                  className="ml-2"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Item Defaults</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Preparation Time (minutes)</label>
              <Input
                type="number"
                value={menuInfo.itemDefaults.preparationTime}
                onChange={(e) => setMenuInfo({
                  ...menuInfo,
                  itemDefaults: {
                    ...menuInfo.itemDefaults,
                    preparationTime: Number(e.target.value)
                  }
                })}
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Common Allergens</label>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newAllergen}
                  onChange={(e) => setNewAllergen(e.target.value)}
                  placeholder="Add allergen"
                />
                <Button onClick={addAllergen}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {menuInfo.itemDefaults.allergenOptions.map((allergen) => (
                  <Badge key={allergen} variant="outline">
                    {allergen}
                    <button
                      onClick={() => setMenuInfo({
                        ...menuInfo,
                        itemDefaults: {
                          ...menuInfo.itemDefaults,
                          allergenOptions: menuInfo.itemDefaults.allergenOptions.filter(a => a !== allergen)
                        }
                      })}
                      className="ml-2"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium mb-4">Inventory Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Track Inventory</label>
              <Switch
                checked={menuInfo.inventory.trackInventory}
                onCheckedChange={(checked) => setMenuInfo({
                  ...menuInfo,
                  inventory: { ...menuInfo.inventory, trackInventory: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Low Stock Alerts</label>
              <Switch
                checked={menuInfo.inventory.lowStockAlerts}
                onCheckedChange={(checked) => setMenuInfo({
                  ...menuInfo,
                  inventory: { ...menuInfo.inventory, lowStockAlerts: checked }
                })}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-Reorder</label>
              <Switch
                checked={menuInfo.inventory.autoReorder}
                onCheckedChange={(checked) => setMenuInfo({
                  ...menuInfo,
                  inventory: { ...menuInfo.inventory, autoReorder: checked }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
