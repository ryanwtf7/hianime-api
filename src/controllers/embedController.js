import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const embedController = async (c) => {
    try {
        let { id, server, type } = c.req.param();

        if (!id) id = c.req.query('id');
        if (!server) server = c.req.query('server');
        if (!type) type = c.req.query('type');

        if (!id) return c.text('ID is required', 400);

        server = server ? server.toUpperCase() : 'HD-2';
        type = type || 'sub';

        const serverMapping = {
            'S-1': 'MEGACLOUD',
            'HD-2': 'MEGACLOUD'
        };

        const mappedServer = serverMapping[server] || server;
        const servers = await getServers(id);
        let selectedServer = null;

        if (server.startsWith('S-')) {
            const index = parseInt(server.replace('S-', ''));
            selectedServer = servers[type].find(el => el.index === index);
        }

        if (!selectedServer && mappedServer === 'MEGACLOUD') {
            selectedServer = servers[type].find(el => el.index === 1) || servers[type].find(el => el.index === 4);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find(el => el.name.toUpperCase() === mappedServer);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find(el => el.name.toUpperCase() === server);
        }

        if (!selectedServer) {
            selectedServer = servers[type].find((el) => el.name.toUpperCase().includes(mappedServer));
        }

        if (!selectedServer) return c.text(`Server ${server} not found`, 404);

        const stream = await extractStream({ selectedServer, id });

        if (!stream || !stream.link || !stream.link.file) {
            return c.text('Failed to extract stream', 500);
        }

        const m3u8Url = stream.link.file;
        const tracks = stream.tracks || [];
        const intro = stream.intro || {};
        const outro = stream.outro || {};

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>VidSrc</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.css" />
    <script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js/dist/hls.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { 
            width: 100%; 
            height: 100%; 
            background: #000; 
            overflow: hidden; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        #artplayer-container { 
            width: 100%; 
            height: 100%; 
        }
        
        .art-video-player .art-subtitle {
            bottom: 80px !important;
            font-size: 18px;
        }
        
        .art-video-player.art-fullscreen .art-subtitle {
            bottom: 100px !important;
            font-size: 24px;
        }
        
        .skip-button {
            position: absolute;
            bottom: 90px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #fff;
            padding: 10px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            z-index: 100;
            transition: all 0.2s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            pointer-events: auto;
        }
        
        .skip-button:hover {
            background: rgba(0, 0, 0, 0.95);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
        }
        
        .skip-button.hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="artplayer-container"></div>

    <script>
        const intro = ${JSON.stringify(intro || { start: 0, end: 0 })};
        const outro = ${JSON.stringify(outro || { start: 0, end: 0 })};
        const subtitles = ${JSON.stringify(tracks || [])};
        
        function playM3u8(video, url, art) {
            if (Hls.isSupported()) {
                if (art.hls) art.hls.destroy();
                const hls = new Hls({
                    maxBufferLength: 30,
                    maxMaxBufferLength: 60,
                    maxBufferSize: 60 * 1000 * 1000,
                    maxBufferHole: 0.5,
                    nudgeMaxRetry: 10,
                    enableWorker: true,
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                art.hls = hls;
                art.on('destroy', () => hls.destroy());
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else {
                art.notice.show = 'Unsupported playback format';
            }
        }

        const art = new Artplayer({
            container: '#artplayer-container',
            url: '${m3u8Url}',
            type: 'm3u8',
            customType: {
                m3u8: playM3u8,
            },
            autoplay: true,
            autoSize: true,
            autoMini: true,
            loop: false,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            setting: true,
            hotkey: true,
            pip: true,
            mutex: true,
            fullscreen: true,
            fullscreenWeb: true,
            subtitleOffset: true,
            miniProgressBar: true,
            playsInline: true,
            quality: [],
            whitelist: ['*'],
            moreVideoAttr: {
                crossOrigin: 'anonymous',
                preload: 'auto',
            },
            subtitle: {
                url: '',
                style: {
                    color: '#fff',
                    fontSize: '18px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: '4px 10px',
                    borderRadius: '4px',
                },
            },
            icons: {
                play: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>',
                pause: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>',
            },
            layers: [],
            controls: [],
        });

        if (subtitles.length > 0) {
            const subtitleSettings = subtitles.map((track, index) => {
                return {
                    html: track.label,
                    url: track.file,
                };
            });
            
            subtitleSettings.unshift({
                html: 'Off',
                url: '',
            });

            art.setting.add({
                width: 250,
                html: 'Subtitles',
                selector: subtitleSettings,
                onSelect: function (item) {
                    art.subtitle.url = item.url;
                    return item.html;
                },
            });
        }

        art.on('ready', () => {
            if (art.hls && art.hls.levels && art.hls.levels.length > 1) {
                const levels = art.hls.levels.map((level, index) => ({
                    html: level.height + 'p',
                    level: index,
                }));

                levels.unshift({
                    html: 'Auto',
                    level: -1,
                });

                art.setting.add({
                    width: 200,
                    html: 'Quality',
                    selector: levels,
                    onSelect: function (item) {
                        art.hls.currentLevel = item.level;
                        return item.html;
                    },
                });
            }
        });

        let skipIntroBtn = null;
        let skipOutroBtn = null;

        if (intro.end > 0) {
            skipIntroBtn = document.createElement('div');
            skipIntroBtn.className = 'skip-button hidden';
            skipIntroBtn.textContent = 'Skip Intro';
            skipIntroBtn.onclick = () => {
                art.currentTime = intro.end;
            };
            document.body.appendChild(skipIntroBtn);
        }

        if (outro.end > 0) {
            skipOutroBtn = document.createElement('div');
            skipOutroBtn.className = 'skip-button hidden';
            skipOutroBtn.textContent = 'Skip Outro';
            skipOutroBtn.style.bottom = intro.end > 0 ? '140px' : '90px';
            skipOutroBtn.onclick = () => {
                art.currentTime = outro.end;
            };
            document.body.appendChild(skipOutroBtn);
        }

        art.on('video:timeupdate', () => {
            const currentTime = art.currentTime;

            if (skipIntroBtn) {
                if (currentTime >= intro.start && currentTime < intro.end) {
                    skipIntroBtn.classList.remove('hidden');
                } else {
                    skipIntroBtn.classList.add('hidden');
                }
            }

            if (skipOutroBtn) {
                if (currentTime >= outro.start && currentTime < outro.end) {
                    skipOutroBtn.classList.remove('hidden');
                } else {
                    skipOutroBtn.classList.add('hidden');
                }
            }
        });

        window.addEventListener('beforeunload', () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        });
    </script>
</body>
</html>
        `;

        return c.html(html);

    } catch (error) {
        console.error("Embed Error:", error.message);
        return c.text('Internal Server Error', 500);
    }
};

export default embedController;
