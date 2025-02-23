
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutInfo } from "../types";
import { layoutInfoSchema } from "../validation/schemas";
import { useToast } from "@/hooks/use-toast";

interface LayoutTabProps {
  layoutInfo: LayoutInfo;
  setLayoutInfo: (info: LayoutInfo) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export const LayoutTab = ({ 
  layoutInfo, 
  setLayoutInfo,
  onValidationChange 
}: LayoutTabProps) => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateLayout = () => {
    try {
      layoutInfoSchema.parse(layoutInfo);
      setErrors({});
      onValidationChange?.(true);
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors.forEach((err: any) => {
        const path = err.path.join(".");
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      onValidationChange?.(false);
      return false;
    }
  };

  useEffect(() => {
    validateLayout();
  }, [layoutInfo]);

  const handleSectionChange = (index: number, field: 'name' | 'tables', value: string | number) => {
    const newSections = [...layoutInfo.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: field === 'tables' ? Number(value) : value
    };
    setLayoutInfo({ ...layoutInfo, sections: newSections });
  };

  const handleCapacityChange = (index: number, value: number) => {
    const newCapacities = [...layoutInfo.defaultCapacities];
    newCapacities[index] = value;
    setLayoutInfo({ ...layoutInfo, defaultCapacities: newCapacities });
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Sections</label>
          {layoutInfo.sections.map((section, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <Input
                  value={section.name}
                  onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
                  placeholder="Section name"
                  className={errors[`sections.${index}.name`] ? "border-red-500" : ""}
                />
                {errors[`sections.${index}.name`] && (
                  <p className="text-sm text-red-500 mt-1">{errors[`sections.${index}.name`]}</p>
                )}
              </div>
              <div>
                <Input
                  type="number"
                  value={section.tables}
                  onChange={(e) => handleSectionChange(index, 'tables', e.target.value)}
                  placeholder="Number of tables"
                  min="1"
                  className={errors[`sections.${index}.tables`] ? "border-red-500" : ""}
                />
                {errors[`sections.${index}.tables`] && (
                  <p className="text-sm text-red-500 mt-1">{errors[`sections.${index}.tables`]}</p>
                )}
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setLayoutInfo({
              ...layoutInfo,
              sections: [...layoutInfo.sections, { name: "", tables: 0 }]
            })}
          >
            Add Section
          </Button>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-2 block">Default Table Capacities</label>
          <div className="flex flex-wrap gap-2">
            {layoutInfo.defaultCapacities.map((capacity, index) => (
              <div key={index}>
                <Input
                  type="number"
                  className={`w-20 ${errors[`defaultCapacities.${index}`] ? "border-red-500" : ""}`}
                  value={capacity}
                  onChange={(e) => handleCapacityChange(index, Number(e.target.value))}
                  min="1"
                />
                {errors[`defaultCapacities.${index}`] && (
                  <p className="text-sm text-red-500 mt-1">{errors[`defaultCapacities.${index}`]}</p>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setLayoutInfo({
                ...layoutInfo,
                defaultCapacities: [...layoutInfo.defaultCapacities, 2]
              })}
            >
              Add Capacity
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
