import { BaseClient, ClientConfig, LiveUpdate, Log, UserIdentify } from '@boringmetrics/core';
import {
  ANONYMOUS_ID_KEY,
  SESSION_ID_KEY,
  SESSION_INACTIVITY_TIMEOUT,
  SESSION_LAST_ACTIVE_AT_KEY,
} from './constants';
import { getProperties } from './context';
import { generateId } from './ids';
import { BrowserTransport } from './transport';

/**
 * BoringMetrics Browser SDK
 */
export class BoringMetrics {
  private static instance: BoringMetrics;
  private client: BaseClient;
  private anonymousId: string;
  private sessionId: string;
  private userId: string | null;

  //
  // Lifecycle
  //
  private constructor(token: string, config: ClientConfig = {}) {
    const transport = new BrowserTransport();
    this.client = BaseClient.init(token, config, transport);
    this.anonymousId = this.getAnonymousId();
    this.sessionId = this.getSessionId();
    this.userId = null;
  }

  private static getInstance(): BoringMetrics {
    if (!BoringMetrics.instance) {
      throw new Error('[BoringMetrics] SDK is not initialized. Call init() first.');
    }

    return BoringMetrics.instance;
  }

  //
  // API
  //

  /**
   * Initialize the SDK with the given API token
   * @param token Your BoringMetrics API token
   * @param config Optional configuration options
   */
  public static init(token: string, config?: ClientConfig): BoringMetrics {
    if (!BoringMetrics.instance) {
      BoringMetrics.instance = new BoringMetrics(token, config);
    }

    return BoringMetrics.instance;
  }

  public static readonly logs = {
    /**
     * Send a single log event
     * @param log The log event to send
     */
    send: (log: Log): void => {
      const instance = BoringMetrics.getInstance();
      const logWithSession: Log = {
        ...log,
        sessionId: log.sessionId || instance.sessionId,
        userId: log.userId || instance.userId || undefined,
      };
      instance.addLog(logWithSession);
    },

    /**
     * Send multiple log events in a batch
     * @param logs Array of log events to send
     */
    sendBatch: (logs: Log[]): void => {
      const instance = BoringMetrics.getInstance();
      logs.forEach(log => {
        const logWithSession: Log = {
          ...log,
          sessionId: log.sessionId || instance.sessionId,
          userId: log.userId || instance.userId || undefined,
        };
        instance.addLog(logWithSession);
      });
    },
  };

  public static readonly lives = {
    /**
     * Update a live metric value
     * @param update The live update to send
     */
    update: (update: LiveUpdate): void => {
      const instance = BoringMetrics.getInstance();
      instance.updateLive(update);
    },

    /**
     * Update multiple live metrics values in a batch
     * @param updates Array of live updates to send
     */
    updateBatch: (updates: LiveUpdate[]): void => {
      const instance = BoringMetrics.getInstance();
      updates.forEach(update => instance.updateLive(update));
    },
  };

  public static readonly users = {
    /**
     * Identify the current user
     * @param user The user identification info
     */
    identify: async (user: Omit<UserIdentify, 'anonymousId'>): Promise<void> => {
      const instance = BoringMetrics.getInstance();
      instance.identifyUser(user);
    },
  };

  //
  // Utils
  //
  private addLog(log: Log): void {
    this.client.addLog(log);
  }

  private updateLive(live: LiveUpdate): void {
    this.client.updateLive(live);
  }

  private identifyUser(user: UserIdentify): void {
    const properties = getProperties();

    this.client.identifyUser({
      ...user,
      anonymousId: this.anonymousId,
      properties: {
        ...properties,
        // Let user properties override context properties
        ...user.properties,
      },
    });

    // Update the current userId for logs
    this.userId = user.userId || null;
  }

  private getAnonymousId(): string {
    let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (!anonymousId) {
      anonymousId = generateId();
      localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);
    }

    return anonymousId;
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = generateId();
      localStorage.setItem(SESSION_ID_KEY, sessionId);
      localStorage.setItem(SESSION_LAST_ACTIVE_AT_KEY, Date.now().toString());
    } else {
      const lastActiveAt = this.getSessionLastActiveAt();
      const now = Date.now();
      // If last active time is too long ago ago, start a new session
      if (now - lastActiveAt > SESSION_INACTIVITY_TIMEOUT) {
        sessionId = generateId();
        localStorage.setItem(SESSION_ID_KEY, sessionId);
      }

      localStorage.setItem(SESSION_LAST_ACTIVE_AT_KEY, now.toString());
    }

    return sessionId;
  }

  private getSessionLastActiveAt(): number {
    const lastActiveAt = localStorage.getItem(SESSION_LAST_ACTIVE_AT_KEY);
    if (!lastActiveAt) {
      return lastActiveAt ? parseInt(lastActiveAt, 10) : 0;
    }

    return 0;
  }
}
