
import React from 'react';

interface Modification {
  id: number;
  timestamp: string;
  type: string;
  user: string;
  details: string;
}

interface OrderModificationLogProps {
  modifications: Modification[];
}

export function OrderModificationLog({ modifications }: OrderModificationLogProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Modification History</h3>
      {modifications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No modifications recorded</p>
      ) : (
        <ul className="space-y-2">
          {modifications.map((mod) => (
            <li key={mod.id} className="text-sm border-b pb-2">
              <div className="flex justify-between items-start">
                <span className="font-medium">{mod.type}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(mod.timestamp).toLocaleString()}
                </span>
              </div>
              <p>{mod.details}</p>
              <p className="text-xs text-muted-foreground">By: {mod.user}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
