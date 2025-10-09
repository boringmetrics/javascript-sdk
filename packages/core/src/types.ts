//
// SDK
//

export interface Config {
  /** API token for authentication */
  token: string;
  /** Maximum number of retry attempts for failed requests */
  maxRetryAttempts: number;
  /** Maximum batch size for logs */
  logsMaxBatchSize: number;
  /** Interval in milliseconds to send batched logs */
  logsSendInterval: number;
  /** Maximum batch size for live updates */
  livesMaxBatchSize: number;
  /** Interval in milliseconds to send batched live updates */
  livesDebounceTime: number;
}

export type ClientConfig = Omit<Partial<Config>, 'token'>;

export interface Transport {
  sendLogs(logs: Log[], token: string): Promise<void>;
  updateLive(update: LiveUpdate, token: string): Promise<void>;
  identifyUser(user: UserIdentify, token: string): Promise<void>;
}

//
// Logs
//

export type LogType = 'log';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface Log {
  type: LogType;
  level: LogLevel;
  message: string;
  data?: Record<string, any>;
  userId?: string;
  anonymousId?: string;
  sessionId?: string;
  /** ISO8601 date - will be automatically set by the SDK if not provided */
  sentAt?: string;
}

//
// Lives
//

export type LiveUpdateOperation = 'set' | 'increment';

export interface LiveUpdate {
  liveId: string;
  value: number;
  operation: LiveUpdateOperation;
  /** ISO8601 date - will be automatically set by the SDK if not provided */
  sentAt?: string;
}

//
// User
//

export interface UserIdentify {
  userId: string | null;
  anonymousId?: string | null;
  name?: string | null;
  email?: string | null;
  properties?: Record<string, any> | null;
  /** ISO8601 date - will be automatically set by the SDK if not provided */
  sentAt?: string;
}
