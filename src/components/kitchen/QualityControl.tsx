
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QualityCheckItem {
  id: string;
  name: string;
  completed: boolean;
  category: 'temperature' | 'safety' | 'cleanliness' | 'food';
  frequency: 'daily' | 'shift' | 'weekly';
  lastCompleted?: string;
}

const qualityChecks: QualityCheckItem[] = [
  {
    id: 'temp1',
    name: 'Refrigerator temperature check',
    completed: true,
    category: 'temperature',
    frequency: 'daily',
    lastCompleted: new Date().toISOString()
  },
  {
    id: 'safety1',
    name: 'Fire extinguisher inspection',
    completed: false,
    category: 'safety',
    frequency: 'weekly'
  },
  {
    id: 'clean1',
    name: 'Deep clean cooking surfaces',
    completed: true,
    category: 'cleanliness',
    frequency: 'daily',
    lastCompleted: new Date().toISOString()
  },
  {
    id: 'food1',
    name: 'Ingredient freshness check',
    completed: false,
    category: 'food',
    frequency: 'shift'
  }
];

export function QualityControl() {
  const [checks, setChecks] = React.useState<QualityCheckItem[]>(qualityChecks);

  const handleCheckChange = (id: string, checked: boolean) => {
    setChecks(checks.map(check => 
      check.id === id 
        ? { 
            ...check, 
            completed: checked, 
            lastCompleted: checked ? new Date().toISOString() : check.lastCompleted 
          } 
        : check
    ));
  };

  const getCategoryColor = (category: QualityCheckItem['category']) => {
    switch (category) {
      case 'temperature': return 'bg-blue-100 text-blue-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'cleanliness': return 'bg-green-100 text-green-800';
      case 'food': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Quality Control Checklist</h3>
      <div className="space-y-3">
        {checks.map((check) => (
          <div key={check.id} className="flex items-start gap-3 p-2 border rounded-md">
            <Checkbox 
              id={check.id}
              checked={check.completed}
              onCheckedChange={(checked) => handleCheckChange(check.id, checked as boolean)}
            />
            <div className="flex-1">
              <Label 
                htmlFor={check.id} 
                className={`font-medium ${check.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {check.name}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getCategoryColor(check.category)}>
                  {check.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {check.frequency}
                </span>
                {check.lastCompleted && (
                  <span className="text-xs text-muted-foreground">
                    Last completed: {new Date(check.lastCompleted).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
