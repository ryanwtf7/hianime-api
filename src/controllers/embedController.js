import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { BsGearFill, BsCheckLg, BsChevronLeft, BsAspectRatio, BsSpeedometer2, BsCollectionPlay, BsBadgeCc, BsPip } from 'react-icons/bs';
import { AiOutlineRollback } from "react-icons/ai";
import { FaPlay, FaPause } from "react-icons/fa6";
import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const embedController = async (c) => {
    try {
        let { id, server, type } = c.req.param();

        const renderIcon = (IconComponent, props = {}) => {
            return ReactDOMServer.renderToStaticMarkup(React.createElement(IconComponent, props));
        };

        const icons = {
            back: renderIcon(AiOutlineRollback),
            check: renderIcon(BsCheckLg),
            chevron: renderIcon(BsChevronLeft, { style: { transform: 'rotate(180deg)' } }),
            gear: renderIcon(BsGearFill),
            speed: renderIcon(BsSpeedometer2),
            ratio: renderIcon(BsAspectRatio),
            cc: renderIcon(BsBadgeCc),
            pip: renderIcon(BsPip),
            rollback: renderIcon(AiOutlineRollback, { style: { width: '24px', height: '24px' } }),
            rollbackFlipped: renderIcon(AiOutlineRollback, { style: { width: '24px', height: '24px', transform: 'scaleX(-1)' } }),
            play: renderIcon(FaPlay),
            pause: renderIcon(FaPause)
        };

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
        const episodeType = type || 'sub';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>VidSrc</title>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/+esm"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/media-chrome/menu/+esm"></script>
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        
        media-controller {
            width: 100%; height: 100%; display: block; font-size: 14px;
            font-family: inherit;
            --media-font-family: inherit;
            -webkit-font-smoothing: antialiased;
            --media-secondary-color: transparent;
            --media-menu-background: rgba(20, 20, 20, 0.85);
            --media-control-hover-background: transparent;
            --media-control-background: transparent;
            --media-range-track-height: 6px;
            --media-range-thumb-height: 14px;
            --media-range-thumb-width: 14px;
            --media-range-thumb-border-radius: 14px;
            --media-preview-thumbnail-border: 2px solid #fff;
            --media-preview-thumbnail-border-radius: 4px;
            --media-tooltip-display: none;
        }

        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.5);
            z-index: 100;
            pointer-events: none;
        }
        .loading-overlay.visible {
            display: flex;
        }
        
        .loading-overlay.visible ~ .mobile-centered-controls {
            display: none !important;
        }
        .spinner_l9ve {
            animation: spinner_rcyq 1.2s cubic-bezier(0.52, .6, .25, .99) infinite;
        }
        .spinner_cMYp {
            animation-delay: .4s;
        }
        .spinner_gHR3 {
            animation-delay: .8s;
        }
        @keyframes spinner_rcyq {
            0% {
                transform: translate(12px, 12px) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(0, 0) scale(1);
                opacity: 0;
            }
        }

        .skip-button {
            background: rgba(0, 0, 0, 0.8); 
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #fff; padding: 10px 24px; border-radius: 6px; cursor: pointer;
            font-weight: 600; font-size: 14px; display: none; align-items: center;
            gap: 10px; pointer-events: auto; margin-bottom: 12px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .skip-container {
             position: absolute; bottom: 90px; right: 24px; display: flex;
             flex-direction: column; align-items: flex-end; z-index: 20; pointer-events: none;
        }

        .skip-button.visible { display: flex; }
        .skip-button:hover { 
            background: rgba(0, 0, 0, 0.95); 
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }

        video { 
            width: 100%; 
            height: 100%; 
            object-fit: contain;
            transition: object-fit 0.3s ease;
        }
        
        video.object-cover { object-fit: cover; }
        video.object-contain { object-fit: contain; }

        video::cue {
            background-color: rgba(0, 0, 0, 0.8);
            color: #ffffff;
            font-size: 16px;
            font-family: 'Inter', system-ui, sans-serif;
            font-weight: 500;
            line-height: 1.4;
            padding: 4px 10px;
            border-radius: 4px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        }
        
        [mediaisfullscreen] video::cue {
            font-size: 22px;
            padding: 6px 14px;
        }

        video::-webkit-media-text-track-container {
            bottom: 60px !important;
            transform: translateY(20px); 
        }
        
        [mediaisfullscreen] video::-webkit-media-text-track-container {
            bottom: 90px !important;
        }
        
        media-controller::part(captions) {
            display: none !important;
        }

        media-controller[mediaisfullscreen] {
          --media-range-thumb-height: 16px;
          --media-range-thumb-width: 16px; 
          --media-range-track-height: 8px;
        }
    
        .yt-button {
          position: relative; display: inline-flex; width: 40px; justify-content: center; align-items: center;
          height: 100%; opacity: 0.9; transition: opacity 0.2s ease;
          border-radius: 0;
          background: none !important;
        }
        .yt-button:hover { 
            opacity: 1; 
            background: none !important;
        }
        .yt-button:active {
            background: none !important;
        }
        [breakpointmd] .yt-button { width: 44px; }
        
        .yt-button svg { height: 24px; width: 24px; fill: var(--media-primary-color, #fff); }
        /* Comprehensive border/outline removal */
        * { outline: none !important; }
        button, button *, svg, svg * { outline: none !important; border: none !important; box-shadow: none !important; }
        media-controller *, [class*="button"] *, [class*="control"] * { outline: none !important; border: none !important; box-shadow: none !important; }
        .yt-button svg, media-play-button svg, media-mute-button svg, media-pip-button svg, media-fullscreen-button svg, media-seek-backward-button svg, media-seek-forward-button svg { outline: none !important; border: none !important; box-shadow: none !important; }
        media-play-button, media-mute-button, media-pip-button, media-fullscreen-button, media-seek-backward-button, media-seek-forward-button { outline: none !important; border: none !important; box-shadow: none !important; }
        media-play-button:focus, media-mute-button:focus, media-pip-button:focus, media-fullscreen-button:focus, media-seek-backward-button:focus, media-seek-forward-button:focus { outline: none !important; border: none !important; box-shadow: none !important; }
        /* Super aggressive focus/active/click state removal */
        *:focus, *:active, *:focus-visible, *:focus-within { outline: none !important; border: none !important; box-shadow: none !important; }
        button:focus, button:active, button:focus-visible { outline: none !important; border: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent !important; }
        media-controller *:focus, media-controller *:active { outline: none !important; border: none !important; box-shadow: none !important; }
        [class*="button"]:focus, [class*="button"]:active { outline: none !important; border: none !important; box-shadow: none !important; }
        media-play-button:focus, media-play-button:active, media-mute-button:focus, media-mute-button:active,
        media-pip-button:focus, media-pip-button:active, media-fullscreen-button:focus, media-fullscreen-button:active,
        media-seek-backward-button:focus, media-seek-backward-button:active, media-seek-forward-button:focus, media-seek-forward-button:active {
            outline: 0 !important; border: 0 !important; box-shadow: none !important;
        }
        .yt-button:focus, .yt-button:active, .yt-button:focus-visible { outline: 0 !important; border: 0 !important; box-shadow: none !important; }
        /* Strip ALL default button styling - nuclear option */
        button, [role="button"], input[type="button"] {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
        }
        
        /* Remove ALL possible borders and outlines from media-chrome shadow DOM */
        media-controller::part(button) { outline: none !important; border: none !important; box-shadow: none !important; }
        media-play-button::part(button), media-mute-button::part(button), 
        media-seek-backward-button::part(button), media-seek-forward-button::part(button),
        media-pip-button::part(button), media-fullscreen-button::part(button) {
            outline: 0 !important; border: 0 !important; box-shadow: none !important;
        }



        
        .yt-gradient-bottom {
            padding-top: 37px; position: absolute; width: 100%; height: 180px;
            bottom: 0; pointer-events: none; 
            background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
            z-index: 10;
        }

        media-settings-menu {
            display: none; 
        }
        
        .progress-highlights {
            position: absolute;
            bottom: 60px;
            left: 0;
            width: 100%;
            height: 4px;
            z-index: 15;
            pointer-events: none;
        }
        [breakpointmd] .progress-highlights { bottom: 70px; }
        [mediaisfullscreen] .progress-highlights { bottom: 74px; height: 6px; }

        media-time-range {
            position: absolute; bottom: 60px; left: 0; right: 0; width: 100%; height: 4px; z-index: 30;
            overflow: visible !important;
            --media-range-track-background: rgba(255, 255, 255, 0.2);
            --media-range-track-pointer-background: rgba(255, 255, 255, 0.35);
            --media-time-range-buffered-color: rgba(255, 255, 255, 0.3);
            --media-range-bar-color: #e50914;
            --media-range-thumb-border-radius: 13px;
            --media-range-thumb-background: #e50914;
            --media-range-thumb-transform: scale(0);
            transition: height 0.1s ease;
        }
        media-time-range:hover {
            height: 8px; --media-range-thumb-transform: scale(1);
        }
        [breakpointmd] media-time-range { bottom: 70px; }
        [mediaisfullscreen] media-time-range { bottom: 74px; height: 8px; }
        [mediaisfullscreen] media-time-range:hover { height: 10px; }

        .progress-highlights .intro-highlight, 
        .progress-highlights .outro-highlight {
            position: absolute !important;
            height: 100% !important;
            top: 0 !important;
            background-color: rgba(255, 193, 7, 0.85) !important;
            pointer-events: none !important;
            z-index: 16;
        }
        
        media-control-bar {
            position: absolute; height: 48px; display: flex; align-items: center;
            bottom: 0; left: 0; right: 0; z-index: 30; padding: 0 16px;
        }
        [breakpointmd] media-control-bar { height: 56px; }
        
        media-play-button { display: none; }

        media-mute-button {
            padding: 0 8px;
        }
        
        media-volume-range { height: 4px; border-radius: 2px; --media-range-track-background: rgba(255, 255, 255, 0.2); }
        media-mute-button + media-volume-range { width: 0; overflow: hidden; transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1); margin-left: 0; }
        media-mute-button:hover + media-volume-range, media-mute-button:focus + media-volume-range,
        media-mute-button:focus-within + media-volume-range, media-volume-range:hover,
        media-volume-range:focus, media-volume-range:focus-within { width: 100px; margin-left: 8px; }

        media-time-display { 
            padding: 0 12px; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; 
            color: rgba(255,255,255,0.9);
        }
        .control-spacer { flex-grow: 1; }

        

        media-settings-menu-button svg { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        media-settings-menu-button[aria-expanded='true'] svg { transform: rotate(90deg); }

        .mobile-centered-controls {
            display: flex; align-self: stretch; align-items: center; flex-flow: row nowrap;
            justify-content: center; margin: 0 auto; width: 100%; height: 100%; 
            pointer-events: none;
        }
        .mobile-centered-controls > * { pointer-events: auto; }
        
        .mobile-centered-controls media-play-button { 
            display: flex;
            width: 140px;
            height: 140px;
            background: transparent !important;
            border-radius: 50%;
            transition: opacity 0.2s ease;
            --media-button-icon-width: 100px;
            border: none !important;
            opacity: 0.9;
        }
        .mobile-centered-controls media-play-button:hover {
            background: transparent !important;
            transform: none;
            border: none !important;
            opacity: 1;
        }
        .mobile-centered-controls media-play-button:active {
            background: transparent !important;
            transform: none;
            border: none !important;
        }
        
        @media (max-width: 768px) {
            .mobile-centered-controls media-play-button { 
                width: 80px; 
                height: 100px;
                --media-button-icon-width: 80px;
            }
            
            .skip-container {
                bottom: 75px;
                right: 16px;
            }
            
            .skip-button {
                padding: 8px 18px;
                font-size: 12px;
            }
        }

        .custom-menu {
            display: none; position: absolute; right: 20px; bottom: 70px;
            background: rgba(0, 0, 0, 0.95);
            border-radius: 8px;
            width: 280px; 
            max-height: 400px; 
            overflow: hidden;
            z-index: 100; 
            box-shadow: 
                0 0 0 1px rgba(255, 255, 255, 0.1),
                0 8px 24px rgba(0, 0, 0, 0.6);
            font-family: 'Inter', sans-serif;
            transform-origin: bottom right;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            transform: scale(0.95) translateY(10px);
            pointer-events: none;
        }
        
        .custom-menu.active { 
            display: block; 
            opacity: 1; 
            transform: scale(1) translateY(0);
            pointer-events: auto;
        }

        .menu-scroll-container {
            max-height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        .menu-scroll-container::-webkit-scrollbar { width: 4px; }
        .menu-scroll-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

        .menu-header {
            padding: 14px 16px; 
            font-weight: 600; 
            font-size: 14px;
            color: #fff;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex; align-items: center; gap: 12px; 
            background: rgba(255, 255, 255, 0.03);
            position: sticky; top: 0; z-index: 10;
        }
        .menu-header.clickable { cursor: pointer; }
        .menu-header.clickable:hover { background: rgba(255, 255, 255, 0.08); }
        .back-icon { font-size: 14px; opacity: 0.7; }
        
        .menu-item {
            padding: 12px 16px; 
            cursor: pointer; 
            font-size: 14px;
            display: flex; align-items: center; 
            justify-content: space-between;
            color: #e5e5e5;
            transition: all 0.2s ease;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
        }
        .menu-item:last-child { border-bottom: none; }
        
        .menu-item:hover { 
            background: rgba(255, 255, 255, 0.1); 
            color: #fff; 
            padding-left: 20px;
        }
        
        .item-left { display: flex; align-items: center; gap: 12px; }
        .item-icon { 
            display: flex; align-items: center; justify-content: center;
            width: 20px; height: 20px; opacity: 0.8;
            font-size: 18px;
        }
        
        .item-right { display: flex; align-items: center; gap: 8px; }
        .item-value { 
            font-size: 13px; color: rgba(255, 255, 255, 0.5); 
            font-weight: 400; 
            max-width: 100px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .item-chevron { font-size: 12px; opacity: 0.4; }

        .sub-menu-item {
            padding: 12px 16px 12px 48px;
            position: relative;
        }
        .sub-menu-item .checkmark {
            position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
            color: #e50914;
            opacity: 0; 
            font-size: 16px;
            transition: all 0.2s ease;
        }
        .sub-menu-item.active { 
            background: rgba(229, 9, 20, 0.15); 
            color: #fff; font-weight: 500;
        }
        .sub-menu-item.active .checkmark { opacity: 1; }
        .sub-menu-item:hover { background: rgba(255,255,255,0.1); }
        
        @media (max-width: 768px) {
            .custom-menu {
                right: 10px;
                bottom: 60px;
                width: calc(100vw - 20px);
                max-width: 320px;
            }
        }
    </style>
</head>
<body>
      <media-controller breakpoints="md:480" gesturesdisabled defaultstreamtype="on-demand">
        <video slot="media" id="video-player" crossorigin="anonymous" playsinline autoplay></video>
        
        <div id="loading-overlay" class="loading-overlay visible">
          <svg width="80" height="80" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="spinner_l9ve" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)" fill="#fff"/>
            <path class="spinner_l9ve spinner_cMYp" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)" fill="#fff"/>
            <path class="spinner_l9ve spinner_gHR3" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z" transform="translate(12, 12) scale(0)" fill="#fff"/>
          </svg>
        </div>
        
        <div class="yt-gradient-bottom"></div>

        <div class="skip-container" slot="centered-chrome">
            <div id="skip-intro" class="skip-button">
                Skip Intro
            </div>
            <div id="skip-outro" class="skip-button">
                Skip Outro
            </div>
        </div>

        <div id="custom-settings-menu" class="custom-menu"></div>

        <div id="progress-highlights" class="progress-highlights"></div>

        <media-time-range id="time-range">
          <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
          <media-preview-time-display slot="preview"></media-preview-time-display>
        </media-time-range>

        <media-control-bar>
          <media-mute-button class="yt-button">
            <svg slot="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="#fff"/>
                <path id="volume-wave" d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" fill="#fff"/>
            </svg>
          </media-mute-button>
          <media-volume-range></media-volume-range>

          <media-time-display showduration></media-time-display>
          <span class="control-spacer"></span>

          <media-seek-backward-button seek-offset="10" class="yt-button">
            ${icons.rollback}
          </media-seek-backward-button>
          
          <media-seek-forward-button seek-offset="10" class="yt-button">
            ${icons.rollbackFlipped}
          </media-seek-forward-button>

          <button id="settings-btn" class="yt-button" style="background: none; border: none; cursor: pointer;">
            ${icons.gear}
          </button>

          <media-pip-button class="yt-button">
            ${icons.pip}
          </media-pip-button>

          <media-fullscreen-button class="yt-button">
            <svg slot="enter" viewBox="0 0 36 36">
              <path d="M10 14V10H14M22 10H26V14M26 22V26H22M14 26H10V22" stroke="#fff" stroke-width="2" fill="none"/>
            </svg>
            <svg slot="exit" viewBox="0 0 36 36">
               <path d="M14 10V14H10M22 14H26V10M26 22V26H22M10 22H14V26" stroke="#fff" stroke-width="2" fill="none"/>
            </svg>
          </media-fullscreen-button>
        </media-control-bar>

        <div class="mobile-centered-controls" slot="centered-chrome">
          <media-play-button>
            <svg slot="play" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              ${icons.play}
            </svg>
            <svg slot="pause" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              ${icons.pause}
            </svg>
          </media-play-button>
        </div>
      </media-controller>

    <script>
        const SVGs = ${JSON.stringify(icons)};
        const intro = ${JSON.stringify(intro || { start: 0, end: 0 })};
        const outro = ${JSON.stringify(outro || { start: 0, end: 0 })};
        const episodeType = '${episodeType}';
        const subtitles = ${JSON.stringify(tracks || [])};
        
        const video = document.getElementById('video-player');
        const settingsBtn = document.getElementById('settings-btn');
        const settingsMenu = document.getElementById('custom-settings-menu');
        const skipIntroBtn = document.getElementById('skip-intro');
        const skipOutroBtn = document.getElementById('skip-outro');
        const loadingOverlay = document.getElementById('loading-overlay');

        let hls = null;
        let currentQuality = -1;
        let currentSpeed = 1;
        let currentSubtitle = null;
        let subtitlesLoaded = false;

        function showLoading() {
            if (loadingOverlay) {
                loadingOverlay.classList.add('visible');
                const playButtons = document.querySelectorAll('media-play-button');
                const seekButtons = document.querySelectorAll('media-seek-backward-button, media-seek-forward-button');
                playButtons.forEach(btn => btn.style.visibility = 'hidden');
                seekButtons.forEach(btn => btn.style.visibility = 'hidden');
            }
        }

        function hideLoading() {
            if (loadingOverlay) {
                loadingOverlay.classList.remove('visible');
                const playButtons = document.querySelectorAll('media-play-button');
                const seekButtons = document.querySelectorAll('media-seek-backward-button, media-seek-forward-button');
                playButtons.forEach(btn => btn.style.visibility = 'visible');
                seekButtons.forEach(btn => btn.style.visibility = 'visible');
            }
        }

        if (Hls.isSupported()) {
            hls = new Hls({
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                highBufferWatchdogPeriod: 2,
                nudgeMaxRetry: 10,
                fragLoadingTimeOut: 30000,
                manifestLoadingTimeOut: 30000,
                levelLoadingTimeOut: 30000,
                startLevel: -1,
                abrEwmaDefaultEstimate: 500000,
                renderTextTracksNatively: false,
                enableWorker: true
            });
            
            hls.loadSource('${m3u8Url}');
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS Error:", data);
                if (data.fatal) {
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            hideLoading();
                            break;
                    }
                }
            });

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                loadSubtitles();
            });

            hls.on(Hls.Events.FRAG_LOADING, () => {
                if (video.paused && video.readyState < 3) {
                    showLoading();
                }
            });

            hls.on(Hls.Events.FRAG_LOADED, () => {
                if (video.readyState >= 3) {
                    hideLoading();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = '${m3u8Url}';
            video.addEventListener('loadedmetadata', loadSubtitles);
        }

        video.addEventListener('waiting', showLoading);
        video.addEventListener('seeking', showLoading);
        video.addEventListener('loadstart', showLoading);
        video.addEventListener('canplay', hideLoading);
        video.addEventListener('playing', hideLoading);
        video.addEventListener('seeked', hideLoading);

        function enforceSubtitleState() {
            if (video.textTracks && video.textTracks.length > 0) {
                let showingCount = 0;
                Array.from(video.textTracks).forEach((track, i) => {
                    if (track.mode === 'showing') {
                        showingCount++;
                        if (i !== currentSubtitle) {
                            track.mode = 'disabled';
                        }
                    }
                });
                
                if (showingCount > 1) {
                    Array.from(video.textTracks).forEach((track, i) => {
                        track.mode = i === currentSubtitle ? 'showing' : 'disabled';
                    });
                }
            }
        }
        
        setInterval(enforceSubtitleState, 500);

        function loadSubtitles() {
            if (subtitlesLoaded) {
                return;
            }
            
            if (subtitles.length === 0) {
                subtitlesLoaded = true;
                updateCaptionButtonState(false);
                return;
            }
            
            const existingTracks = video.querySelectorAll('track');
            existingTracks.forEach(track => track.remove());
            
            if (video.textTracks && video.textTracks.length > 0) {
                Array.from(video.textTracks).forEach(track => {
                    track.mode = 'disabled';
                });
            }
            
            subtitles.forEach((track, index) => {
                const trackEl = document.createElement('track');
                trackEl.kind = 'subtitles';
                trackEl.label = track.label;
                trackEl.srclang = 'en';
                trackEl.src = track.file;
                video.appendChild(trackEl);
            });
            
            setTimeout(() => {
                Array.from(video.textTracks).forEach((track, i) => {
                    track.mode = 'disabled';
                });
                currentSubtitle = null;
                updateCaptionButtonState(false);
            }, 100);
            
            subtitlesLoaded = true;
        }

        function addProgressBarHighlights() {
            const highlightsContainer = document.getElementById('progress-highlights');
            if (!highlightsContainer || !video.duration) return;

            highlightsContainer.innerHTML = '';
            const duration = video.duration;

            if (intro.end > 0) {
                const start = Math.max(0, intro.start);
                const end = Math.min(intro.end, duration);
                
                if (start < end) {
                    const introDiv = document.createElement('div');
                    introDiv.className = 'intro-highlight';
                    const startPercent = (start / duration) * 100;
                    const widthPercent = ((end - start) / duration) * 100;
                    introDiv.style.left = startPercent + '%';
                    introDiv.style.width = widthPercent + '%';
                    highlightsContainer.appendChild(introDiv);
                }
            }

            if (outro.end > 0) {
                const start = Math.max(0, outro.start);
                const end = Math.min(outro.end, duration);
                
                if (start < end) {
                    const outroDiv = document.createElement('div');
                    outroDiv.className = 'outro-highlight';
                    const startPercent = (start / duration) * 100;
                    const widthPercent = ((end - start) / duration) * 100;
                    outroDiv.style.left = startPercent + '%';
                    outroDiv.style.width = widthPercent + '%';
                    highlightsContainer.appendChild(outroDiv);
                }
            }
        }

        video.addEventListener('loadedmetadata', addProgressBarHighlights);
        video.addEventListener('durationchange', addProgressBarHighlights);

        let menuState = 'main';
        let currentAspectRatio = 'contain';
        
        function getAspectRatioLabel() {
            return currentAspectRatio === 'contain' ? 'Original' : 'Zoom to Fill';
        }

        function setAspectRatio(ratio) {
            currentAspectRatio = ratio;
            video.classList.remove('object-contain', 'object-cover');
            video.classList.add('object-' + ratio);
            if (menuState === 'main') showMainMenu();
            if (menuState === 'ratio') showAspectRatioMenu();
        }

        function renderMenuHeader(title, backAction = null) {
            let html = '<div class="menu-header' + (backAction ? ' clickable' : '') + '" ' + (backAction ? 'data-action="' + backAction + '"' : '') + '>';
            if (backAction) {
                html += '<span class="back-icon">' + SVGs.back + '</span>';
            }
            html += '<span>' + title + '</span>';
            html += '</div>';
            return html;
        }

        function renderMenuItem(iconString, label, value = '', action) {
            return '<div class="menu-item" data-action="' + action + '">' +
                    '<div class="item-left">' +
                        '<span class="item-icon">' + iconString + '</span>' +
                        '<span>' + label + '</span>' +
                    '</div>' +
                    '<div class="item-right">' +
                        '<span class="item-value">' + value + '</span>' +
                        '<span class="item-chevron">' + SVGs.chevron + '</span>' +
                    '</div>' +
                '</div>';
        }
        
        function renderSubMenuItem(label, isActive, actionValue) {
            return '<div class="menu-item sub-menu-item' + (isActive ? ' active' : '') + '" data-value="' + actionValue + '">' +
                    '<span class="checkmark">' + SVGs.check + '</span>' +
                    '<span>' + label + '</span>' +
                '</div>';
        }

        function showMainMenu() {
            menuState = 'main';
            const qualityLabel = currentQuality === -1 ? 'Auto' : (hls?.levels?.[currentQuality]?.height ? hls.levels[currentQuality].height + 'p' : 'Auto');
            const speedLabel = currentSpeed + 'x';
            const subLabel = subtitles.length === 0 ? 'None' : (currentSubtitle !== null ? subtitles[currentSubtitle]?.label : 'Off');
            const ratioLabel = getAspectRatioLabel();
            
            let html = '<div class="menu-scroll-container">';
            html += renderMenuHeader('Settings');
            html += '<div class="menu-content">';
            html += renderMenuItem(SVGs.gear, 'Quality', qualityLabel, 'quality');
            html += renderMenuItem(SVGs.speed, 'Playback Speed', speedLabel, 'speed');
            html += renderMenuItem(SVGs.ratio, 'Adaptive Ratio', ratioLabel, 'ratio');
            html += renderMenuItem(SVGs.cc, 'Subtitles', subLabel, 'subtitle');
            html += '</div></div>';
            
            settingsMenu.innerHTML = html;
            
            settingsMenu.querySelectorAll('.menu-item').forEach(item => {
                const action = item.getAttribute('data-action');
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (action === 'quality') showQualityMenu();
                    else if (action === 'speed') showSpeedMenu();
                    else if (action === 'ratio') showAspectRatioMenu();
                    else if (action === 'subtitle') showSubtitleMenu();
                });
            });
        }

        function showQualityMenu() {
            menuState = 'quality';
            if (!hls) return;
            
            let html = '<div class="menu-scroll-container">';
            html += renderMenuHeader('Quality', 'back');
            html += '<div class="menu-content">';
            html += renderSubMenuItem('Auto', currentQuality === -1, '-1');
            
            const levels = hls.levels.map((l, i) => ({ ...l, originalIndex: i })).sort((a, b) => b.height - a.height);
            
            levels.forEach((level) => {
                html += renderSubMenuItem(level.height + 'p', currentQuality === level.originalIndex, level.originalIndex);
            });
            
            html += '</div></div>';
            settingsMenu.innerHTML = html;
            settingsMenu.querySelector('.menu-header').addEventListener('click', () => showMainMenu());
            
            settingsMenu.querySelectorAll('.sub-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const level = parseInt(item.getAttribute('data-value'));
                    setQuality(level);
                    showMainMenu();
                });
            });
        }

        function showSpeedMenu() {
            menuState = 'speed';
            const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
            
            let html = '<div class="menu-scroll-container">';
            html += renderMenuHeader('Playback Speed', 'back');
            html += '<div class="menu-content">';
            
            speeds.forEach(speed => {
                html += renderSubMenuItem(speed === 1 ? 'Normal' : speed + 'x', currentSpeed === speed, speed);
            });
            
            html += '</div></div>';
            settingsMenu.innerHTML = html;
            settingsMenu.querySelector('.menu-header').addEventListener('click', () => showMainMenu());
            
            settingsMenu.querySelectorAll('.sub-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const speed = parseFloat(item.getAttribute('data-value'));
                    setSpeed(speed);
                    showMainMenu();
                });
            });
        }

        function showAspectRatioMenu() {
            menuState = 'ratio';
            
            let html = '<div class="menu-scroll-container">';
            html += renderMenuHeader('Adaptive Ratio', 'back');
            html += '<div class="menu-content">';
            html += renderSubMenuItem('Original (Contain)', currentAspectRatio === 'contain', 'contain');
            html += renderSubMenuItem('Zoom to Fill (Cover)', currentAspectRatio === 'cover', 'cover');
            html += '</div></div>';
            
            settingsMenu.innerHTML = html;
            settingsMenu.querySelector('.menu-header').addEventListener('click', () => showMainMenu());
            
            settingsMenu.querySelectorAll('.sub-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const ratio = item.getAttribute('data-value');
                    setAspectRatio(ratio);
                    showMainMenu();
                });
            });
        }

        function showSubtitleMenu() {
            menuState = 'subtitle';
            
            let html = '<div class="menu-scroll-container">';
            html += renderMenuHeader('Subtitles', 'back');
            html += '<div class="menu-content">';
            html += renderSubMenuItem('Off', currentSubtitle === null, 'off');
            
            subtitles.forEach((track, index) => {
                html += renderSubMenuItem(track.label, currentSubtitle === index, index);
            });
            
            html += '</div></div>';
            settingsMenu.innerHTML = html;
            settingsMenu.querySelector('.menu-header').addEventListener('click', () => showMainMenu());
            
            settingsMenu.querySelectorAll('.sub-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let value = item.getAttribute('data-value');
                    if (value !== 'off') value = parseInt(value);
                    else value = null;
                    setSubtitle(value);
                    showMainMenu();
                });
            });
        }

        function setQuality(level) {
            currentQuality = level;
            if (hls) {
                hls.currentLevel = level;
            }
            showMainMenu();
        }

        function setSpeed(speed) {
            currentSpeed = speed;
            video.playbackRate = speed;
            showMainMenu();
        }

        function setSubtitle(index) {
            currentSubtitle = index;
            Array.from(video.textTracks).forEach((track, i) => {
                track.mode = i === index ? 'showing' : 'disabled';
            });
            updateCaptionButtonState(index !== null);
            showMainMenu();
        }

        function updateCaptionButtonState(isActive) {
        }

        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (settingsMenu.classList.contains('active')) {
                settingsMenu.classList.remove('active');
            } else {
                showMainMenu();
                settingsMenu.classList.add('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && e.target !== settingsBtn && !settingsBtn.contains(e.target)) {
                settingsMenu.classList.remove('active');
            }
        });

        function updateSeekButtonLabels() {
            const seekBackward = document.querySelector('media-seek-backward-button');
            const seekForward = document.querySelector('media-seek-forward-button');
            
            const icon10Backward = '<svg viewBox="0 0 36 36" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;"><path d="M18 7C14.13 7 11 10.13 11 14h3l-4 4-4-4h3c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10v-2c4.42 0 8-3.58 8-8s-3.58-8-8-8z" fill="white"/><text x="18" y="22" font-size="10" fill="white" font-weight="bold" text-anchor="middle">10</text></svg>';
            const icon10Forward = '<svg viewBox="0 0 36 36" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg" style="pointer-events: none;"><path d="M18 7C21.87 7 25 10.13 25 14h-3l4 4 4-4h-3c0-5.52-4.48-10-10-10S8 8.48 8 14s4.48 10 10 10v-2c-4.42 0-8-3.58-8-8s3.58-8 8-8z" fill="white"/><text x="18" y="22" font-size="10" fill="white" font-weight="bold" text-anchor="middle">10</text></svg>';
            
            if (seekBackward) {
                // Force seek offset to 10
                seekBackward.setAttribute('seek-offset', '10');
                seekBackward.seekOffset = 10;
                seekBackward.innerHTML = icon10Backward;
                seekBackward.style.cssText = 'outline: none !important; border: none !important; box-shadow: none !important;';
                try {
                    if (seekBackward.shadowRoot) {
                        const allElements = seekBackward.shadowRoot.querySelectorAll('*');
                        allElements.forEach(el => {
                            el.style.cssText = 'outline: none !important; border: none !important; box-shadow: none !important;';
                            if (el.textContent && el.textContent.includes('30')) el.textContent = el.textContent.replace('30', '10');
                        });
                    }
                } catch (e) {}
            }
            
            if (seekForward) {
                // Force seek offset to 10
                seekForward.setAttribute('seek-offset', '10');
                seekForward.seekOffset = 10;
                seekForward.innerHTML = icon10Forward;
                seekForward.style.cssText = 'outline: none !important; border: none !important; box-shadow: none !important;';
                try {
                    if (seekForward.shadowRoot) {
                        const allElements = seekForward.shadowRoot.querySelectorAll('*');
                        allElements.forEach(el => {
                            el.style.cssText = 'outline: none !important; border: none !important; box-shadow: none !important;';
                            if (el.textContent && el.textContent.includes('30')) el.textContent = el.textContent.replace('30', '10');
                        });
                    }
                } catch (e) {}
            }
        }
        
        setTimeout(updateSeekButtonLabels, 500);
        setTimeout(updateSeekButtonLabels, 1000);
        setTimeout(updateSeekButtonLabels, 2000);

        video.addEventListener('timeupdate', () => {
            const t = video.currentTime;
            
            if (intro.end > 0 && t >= intro.start && t < intro.end) {
                skipIntroBtn.classList.add('visible');
                skipIntroBtn.onclick = () => video.currentTime = intro.end;
            } else {
                skipIntroBtn.classList.remove('visible');
            }

            if (outro.end > 0 && t >= outro.start && t < outro.end) {
                skipOutroBtn.classList.add('visible');
                skipOutroBtn.onclick = () => video.currentTime = outro.end;
            } else {
                skipOutroBtn.classList.remove('visible');
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
