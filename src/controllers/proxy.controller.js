import { Hono } from 'hono';

const proxyController = async (c) => {
    const url = c.req.query('url');
    const referer = c.req.query('referer');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        const rangeHeader = c.req.header('range');
        const fetchHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': referer || 'https://megacloud.tv',
            'Origin': referer || 'https://megacloud.tv',
            'Accept': '*/*',
        };

        if (rangeHeader) {
            fetchHeaders['Range'] = rangeHeader;
        }

        const response = await fetch(url, {
            headers: fetchHeaders,
        });

        if (!response.ok) {
            console.error(`Upstream error for ${url}: ${response.status}`);
            return c.text(`Upstream error: ${response.status}`, response.status);
        }

        const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';

        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept, Accept-Encoding');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges, Cache-Control');
        c.header('Content-Type', contentType);

        const contentLength = response.headers.get('content-length');
        if (contentLength) {
            c.header('Content-Length', contentLength);
        }

        const contentRange = response.headers.get('content-range');
        if (contentRange) {
            c.header('Content-Range', contentRange);
        }

        const acceptRanges = response.headers.get('accept-ranges');
        if (acceptRanges) {
            c.header('Accept-Ranges', acceptRanges);
        } else {
            c.header('Accept-Ranges', 'bytes');
        }

        if (url.endsWith('.ts') || url.endsWith('.m4s')) {
            c.header('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (url.endsWith('.m3u8')) {
            c.header('Cache-Control', 'no-cache');
        }

        if (contentType.includes('mpegurl') || url.endsWith('.m3u8')) {
            const content = await response.text();

            const basePath = url.substring(0, url.lastIndexOf('/') + 1);
            const lines = content.split('\n');
            const newLines = lines.map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line;

                let targetUrl = line;
                if (!line.startsWith('http')) {
                    targetUrl = basePath + line;
                }

                const encodedUrl = encodeURIComponent(targetUrl);
                const encodedReferer = encodeURIComponent(referer || 'https://megacloud.tv');

                const proxyPath = c.req.path;

                return `${proxyPath}?url=${encodedUrl}&referer=${encodedReferer}`;
            });

            const newContent = newLines.join('\n');
            return c.text(newContent);
        }

        if (response.status === 206 || contentRange) {
            c.status(206);
        }
        
        return c.body(response.body);

    } catch (error) {
        console.error(`Proxy Error for ${url}:`, error.message);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default proxyController;
