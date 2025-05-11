import { Config } from './types';

export const API_URL = 'https://api.getboringmetrics.com';

export const DEFAULT_CONFIG: Omit<Config, 'token'> = {
  maxRetryAttempts: 5,
  logsMaxBatchSize: 100,
  logsSendInterval: 5000, // 5 seconds
  livesMaxBatchSize: 20,
  livesDebounceTime: 1000, // 1 second
};
