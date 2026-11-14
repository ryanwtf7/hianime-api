import config from './config';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 10000;
const AJAX_TIMEOUT = 15000;
const TOKEN_RE = /window\.AJAX_TOKEN\s*=\s*"([^"]+)"/;

const ua = (config.headers as Record<string, string>)?.['User-Agent'] || 'Mozilla/5.0';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withTimeout = (ms: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(id) };
};

export const animeNumId = (id: string): string => id.split('-').at(-1) || id;

/** HTML (or raw text) fetch against baseurl with retry. */
export const getHtml = async (
  endpoint: string,
  options: { headers?: Record<string, string>; retries?: number } = {}
) => {
  const { headers: customHeaders = {}, retries = MAX_RETRIES } = options;
  const url = config.baseurl + endpoint;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) await sleep(RETRY_DELAY * Math.pow(2, attempt - 1));

      const { signal, done } = withTimeout(TIMEOUT);
      const response = await fetch(url, {
        headers: {
          ...(config.headers || {}),
          ...customHeaders,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          Connection: 'keep-alive',
        },
        signal,
      });
      done();

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        await sleep(retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * 2);
        continue;
      }

      if (response.status >= 500 && response.status < 600) {
        throw new Error(`Server error: HTTP ${response.status}`);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.text();
      if (!data) throw new Error('Empty response received');
      return { success: true as const, data };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (lastError.name === 'AbortError') {
        lastError = new Error('Request timeout - the external API took too long to respond');
      }
      if (lastError.message.includes('HTTP 40') && !lastError.message.includes('429')) break;
      if (attempt === retries - 1) break;
    }
  }

  return { success: false as const, message: lastError?.message || 'Unknown error occurred' };
};

/** Token-protected JSON ajax (`/ajax/episodes`, `/ajax/server`, …). */
export const siteAjax = async <T>(ajaxPath: string, refererPath: string = '/home'): Promise<T> => {
  const page = withTimeout(AJAX_TIMEOUT);
  const pageRes = await fetch(`${config.baseurl}${refererPath}`, {
    headers: {
      'User-Agent': ua,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      Referer: `${config.baseurl}/home`,
    },
    signal: page.signal,
  });
  page.done();

  if (!pageRes.ok) throw new Error(`Session bootstrap failed: HTTP ${pageRes.status}`);

  const html = await pageRes.text();
  const token = html.match(TOKEN_RE)?.[1];
  if (!token) throw new Error('Session bootstrap failed: no page token found');

  const rawCookies =
    typeof (pageRes.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie ===
    'function'
      ? (pageRes.headers as Headers & { getSetCookie: () => string[] }).getSetCookie()
      : [];
  const cookie = rawCookies.map(c => c.split(';')[0].trim()).join('; ');

  const ajax = withTimeout(AJAX_TIMEOUT);
  const res = await fetch(`${config.baseurl}${ajaxPath}`, {
    headers: {
      'User-Agent': ua,
      Accept: 'application/json',
      Referer: `${config.baseurl}${refererPath}`,
      'X-Requested-With': 'XMLHttpRequest',
      'X-Page-Token': token,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    signal: ajax.signal,
  });
  ajax.done();

  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return (await res.json()) as T;
};

export type PlayerHosts = { flixera: string; cdn: string; zcdn: string };

let cachedHosts: PlayerHosts | null = null;

/** Scrape embed host constants from watch-page loadPlayer — no hardcoded CDN in config. */
export const getPlayerHosts = async (watchPath = '/watch/12?ep=1'): Promise<PlayerHosts> => {
  if (cachedHosts) return cachedHosts;
  const result = await getHtml(watchPath);
  if (!result.success)
    throw new Error(result.message || 'failed to load watch page for player hosts');
  const html = result.data;
  const cdn = html.match(/const\s+CDN\s*=\s*"([^"]+)"/)?.[1];
  const zcdn = html.match(/const\s+ZCDN\s*=\s*"([^"]+)"/)?.[1];
  const flixera = html.match(/https:\/\/flixera\.[a-z]+/)?.[0];
  if (!cdn || !zcdn || !flixera) {
    throw new Error('failed to scrape player hosts from watch page');
  }
  cachedHosts = { flixera, cdn, zcdn };
  return cachedHosts;
};

/** Test helper / override. */
export const setPlayerHosts = (hosts: PlayerHosts | null) => {
  cachedHosts = hosts;
};
