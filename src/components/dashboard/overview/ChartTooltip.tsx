
import { format } from "date-fns";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
  }>;
  label?: string;
  valuePrefix?: string;
}

export const ChartTooltip = ({ active, payload, label, valuePrefix = "$" }: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <p className="font-medium">{format(new Date(label || ""), "MMM d, yyyy")}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm mt-1">
          {entry.name}: {valuePrefix}{entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};
