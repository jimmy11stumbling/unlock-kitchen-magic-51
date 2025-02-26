
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { MenuItem } from "@/types/staff";
import type { MenuItemFormData } from "./types";

interface MenuItemFormProps {
  data: MenuItemFormData;
  onSubmit: () => void;
  onChange: (data: MenuItemFormData) => void;
  submitLabel: string;
}

export const MenuItemForm = ({ data, onSubmit, onChange, submitLabel }: MenuItemFormProps) => {
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

      <div>
        <label className="text-sm font-medium">Price</label>
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
        />
      </div>

      <div>
        <label className="text-sm font-medium">Preparation Time (minutes)</label>
        <Input
          type="number"
          value={data.preparationTime}
          onChange={(e) => onChange({ ...data, preparationTime: Number(e.target.value) })}
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

      <div className="pt-4">
        <Button className="w-full" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
