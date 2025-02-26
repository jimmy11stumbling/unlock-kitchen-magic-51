
interface PerformanceMetric {
  name: string;
  value: number | Record<string, any>;
  timestamp: number;
  tags?: Record<string, string>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private observers: Set<(metric: PerformanceMetric) => void> = new Set();

  private constructor() {
    this.setupPerformanceObserver();
    this.setupNetworkMonitoring();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.recordMetric(entry.name, entry.startTime);
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Observe layout shifts
      const layoutObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.recordMetric('layout-shift', entry.value);
        }
      });
      layoutObserver.observe({ entryTypes: ['layout-shift'] });

      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.recordMetric('long-task', entry.duration);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private setupNetworkMonitoring(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', () => {
        this.recordMetric('network-change', {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        });
      });
    }
  }

  recordMetric(name: string, value: number | Record<string, any>, tags?: Record<string, string>): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };

    this.metrics.push(metric);
    this.notifyObservers(metric);
  }

  trackCustomMetric(name: string, value: number): void {
    this.recordMetric(name, value);
  }

  private notifyObservers(metric: PerformanceMetric): void {
    this.observers.forEach(observer => observer(metric));
  }

  subscribeToMetrics(callback: (metric: PerformanceMetric) => void): () => void {
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  getMetrics(
    filter?: {
      name?: string;
      startTime?: number;
      endTime?: number;
      tags?: Record<string, string>;
    }
  ): PerformanceMetric[] {
    let filtered = this.metrics;

    if (filter) {
      filtered = filtered.filter(metric => {
        const nameMatch = !filter.name || metric.name === filter.name;
        const timeMatch = (!filter.startTime || metric.timestamp >= filter.startTime) &&
                         (!filter.endTime || metric.timestamp <= filter.endTime);
        const tagMatch = !filter.tags || Object.entries(filter.tags).every(
          ([key, value]) => metric.tags?.[key] === value
        );

        return nameMatch && timeMatch && tagMatch;
      });
    }

    return filtered;
  }

  calculateMetrics(): Record<string, number> {
    const metrics = this.getMetrics();
    const result: Record<string, number> = {};

    // Calculate FCP (First Contentful Paint)
    const fcp = metrics.find(m => m.name === 'first-contentful-paint');
    if (fcp && typeof fcp.value === 'number') {
      result.firstContentfulPaint = fcp.value;
    }

    // Calculate CLS (Cumulative Layout Shift)
    const cls = metrics
      .filter(m => m.name === 'layout-shift' && typeof m.value === 'number')
      .reduce((sum, m) => sum + (m.value as number), 0);
    result.cumulativeLayoutShift = cls;

    // Calculate average long task duration
    const longTasks = metrics.filter(m => m.name === 'long-task' && typeof m.value === 'number');
    if (longTasks.length > 0) {
      result.averageLongTaskDuration = longTasks.reduce((sum, m) => sum + (m.value as number), 0) / longTasks.length;
    }

    return result;
  }

  startMeasurement(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    };
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
