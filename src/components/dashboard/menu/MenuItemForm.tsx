
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Image, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/types/staff";
import type { MenuItemFormData } from "./types";
import { Switch } from "@/components/ui/switch";

interface MenuItemFormProps {
  data: MenuItemFormData;
  onSubmit: () => void;
  onChange: (data: MenuItemFormData) => void;
  submitLabel: string;
}

export const MenuItemForm = ({ data, onSubmit, onChange, submitLabel }: MenuItemFormProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.image || null);
  
  // Reset preview URL when data changes (e.g., when opening the form for a different item)
  useEffect(() => {
    setPreviewUrl(data.image || null);
  }, [data.id, data.image]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      
      // Update the form data with the image file
      onChange({ ...data, imageFile: file });
    }
  };

  const categories: MenuItem["category"][] = ["appetizer", "main", "dessert", "beverage"];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Item name"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <Select
          value={data.category}
          onValueChange={(value: MenuItem["category"]) =>
            onChange({ ...data, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Price ($)</label>
        <Input
          type="number"
          step="0.01"
          value={data.price}
          onChange={(e) => onChange({ ...data, price: Number(e.target.value) })}
          placeholder="Price"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Description"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Preparation Time (minutes)</label>
        <Input
          type="number"
          value={data.preparationTime}
          onChange={(e) => onChange({ ...data, preparationTime: Number(e.target.value) })}
          min={1}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Allergens</label>
        <Input
          value={data.allergens.join(", ")}
          onChange={(e) => onChange({
            ...data,
            allergens: e.target.value.split(",").map(a => a.trim()).filter(Boolean)
          })}
          placeholder="e.g., nuts, dairy, gluten"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="available"
          checked={data.available}
          onCheckedChange={(checked) => onChange({ ...data, available: checked })}
        />
        <label htmlFor="available" className="text-sm font-medium">
          Available
        </label>
      </div>

      <div>
        <label className="text-sm font-medium">Item Image</label>
        <div className="flex items-center gap-4 mt-2">
          <div className="relative w-28 h-28 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <Image className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="menu-item-image" className="cursor-pointer">
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-md text-sm hover:bg-muted/80 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </div>
              <input
                id="menu-item-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              Recommended: 16:9 ratio, max 2MB
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
