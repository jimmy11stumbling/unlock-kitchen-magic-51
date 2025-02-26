
interface AnalyticsEvent {
  name: string;
  timestamp: number;
  properties?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private initialized: boolean = false;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.setupBeforeUnload();
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end');
    });
  }

  initialize(userId?: string): void {
    if (this.initialized) return;
    
    this.trackEvent('session_start', { userId });
    this.initialized = true;
  }

  trackEvent(name: string, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      name,
      timestamp: Date.now(),
      properties,
      sessionId: this.sessionId
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  private async persistEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      storedEvents.push(event);
      localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
    } catch (error) {
      console.error('Failed to persist analytics event:', error);
    }
  }

  async getEvents(
    filter?: {
      startTime?: number;
      endTime?: number;
      eventName?: string;
    }
  ): Promise<AnalyticsEvent[]> {
    try {
      const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      
      if (!filter) return storedEvents;

      return storedEvents.filter((event: AnalyticsEvent) => {
        const timeMatch = (!filter.startTime || event.timestamp >= filter.startTime) &&
                         (!filter.endTime || event.timestamp <= filter.endTime);
        const nameMatch = !filter.eventName || event.name === filter.eventName;
        
        return timeMatch && nameMatch;
      });
    } catch (error) {
      console.error('Failed to retrieve analytics events:', error);
      return [];
    }
  }

  clearEvents(): void {
    localStorage.removeItem('analytics_events');
    this.events = [];
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const analytics = AnalyticsService.getInstance();
