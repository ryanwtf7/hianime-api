import { Hono } from 'hono';

const m3u8ProxyController = async (c) => {
    const url = c.req.query('url');

    if (!url) {
        return c.text('URL is required', 400);
    }

    try {
        console.log(`Request for: ${url.substring(0, 80)}...`);
        const redirectM3u8 = `#EXTM3U
#EXT-X-VERSION:3
#EXT-X-STREAM-INF:BANDWIDTH=1000000
${url}
`;

        // Add CORS headers
        c.header('Access-Control-Allow-Origin', '*');
        c.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        c.header('Access-Control-Allow-Headers', 'Range, Content-Type, Accept');
        c.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');
        c.header('Content-Type', 'application/vnd.apple.mpegurl');
        c.header('Cache-Control', 'no-cache');

        console.log(`Returning redirect to direct URL`);

        return c.text(redirectM3u8);

    } catch (error) {
        console.error(`Error: ${error.message}`);
        return c.text(`Proxy Error: ${error.message}`, 500);
    }
};

export default m3u8ProxyController;
