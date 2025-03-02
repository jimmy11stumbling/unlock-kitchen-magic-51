
interface MetricEntryProps {
  staffId: number;
  metricType: string;
  value: string;
  onAddMetric: (staffId: number, metricType: string, value: string) => void;
}

export const MetricEntry = ({ staffId, metricType, value, onAddMetric }: MetricEntryProps) => {
  const handleAddMetric = () => {
    if (!value.trim()) return;
    onAddMetric(staffId, metricType, value);
  };

  return handleAddMetric;
};
