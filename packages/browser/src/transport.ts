import { API_URL, LiveUpdate, Log, Transport } from '@boringmetrics/core';

export class BrowserTransport implements Transport {
  async sendLogs(logs: Log[], token: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/logs`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ logs }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send logs: ${response.status}`);
    }
  }

  async updateLive(update: LiveUpdate, token: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/v1/lives/${update.liveId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ live: update }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send live update: ${response.status}`);
    }
  }
}
