
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, X } from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'sanitation' | 'quality' | 'safety';
}

export function QualityControl() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'temp-monitoring', label: 'Temperature monitoring systems active', checked: true, category: 'safety' },
    { id: 'food-storage', label: 'Food storage guidelines followed', checked: true, category: 'sanitation' },
    { id: 'stations-clean', label: 'Workstations clean and sanitized', checked: false, category: 'sanitation' },
    { id: 'hand-washing', label: 'Hand washing stations stocked', checked: true, category: 'sanitation' },
    { id: 'allergen-protocol', label: 'Allergen protocols in place', checked: true, category: 'safety' },
    { id: 'taste-testing', label: 'Taste testing completed', checked: false, category: 'quality' },
    { id: 'presentation-standards', label: 'Presentation standards reviewed', checked: false, category: 'quality' },
    { id: 'safety-equipment', label: 'Safety equipment operational', checked: true, category: 'safety' },
  ]);
  
  const handleToggle = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const clearAll = () => {
    setChecklist(prev => 
      prev.map(item => ({ ...item, checked: false }))
    );
  };
  
  const checkAll = () => {
    setChecklist(prev => 
      prev.map(item => ({ ...item, checked: true }))
    );
  };
  
  const getProgress = () => {
    const checked = checklist.filter(item => item.checked).length;
    return Math.round((checked / checklist.length) * 100);
  };
  
  const getCategoryColor = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'sanitation': return 'bg-blue-100 text-blue-800';
      case 'quality': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-red-100 text-red-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Quality Control</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="h-7 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={checkAll}
              className="h-7 px-2"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center mt-1">
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full" 
              style={{ width: `${getProgress()}%` }}
            />
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {getProgress()}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-start space-x-2">
              <Checkbox 
                id={item.id} 
                checked={item.checked}
                onCheckedChange={() => handleToggle(item.id)}
              />
              <div className="flex flex-col">
                <Label 
                  htmlFor={item.id}
                  className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                >
                  {item.label}
                </Label>
                <Badge 
                  variant="outline" 
                  className={`mt-1 text-[10px] ${getCategoryColor(item.category)}`}
                >
                  {item.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
