
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: unknown;
  context?: Record<string, unknown>;
}

class Logger {
  private static instance: Logger;
  private logQueue: LogEntry[] = [];
  private readonly MAX_QUEUE_SIZE = 100;

  private constructor() {
    this.setupErrorHandling();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    details?: unknown,
    context?: Record<string, unknown>
  ): LogEntry {
    return {
      timestamp: this.formatTimestamp(),
      level,
      message,
      details,
      context
    };
  }

  private async persistLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    try {
      // Store logs in IndexedDB for offline persistence
      const db = await this.openDatabase();
      const tx = db.transaction('logs', 'readwrite');
      const store = tx.objectStore('logs');

      for (const log of this.logQueue) {
        await store.add(log);
      }

      this.logQueue = [];
    } catch (error) {
      console.error('Failed to persist logs:', error);
    }
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        reason: event.reason
      });
    });
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ApplicationLogs', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore('logs', { keyPath: 'timestamp' });
      };
    });
  }

  debug(message: string, details?: unknown, context?: Record<string, unknown>): void {
    this.log('debug', message, details, context);
  }

  info(message: string, details?: unknown, context?: Record<string, unknown>): void {
    this.log('info', message, details, context);
  }

  warn(message: string, details?: unknown, context?: Record<string, unknown>): void {
    this.log('warn', message, details, context);
  }

  error(message: string, details?: unknown, context?: Record<string, unknown>): void {
    this.log('error', message, details, context);
  }

  private log(
    level: LogLevel,
    message: string,
    details?: unknown,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(level, message, details, context);
    
    // Add to queue
    this.logQueue.push(entry);

    // Persist logs if queue is full
    if (this.logQueue.length >= this.MAX_QUEUE_SIZE) {
      this.persistLogs();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const consoleMethod = console[level] || console.log;
      consoleMethod(`[${level.toUpperCase()}] ${message}`, { details, context });
    }
  }

  async getLogs(
    filter?: { level?: LogLevel; startDate?: Date; endDate?: Date }
  ): Promise<LogEntry[]> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('logs', 'readonly');
      const store = tx.objectStore('logs');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        let logs = request.result;
        
        if (filter) {
          logs = logs.filter((log: LogEntry) => {
            const timestamp = new Date(log.timestamp);
            return (
              (!filter.level || log.level === filter.level) &&
              (!filter.startDate || timestamp >= filter.startDate) &&
              (!filter.endDate || timestamp <= filter.endDate)
            );
          });
        }

        resolve(logs);
      };
    });
  }

  async clearLogs(): Promise<void> {
    const db = await this.openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('logs', 'readwrite');
      const store = tx.objectStore('logs');
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export const logger = Logger.getInstance();
