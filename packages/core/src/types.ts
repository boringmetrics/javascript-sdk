export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export type LogType = 'log';

export interface ClientLog {
  type: LogType;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  sessionId?: string;
  /** ISO8601 date */
  sentAt: string;
}

export type LiveUpdateOperation = 'set' | 'increment';

export interface ClientLiveUpdate {
  liveId: string;
  value: number;
  operation: LiveUpdateOperation;
  /** ISO8601 date */
  sentAt: string;
}

export interface Config {
  /** API token for authentication */
  token: string;
  /** API URL (defaults to https://api.getboringmetrics.com) */
  apiUrl?: string;
  /** Maximum number of retry attempts for failed requests */
  maxRetryAttempts?: number;
  /** Maximum batch size for logs */
  logsMaxBatchSize?: number;
  /** Interval in milliseconds to send batched logs */
  logsSendInterval?: number;
  /** Debounce time in milliseconds for live updates */
  livesDebounceTime?: number;
}

export interface Transport {
  sendLogs(logs: ClientLog[], token: string): Promise<void>;
  updateLive(update: ClientLiveUpdate, token: string): Promise<void>;
}
