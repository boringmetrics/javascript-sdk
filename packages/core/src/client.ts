import { DEFAULT_CONFIG } from './constants';
import { ClientConfig, Config, LiveUpdate, Log, Transport, UserIdentify } from './types';
import { withRetry } from './utils';

export class BaseClient {
  private static instance: BaseClient;

  private config: Config;
  private transport: Transport;

  // Logs state
  private logs: Log[] = [];
  private logsTimerId: ReturnType<typeof setTimeout> | null = null;
  // Lives state
  private lives: LiveUpdate[] = [];
  private livesTimerId: ReturnType<typeof setTimeout> | null = null;

  //
  // Lifecycle
  //
  protected constructor(token: string, config: ClientConfig, transport: Transport) {
    this.config = {
      ...DEFAULT_CONFIG,
      token,
      ...config,
    };
    this.transport = transport;
  }

  public static init(token: string, config: ClientConfig, transport: Transport): BaseClient {
    if (!BaseClient.instance) {
      BaseClient.instance = new BaseClient(token, config, transport);
    }

    return BaseClient.instance;
  }

  protected static getInstance(): BaseClient {
    if (!BaseClient.instance) {
      throw new Error('[BoringMetrics] BaseClient SDK is not initialized. Call init() first.');
    }

    return BaseClient.instance;
  }

  //
  // Logs
  //
  public addLog(log: Log): void {
    const finalLog: Log = {
      ...log,
      sentAt: log.sentAt || new Date().toISOString(),
    };

    this.logs.push(finalLog);

    if (this.logs.length >= this.config.logsMaxBatchSize) {
      this.flushLogs();
    } else if (this.logsTimerId === null) {
      this.scheduleLogsFlush();
    }
  }

  private scheduleLogsFlush(): void {
    this.logsTimerId = setTimeout(() => {
      this.flushLogs();
    }, this.config.logsSendInterval);
  }

  private flushLogs(): void {
    if (this.logsTimerId !== null) {
      clearTimeout(this.logsTimerId);
      this.logsTimerId = null;
    }

    if (this.logs.length === 0) {
      return;
    }

    const logsToSend = [...this.logs];
    this.logs = [];

    this.sendLogs(logsToSend);
  }

  private async sendLogs(logs: Log[]): Promise<void> {
    try {
      await withRetry(
        () => this.transport.sendLogs(logs, this.config.token),
        this.config.maxRetryAttempts
      );
    } catch (error) {
      console.error('[BoringMetrics] Error sending logs:', error);
    }
  }

  //
  // Lives
  //
  public updateLive(update: LiveUpdate): void {
    const updateWithSentAt: LiveUpdate = {
      ...update,
      sentAt: update.sentAt || new Date().toISOString(),
    };

    this.lives.push(updateWithSentAt);

    if (this.lives.length >= this.config.livesMaxBatchSize) {
      this.flushLives();
    } else if (this.livesTimerId === null) {
      this.scheduleLivesFlush();
    }
  }

  private scheduleLivesFlush(): void {
    this.livesTimerId = setTimeout(() => {
      this.flushLives();
    }, this.config.livesDebounceTime);
  }

  private flushLives(): void {
    if (this.livesTimerId !== null) {
      clearTimeout(this.livesTimerId);
      this.livesTimerId = null;
    }

    if (this.lives.length === 0) {
      return;
    }

    const livesToSend = [...this.lives];
    this.lives = [];

    this.sendLives(livesToSend);
  }

  private async sendLives(lives: LiveUpdate[]): Promise<void> {
    try {
      for (const live of lives) {
        await withRetry(
          () => this.transport.updateLive(live, this.config.token),
          this.config.maxRetryAttempts
        );
      }
    } catch (error) {
      console.error('[BoringMetrics] Error sending live updates:', error);
    }
  }

  //
  // User
  //
  public async identifyUser(user: UserIdentify): Promise<void> {
    await withRetry(
      () =>
        this.transport.identifyUser(
          { ...user, sentAt: user.sentAt || new Date().toISOString() },
          this.config.token
        ),
      this.config.maxRetryAttempts
    );
  }
}
