import { BaseClient, ClientConfig, LiveUpdate, Log } from '@boringmetrics/core';
import { SESSION_ID_KEY } from './constants';
import { BrowserTransport } from './transport';
import { generateSessionId } from './utils';

/**
 * BoringMetrics Browser SDK
 */
export class BoringMetrics {
  private static instance: BoringMetrics;
  private client: BaseClient;
  private sessionId: string;

  //
  // Lifecycle
  //
  private constructor(token: string, config: ClientConfig = {}) {
    const transport = new BrowserTransport();
    this.client = BaseClient.init(token, config, transport);
    this.sessionId = this.getSessionId();
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

  //
  // Utils
  //
  private addLog(log: Log): void {
    (this.client as any).addLog(log);
  }

  private updateLive(live: LiveUpdate): void {
    (this.client as any).updateLive(live);
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = generateSessionId();
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }

    return sessionId;
  }
}
