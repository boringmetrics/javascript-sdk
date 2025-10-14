export interface FullContext {
  browser: BrowserContext;
  os: OSContext;
  device: DeviceContext;
  page: PageContext;
  app?: AppContext;
  network: NetworkContext;
}

export interface BrowserContext {
  name?: string;
  version?: string;
  language?: string;
  userAgent?: string;
}

export interface OSContext {
  name?: string;
  version?: string;
}

export interface DeviceContext {
  type?: 'desktop' | 'mobile' | 'tablet';
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  memoryGB?: number;
  cores?: number;
  touch?: boolean;
}

export interface PageContext {
  url: string;
  path: string;
  title: string;
  referrer?: string;
}

export interface AppContext {
  name: string;
  version: string;
  environment: string;
  commitSHA?: string;
}

export interface NetworkContext {
  downlinkMbps?: number;
  effectiveType?: string;
  rttMs?: number;
  online: boolean;
}

/**
 * Get contextual data without external libraries.
 */
export function getContext(app?: AppContext): FullContext {
  const ua = navigator.userAgent;
  const { browser, os } = parseUserAgent(ua);

  // Device
  const isTouch = 'ontouchstart' in window;
  const width = window.screen.width;
  const height = window.screen.height;
  const device: DeviceContext = {
    type: /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)
      ? 'mobile'
      : /ipad|tablet/i.test(ua)
        ? 'tablet'
        : 'desktop',
    screen: {
      width,
      height,
      pixelRatio: window.devicePixelRatio,
    },
    memoryGB: (navigator as any).deviceMemory,
    cores: (navigator as any).hardwareConcurrency,
    touch: isTouch,
  };

  // Page
  const page: PageContext = {
    url: window.location.href,
    path: window.location.pathname,
    title: document.title,
    referrer: document.referrer || undefined,
  };

  // Network
  const connection = (navigator as any).connection || {};
  const network: NetworkContext = {
    downlinkMbps: connection.downlink,
    effectiveType: connection.effectiveType,
    rttMs: connection.rtt,
    online: navigator.onLine,
  };

  return {
    browser,
    os,
    device,
    page,
    app,
    network,
  };
}

/**
 * Very small user-agent parser for browser + OS.
 */
function parseUserAgent(ua: string): { browser: BrowserContext; os: OSContext } {
  let browserName = 'Unknown';
  let browserVersion = '';
  let osName = 'Unknown';
  let osVersion = '';

  // --- Browser ---
  if (/chrome|crios|crmo/i.test(ua)) {
    browserName = 'Chrome';
    browserVersion = ua.match(/(?:chrome|crios|crmo)\/([\d.]+)/i)?.[1] || '';
  } else if (/firefox|fxios/i.test(ua)) {
    browserName = 'Firefox';
    browserVersion = ua.match(/(?:firefox|fxios)\/([\d.]+)/i)?.[1] || '';
  } else if (/safari/i.test(ua) && !/chrome|crios|crmo/i.test(ua)) {
    browserName = 'Safari';
    browserVersion = ua.match(/version\/([\d.]+)/i)?.[1] || '';
  } else if (/edg/i.test(ua)) {
    browserName = 'Edge';
    browserVersion = ua.match(/edg\/([\d.]+)/i)?.[1] || '';
  }

  // --- OS ---
  if (/windows nt/i.test(ua)) {
    osName = 'Windows';
    osVersion = ua.match(/windows nt ([\d.]+)/i)?.[1].replace('10.0', '10') || '';
  } else if (/android/i.test(ua)) {
    osName = 'Android';
    osVersion = ua.match(/android ([\d.]+)/i)?.[1] || '';
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    osName = 'iOS';
    osVersion = ua.match(/os ([\d_]+)/i)?.[1].replace(/_/g, '.') || '';
  } else if (/mac os x/i.test(ua)) {
    osName = 'macOS';
    osVersion = ua.match(/mac os x ([\d_]+)/i)?.[1].replace(/_/g, '.') || '';
  } else if (/linux/i.test(ua)) {
    osName = 'Linux';
  }

  return {
    browser: {
      name: browserName,
      version: browserVersion,
      language: navigator.language,
      userAgent: ua,
    },
    os: { name: osName, version: osVersion },
  };
}
