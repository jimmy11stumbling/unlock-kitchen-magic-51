
import { format } from "date-fns";

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
    color: string;
  }>;
  label?: string;
  valuePrefix?: string;
}

export const ChartTooltip = ({ active, payload, label, valuePrefix = "$" }: ChartTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-black/90 backdrop-blur-sm p-4 rounded-lg shadow border border-white/10">
      <p className="font-medium text-white/90">{format(new Date(label || ""), "MMM d, yyyy")}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm mt-1" style={{ color: entry.color }}>
          {entry.name}: {valuePrefix}{entry.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
};
