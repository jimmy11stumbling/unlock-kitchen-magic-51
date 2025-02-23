
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LayoutInfo } from "../types";

interface LayoutTabProps {
  layoutInfo: LayoutInfo;
  setLayoutInfo: (info: LayoutInfo) => void;
}

export const LayoutTab = ({ layoutInfo, setLayoutInfo }: LayoutTabProps) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Sections</label>
          {layoutInfo.sections.map((section, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-2">
              <Input
                value={section.name}
                onChange={(e) => {
                  const newSections = [...layoutInfo.sections];
                  newSections[index].name = e.target.value;
                  setLayoutInfo({ ...layoutInfo, sections: newSections });
                }}
                placeholder="Section name"
              />
              <Input
                type="number"
                value={section.tables}
                onChange={(e) => {
                  const newSections = [...layoutInfo.sections];
                  newSections[index].tables = Number(e.target.value);
                  setLayoutInfo({ ...layoutInfo, sections: newSections });
                }}
                placeholder="Number of tables"
              />
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
              <Input
                key={index}
                type="number"
                className="w-20"
                value={capacity}
                onChange={(e) => {
                  const newCapacities = [...layoutInfo.defaultCapacities];
                  newCapacities[index] = Number(e.target.value);
                  setLayoutInfo({ ...layoutInfo, defaultCapacities: newCapacities });
                }}
              />
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
