import { getServers } from './serversController.js';
import { extractStream } from '../extractor/extractStream.js';

const embedController = async (c) => {
    try {
        let { id, server, type } = c.req.param();

        // SVG icons from src/assets/
        const icons = {
            back: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
            check: '<svg viewBox="0 0 16 16" fill="#fff"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>',
            chevron: '<svg viewBox="0 0 16 16" fill="#fff" style="transform: rotate(180deg)"><path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/></svg>',
            gear: '<svg class="jw-svg-icon jw-svg-icon-settings" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"><path d="M204,145l-25-14c0.8-3.6,1.2-7.3,1-11c0.2-3.7-0.2-7.4-1-11l25-14c2.2-1.6,3.1-4.5,2-7l-16-26c-1.2-2.1-3.8-2.9-6-2l-25,14c-6-4.2-12.3-7.9-19-11V35c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6v28c-6.7,3.1-13,6.7-19,11L56,60c-2.2-0.9-4.8-0.1-6,2L35,88c-1.6,2.2-1.3,5.3,0.9,6.9c0,0,0.1,0,0.1,0.1l25,14c-0.8,3.6-1.2,7.3-1,11c-0.2,3.7,0.2,7.4,1,11l-25,14c-2.2,1.6-3.1,4.5-2,7l16,26c1.2,2.1,3.8,2.9,6,2l25-14c5.7,4.6,12.2,8.3,19,11v28c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6v-28c7-2.3,13.5-6,19-11l25,14c2.5,1.3,5.6,0.4,7-2l15-26C206.7,149.4,206,146.7,204,145z M120,149.9c-16.5,0-30-13.4-30-30s13.4-30,30-30s30,13.4,30,30c0.3,16.3-12.6,29.7-28.9,30C120.7,149.9,120.4,149.9,120,149.9z"/></svg>',
            quality: '<svg class="jw-svg-icon jw-svg-icon-quality-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"/></svg>',
            speed: '<svg viewBox="0 0 16 16" fill="#fff"><path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2zM3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.389.389 0 0 0-.029-.518z"/><path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.945 11.945 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0z"/></svg>',
            ratio: '<svg viewBox="0 0 16 16" fill="#fff"><path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"/><path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0v-3zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0v3z"/></svg>',
            cc: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-cc-on" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M215,40H25c-2.7,0-5,2.2-5,5v150c0,2.7,2.2,5,5,5h190c2.7,0,5-2.2,5-5V45C220,42.2,217.8,40,215,40z M108.1,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C90.4,141.7,102,143.5,108.1,137.7z M152.9,137.7c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9c-2.4-3.7-6.5-5.9-10.9-5.9c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6C135.2,141.7,146.8,143.5,152.9,137.7z"/></svg>',
            ccOff: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-cc-off" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M99.4,97.8c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6c0,9.6,11.6,11.4,17.7,5.5c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9C107.9,100,103.8,97.8,99.4,97.8z M144.1,97.8c-2.4-0.2-4.8,0.7-6.6,2.3c-1.7,1.7-2.5,4.1-2.4,6.5v25.6c0,9.6,11.6,11.4,17.7,5.5c0.7-0.7,1.5-1.5,2.4-2.3l6.6,7.8c-2.2,2.4-5,4.4-8,5.8c-8,3.5-17.3,2.4-24.3-2.9c-3.9-3.6-5.9-8.7-5.5-14v-25.6c0-2.7,0.5-5.3,1.5-7.8c0.9-2.2,2.4-4.3,4.2-5.9c5.7-4.5,13.2-6.2,20.3-4.6c3.3,0.5,6.3,2,8.7,4.3c1.3,1.3,2.5,2.6,3.5,4.2l-7.1,6.9C152.6,100,148.5,97.8,144.1,97.8L144.1,97.8z M200,60v120H40V60H200 M215,40H25c-2.7,0-5,2.2-5,5v150c0,2.7,2.2,5,5,5h190c2.7,0,5-2.2,5-5V45C220,42.2,217.8,40,215,40z"/></svg>',
            pip: '<svg class="jw-svg-icon jw-svg-icon-pip-on" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 5.125V9.125H22V4.155C22 3.58616 21.5389 3.125 20.97 3.125H2.03C1.46116 3.125 1 3.58613 1 4.155V17.095C1 17.6639 1.46119 18.125 2.03 18.125H12V16.125H3V5.125H20ZM14 11.875C14 11.3227 14.4477 10.875 15 10.875H22C22.5523 10.875 23 11.3227 23 11.875V17.875C23 18.4273 22.5523 18.875 22 18.875H15C14.4477 18.875 14 18.4273 14 17.875V11.875ZM6 12.375L7.79289 10.5821L5.29288 8.0821L6.7071 6.66788L9.20711 9.16789L11 7.375V12.375H6Z"/></svg>',
            volume0: '<svg class="jw-svg-icon jw-svg-icon-volume-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.6,39.1,116.4,39.9,116.4,42.8z M212.3,96.4l-14.6-14.6l-23.6,23.6l-23.6-23.6l-14.6,14.6l23.6,23.6l-23.6,23.6l14.6,14.6l23.6-23.6l23.6,23.6l14.6-14.6L188.7,120L212.3,96.4z"/></svg>',
            volume50: '<svg class="jw-svg-icon jw-svg-icon-volume-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.4,42.8v154.5c0,2.8-1.7,3.6-3.8,1.7l-54.1-48.1H28.9c-2.8,0-5.2-2.3-5.2-5.2V94.2c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48.1C114.7,39.1,116.4,39.9,116.4,42.8z M178.2,120c0-22.7-18.5-41.2-41.2-41.2v20.6c11.4,0,20.6,9.2,20.6,20.6c0,11.4-9.2,20.6-20.6,20.6v20.6C159.8,161.2,178.2,142.7,178.2,120z"/></svg>',
            volume100: '<svg class="jw-svg-icon jw-svg-icon-volume-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M116.5,42.8v154.4c0,2.8-1.7,3.6-3.8,1.7l-54.1-48H29c-2.8,0-5.2-2.3-5.2-5.2V94.3c0-2.8,2.3-5.2,5.2-5.2h29.6l54.1-48C114.8,39.2,116.5,39.9,116.5,42.8z"/><path d="M136.2,160v-20c11.1,0,20-8.9,20-20s-8.9-20-20-20V80c22.1,0,40,17.9,40,40S158.3,160,136.2,160z"/><path d="M216.2,120c0-44.2-35.8-80-80-80v20c33.1,0,60,26.9,60,60s-26.9,60-60,60v20C180.4,199.9,216.1,164.1,216.2,120z"/></svg>',
            rewind: '<svg fill="#fff" class="jw-svg-icon jw-svg-icon-rewind" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"><path d="M113.2,131.078a21.589,21.589,0,0,0-17.7-10.6,21.589,21.589,0,0,0-17.7,10.6,44.769,44.769,0,0,0,0,46.3,21.589,21.589,0,0,0,17.7,10.6,21.589,21.589,0,0,0,17.7-10.6,44.769,44.769,0,0,0,0-46.3Zm-17.7,47.2c-7.8,0-14.4-11-14.4-24.1s6.6-24.1,14.4-24.1,14.4,11,14.4,24.1S103.4,178.278,95.5,178.278Zm-43.4,9.7v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8,0,0,1,8.2,3.4v62.7l-9.6-.1Zm162-130.2v125.3a4.867,4.867,0,0,1-4.8,4.8H146.6v-19.3h48.2v-96.4H79.1v19.3c0,5.3-3.6,7.2-8,4.3l-41.8-27.9a6.013,6.013,0,0,1-2.7-8,5.887,5.887,0,0,1,2.7-2.7l41.8-27.9c4.4-2.9,8-1,8,4.3v19.3H209.2A4.974,4.974,0,0,1,214.1,57.778Z"/></svg>',
            forward: '<svg fill="#fff" class="jw-svg-icon jw-svg-icon-forward" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false"> <path d="M146.8,131.078a21.589,21.589,0,0,1,17.7-10.6,21.589,21.589,0,0,1,17.7,10.6,44.769,44.769,0,0,1,0,46.3,21.589,21.589,0,0,1-17.7,10.6,21.589,21.589,0,0,1-17.7-10.6,44.769,44.769,0,0,1,0-46.3Zm17.7,47.2c7.8,0,14.4-11,14.4-24.1s-6.6-24.1-14.4-24.1-14.4,11-14.4,24.1S156.6,178.278,164.5,178.278ZM128.1,187.978v-51l-4.8,4.8-6.8-6.8,13-13a4.8,4.8,0,0,1,8.2,3.4v62.7l-9.6-.1ZM25.9,57.778v125.3a4.867,4.867,0,0,0,4.8,4.8h62.7v-19.3H45.2v-96.4h125.3v19.3c0,5.3,3.6,7.2,8,4.3l41.8-27.9a6.013,6.013,0,0,0,2.7-8,5.887,5.887,0,0,0-2.7-2.7l-41.8-27.9c-4.4-2.9-8-1-8,4.3v19.3H30.8A4.974,4.974,0,0,0,25.9,57.778Z"/> </svg>',
            fullscreen: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-fullscreen-on" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M96.3,186.1c1.9,1.9,1.3,4-1.4,4.4l-50.6,8.4c-1.8,0.5-3.7-0.6-4.2-2.4c-0.2-0.6-0.2-1.2,0-1.7l8.4-50.6c0.4-2.7,2.4-3.4,4.4-1.4l14.5,14.5l28.2-28.2l14.3,14.3l-28.2,28.2L96.3,186.1z M195.8,39.1l-50.6,8.4c-2.7,0.4-3.4,2.4-1.4,4.4l14.5,14.5l-28.2,28.2l14.3,14.3l28.2-28.2l14.5,14.5c1.9,1.9,4,1.3,4.4-1.4l8.4-50.6c0.5-1.8-0.6-3.6-2.4-4.2C197,39,196.4,39,195.8,39.1L195.8,39.1z"/></svg>',
            fullscreenNot: '<svg fill="#fff"  xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-fullscreen-off" viewBox="0 0 240 240" focusable="false"><path d="M109.2,134.9l-8.4,50.1c-0.4,2.7-2.4,3.3-4.4,1.4L82,172l-27.9,27.9l-14.2-14.2l27.9-27.9l-14.4-14.4c-1.9-1.9-1.3-3.9,1.4-4.4l50.1-8.4c1.8-0.5,3.6,0.6,4.1,2.4C109.4,133.7,109.4,134.3,109.2,134.9L109.2,134.9z M172.1,82.1L200,54.2L185.8,40l-27.9,27.9l-14.4-14.4c-1.9-1.9-3.9-1.3-4.4,1.4l-8.4,50.1c-0.5,1.8,0.6,3.6,2.4,4.1c0.5,0.2,1.2,0.2,1.7,0l50.1-8.4c2.7-0.4,3.3-2.4,1.4-4.4L172.1,82.1z"/></svg>',
            play: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-play" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M62.8,199.5c-1,0.8-2.4,0.6-3.3-0.4c-0.4-0.5-0.6-1.1-0.5-1.8V42.6c-0.2-1.3,0.7-2.4,1.9-2.6c0.7-0.1,1.3,0.1,1.9,0.4l154.7,77.7c2.1,1.1,2.1,2.8,0,3.8L62.8,199.5z"/></svg>',
            pause: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-pause" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M100,194.9c0.2,2.6-1.8,4.8-4.4,5c-0.2,0-0.4,0-0.6,0H65c-2.6,0.2-4.8-1.8-5-4.4c0-0.2,0-0.4,0-0.6V45c-0.2-2.6,1.8-4.8,4.4-5c0.2,0,0.4,0,0.6,0h30c2.6-0.2,4.8,1.8,5,4.4c0,0.2,0,0.4,0,0.6V194.9z M180,45.1c0.2-2.6-1.8-4.8-4.4-5c-0.2,0-0.4,0-0.6,0h-30c-2.6-0.2-4.8,1.8-5,4.4c0,0.2,0,0.4,0,0.6V195c-0.2,2.6,1.8,4.8,4.4,5c0.2,0,0.4,0,0.6,0h30c2.6,0.2,4.8-1.8,5-4.4c0-0.2,0-0.4,0-0.6V45.1z"/></svg>',
            buffer: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-buffer" viewBox="0 0 240 240" focusable="false"><path d="M120,186.667a66.667,66.667,0,0,1,0-133.333V40a80,80,0,1,0,80,80H186.667A66.846,66.846,0,0,1,120,186.667Z"/></svg>',
            replay: '<svg class="jw-svg-icon jw-svg-icon-replay" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" focusable="false" fill="#fff"><path d="M120,41.9v-20c0-5-4-8-8-4l-44,28a5.865,5.865,0,0,0-3.3,7.6A5.943,5.943,0,0,0,68,56.8l43,29c5,4,9,1,9-4v-20a60,60,0,1,1-60,60H40a80,80,0,1,0,80-79.9Z"/></svg>',
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

        .buffering-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 50;
            pointer-events: none;
        }
        .buffering-overlay.visible {
            display: flex;
        }
        .buffering-overlay svg {
            width: 64px;
            height: 64px;
            fill: #fff;
            animation: buffer-spin 0.8s linear infinite;
        }
        @keyframes buffer-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
        
        /* Style for SVG icons in slots */
        .yt-button svg,
        media-play-button svg,
        media-mute-button svg, 
        media-pip-button svg, 
        media-fullscreen-button svg, 
        media-seek-backward-button svg, 
        media-seek-forward-button svg { 
            height: 24px; 
            width: 24px; 
            fill: #fff !important;
        }
        
        #settings-btn { width: 28px !important; }
        #settings-btn svg { height: 16px !important; width: 16px !important; fill: #fff !important; }

        /* Enhanced styling for JW player icons */
        .jw-svg-icon-settings {
            width: 20px !important;
            height: 20px !important;
        }
        
        .jw-svg-icon-volume-0,
        .jw-svg-icon-volume-50,
        .jw-svg-icon-volume-100 {
            width: 24px !important;
            height: 24px !important;
        }
        
        .jw-svg-icon-rewind,
        .jw-svg-icon-forward {
            width: 24px !important;
            height: 24px !important;
        }
        
        /* Ensure media-mute-button icons display correctly */
        media-mute-button .jw-svg-icon {
            display: block;
            width: 24px !important;
            height: 24px !important;
        }
        
        /* Ensure seek button icons display correctly */
        media-seek-backward-button .jw-svg-icon,
        media-seek-forward-button .jw-svg-icon {
            display: block;
            width: 24px !important;
            height: 24px !important;
        }
        
        /* Settings button specific styling */
        #settings-btn .jw-svg-icon-settings {
            display: block;
            width: 20px !important;
            height: 20px !important;
        }

        
        /* Ensure slotted SVGs are visible and properly sized */
        media-play-button::part(button) { background: transparent !important; }
        media-mute-button::part(button) { background: transparent !important; }
        media-pip-button::part(button) { background: transparent !important; }
        media-fullscreen-button::part(button) { background: transparent !important; }
        media-seek-backward-button::part(button) { background: transparent !important; }
        media-seek-forward-button::part(button) { background: transparent !important; }

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
            background-color: rgba(59, 130, 246, 0.85) !important;
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
        media-volume-range:focus, media-volume-range:focus-within { width: 120px; margin-left: 8px; }

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
            width: 100px;
            height: 100px;
            background: transparent !important;
            border-radius: 50%;
            transition: opacity 0.2s ease;
            border: none !important;
            opacity: 0.9;
        }
        .mobile-centered-controls media-play-button svg {
            width: 70px !important;
            height: 70px !important;
            fill: #fff !important;
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
                width: 70px; 
                height: 70px;
            }
            .mobile-centered-controls media-play-button svg {
                width: 60px !important;
                height: 60px !important;
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
        </div>
        
        <div id="buffering-overlay" class="buffering-overlay">
          ${icons.buffer}
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
            ${icons.volume100.replace('<svg', '<svg slot="high"')}
            ${icons.volume50.replace('<svg', '<svg slot="medium"')}
            ${icons.volume0.replace('<svg', '<svg slot="off"')}
          </media-mute-button>
          <media-volume-range></media-volume-range>

          <media-seek-backward-button seek-offset="10" class="yt-button">
            ${icons.rewind.replace('<svg', '<svg slot="icon"')}
          </media-seek-backward-button>
          
          <media-seek-forward-button seek-offset="10" class="yt-button">
            ${icons.forward.replace('<svg', '<svg slot="icon"')}
          </media-seek-forward-button>

          <media-time-display showduration></media-time-display>
          <span class="control-spacer"></span>

          <button id="settings-btn" class="yt-button" style="background: none; border: none; cursor: pointer;">
            ${icons.gear}
          </button>

          <media-pip-button class="yt-button">
            ${icons.pip.replace('<svg', '<svg slot="icon"')}
          </media-pip-button>

          <media-fullscreen-button class="yt-button">
            ${icons.fullscreen.replace('<svg', '<svg slot="enter"')}
            ${icons.fullscreenNot.replace('<svg', '<svg slot="exit"')}
          </media-fullscreen-button>
        </media-control-bar>

        <div class="mobile-centered-controls" slot="centered-chrome">
          <media-play-button>
            ${icons.play.replace('<svg', '<svg slot="play"')}
            ${icons.pause.replace('<svg', '<svg slot="pause"')}
            ${icons.replay.replace('<svg', '<svg slot="replay"')}
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
        const bufferingOverlay = document.getElementById('buffering-overlay');

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

        function showBuffering() {
            if (bufferingOverlay) {
                bufferingOverlay.classList.add('visible');
            }
        }

        function hideBuffering() {
            if (bufferingOverlay) {
                bufferingOverlay.classList.remove('visible');
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
                    showBuffering();
                }
            });

            hls.on(Hls.Events.FRAG_LOADED, () => {
                if (video.readyState >= 3) {
                    hideBuffering();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = '${m3u8Url}';
            video.addEventListener('loadedmetadata', loadSubtitles);
        }

        video.addEventListener('waiting', showBuffering);
        video.addEventListener('seeking', showBuffering);
        video.addEventListener('loadstart', showLoading);
        video.addEventListener('canplay', () => {
            hideLoading();
            hideBuffering();
        });
        video.addEventListener('playing', hideBuffering);
        video.addEventListener('seeked', hideBuffering);

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
                    introDiv.style.backgroundColor = 'rgba(59, 130, 246, 0.85)';
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
                    outroDiv.style.backgroundColor = 'rgba(59, 130, 246, 0.85)';
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
            html += renderMenuItem(SVGs.quality, 'Quality', qualityLabel, 'quality');
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
