
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface AnalyticsPeriod {
  start: string;
  end: string;
}

export interface AnalyticsReport {
  id: string;
  period: AnalyticsPeriod;
  metrics: AnalyticsMetric[];
  generatedAt: string;
}
