import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import type { MenuItem } from "@/types/staff";

interface MenuCustomizationProps {
  onAddMenuItem: (item: Omit<MenuItem, "id">) => void;
}

export const MenuCustomization = ({ onAddMenuItem }: MenuCustomizationProps) => {
  const [showCustomItemForm, setShowCustomItemForm] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItemCategory, setCustomItemCategory] = useState<MenuItem["category"]>("main");
  const [customItemDescription, setCustomItemDescription] = useState("");
  const [customItemAllergens, setCustomItemAllergens] = useState<string[]>([]);
  const [customItemPrepTime, setCustomItemPrepTime] = useState("");

  const [showSpecialForm, setShowSpecialForm] = useState(false);
  const [specialName, setSpecialName] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [specialCategory, setSpecialCategory] = useState<MenuItem["category"]>("main");
  const [specialDescription, setSpecialDescription] = useState("");
  const [specialAllergens, setSpecialAllergens] = useState<string[]>([]);
  const [specialPrepTime, setSpecialPrepTime] = useState("");
  const [currentSpecial, setCurrentSpecial] = useState<Omit<MenuItem, "id"> | null>(null);

  const addCustomMenuItem = () => {
    onAddMenuItem({
      name: customItemName,
      price: parseFloat(customItemPrice),
      category: customItemCategory,
      description: customItemDescription,
      available: true,
      allergens: customItemAllergens,
      preparationTime: parseInt(customItemPrepTime),
      orderCount: 0  // Add this line
    });
    setCustomItemName("");
    setCustomItemPrice("");
    setCustomItemCategory("main");
    setCustomItemDescription("");
    setCustomItemAllergens([]);
    setCustomItemPrepTime("");
    setShowCustomItemForm(false);
  };

  const handleAddSpecial = () => {
    setCurrentSpecial({
      name: specialName,
      price: parseFloat(specialPrice),
      category: specialCategory,
      description: specialDescription,
      available: true,
      allergens: specialAllergens,
      preparationTime: parseInt(specialPrepTime),
      orderCount: 0  // Add this line
    });
    setSpecialName("");
    setSpecialPrice("");
    setSpecialCategory("main");
    setSpecialDescription("");
    setSpecialAllergens([]);
    setSpecialPrepTime("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Menu Customization</h2>
        <Button onClick={() => setShowCustomItemForm(!showCustomItemForm)}>
          {showCustomItemForm ? "Hide Form" : "Add Custom Item"}
        </Button>
      </div>

      {showCustomItemForm && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Add New Menu Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="item-name">Name</Label>
              <Input
                id="item-name"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-price">Price</Label>
              <Input
                id="item-price"
                type="number"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-category">Category</Label>
              <Select value={customItemCategory} onValueChange={(value: MenuItem["category"]) => setCustomItemCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-prep-time">Preparation Time (minutes)</Label>
              <Input
                id="item-prep-time"
                type="number"
                value={customItemPrepTime}
                onChange={(e) => setCustomItemPrepTime(e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={customItemDescription}
                onChange={(e) => setCustomItemDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {["nuts", "dairy", "gluten", "soy", "shellfish"].map((allergen) => (
                  <Badge
                    key={allergen}
                    variant={customItemAllergens.includes(allergen) ? "default" : "outline"}
                    onClick={() => {
                      if (customItemAllergens.includes(allergen)) {
                        setCustomItemAllergens(customItemAllergens.filter((a) => a !== allergen));
                      } else {
                        setCustomItemAllergens([...customItemAllergens, allergen]);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {allergen}
                    {customItemAllergens.includes(allergen) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button className="mt-4" onClick={addCustomMenuItem}>
            Add Menu Item
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Create Special</h2>
        <Button onClick={() => setShowSpecialForm(!showSpecialForm)}>
          {showSpecialForm ? "Hide Form" : "Create Special"}
        </Button>
      </div>

      {showSpecialForm && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Create Special Menu Item</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="special-name">Name</Label>
              <Input
                id="special-name"
                value={specialName}
                onChange={(e) => setSpecialName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="special-price">Price</Label>
              <Input
                id="special-price"
                type="number"
                value={specialPrice}
                onChange={(e) => setSpecialPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="special-category">Category</Label>
              <Select value={specialCategory} onValueChange={(value: MenuItem["category"]) => setSpecialCategory(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appetizer">Appetizer</SelectItem>
                  <SelectItem value="main">Main Course</SelectItem>
                  <SelectItem value="dessert">Dessert</SelectItem>
                  <SelectItem value="beverage">Beverage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="special-prep-time">Preparation Time (minutes)</Label>
              <Input
                id="special-prep-time"
                type="number"
                value={specialPrepTime}
                onChange={(e) => setSpecialPrepTime(e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="special-description">Description</Label>
              <Textarea
                id="special-description"
                value={specialDescription}
                onChange={(e) => setSpecialDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Allergens</Label>
              <div className="flex flex-wrap gap-2">
                {["nuts", "dairy", "gluten", "soy", "shellfish"].map((allergen) => (
                  <Badge
                    key={allergen}
                    variant={specialAllergens.includes(allergen) ? "default" : "outline"}
                    onClick={() => {
                      if (specialAllergens.includes(allergen)) {
                        setSpecialAllergens(specialAllergens.filter((a) => a !== allergen));
                      } else {
                        setSpecialAllergens([...specialAllergens, allergen]);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    {allergen}
                    {specialAllergens.includes(allergen) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button className="mt-4" onClick={handleAddSpecial}>
            Create Special
          </Button>
        </div>
      )}

      {currentSpecial && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Current Special</h3>
          <p>Name: {currentSpecial.name}</p>
          <p>Price: {currentSpecial.price}</p>
          <p>Category: {currentSpecial.category}</p>
          <p>Description: {currentSpecial.description}</p>
          <p>Preparation Time: {currentSpecial.preparationTime}</p>
          <p>Allergens: {currentSpecial.allergens?.join(", ") || "None"}</p>
        </div>
      )}
    </div>
  );
};
