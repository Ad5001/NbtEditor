/**
 * sw.js - Service Worker Caching for modern browsers.
 * @author Ad5001 <mail@ad5001.eu>
 * @license NTOSL (View LICENSE.md)
 * @copyright (C) Ad5001 2017
 * @package nbt-editor-server
 */
var cachedFiles = [
    // ./css
    '/css/editor.css',
    '/css/fs.css',
    '/css/nem.css',
    // ./css/material
    '/css/material/mdc.css',
    '/css/material/roboto.css',
    // ./css/fontawesome/css
    'css/fontawesome/css/font-awesome.min.css',
    // ./css/fontawesome/fonts
    'css/fontawesome/fonts/fontawesome-webfont.eot',
    'css/fontawesome/fonts/fontawesome-webfont.svg',
    'css/fontawesome/fonts/fontawesome-webfont.ttf',
    'css/fontawesome/fonts/fontawesome-webfont.woff',
    'css/fontawesome/fonts/fontawesome-webfont.woff2',
    // ./css/material/roboto:
    '/css/material/roboto/roboto-v16-latin_cyrillic-100.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-100.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-100.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-100.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-100.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-300.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-300.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-300.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-300.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-300.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-500.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-500.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-500.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-500.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-500.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700italic.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700italic.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700italic.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700italic.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700italic.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-700.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-900.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-900.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-900.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-900.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-900.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-italic.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-italic.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-italic.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-italic.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-italic.woff2',
    '/css/material/roboto/roboto-v16-latin_cyrillic-regular.eot',
    '/css/material/roboto/roboto-v16-latin_cyrillic-regular.svg',
    '/css/material/roboto/roboto-v16-latin_cyrillic-regular.ttf',
    '/css/material/roboto/roboto-v16-latin_cyrillic-regular.woff',
    '/css/material/roboto/roboto-v16-latin_cyrillic-regular.woff2',
    // ./js:
    '/js/editor.js',
    '/js/files.js',
    '/js/fs-manager.js',
    '/js/index.js',
    '/js/material/mdc.js',
    // ./js/node:
    '/js/node/browserfs.min.js',
    '/js/node/browserfs.min.js.map',
    '/js/node/node_modules.js',
    // ./js/utils:
    '/js/utils/msv.js',
    '/js/utils/nbtFile.js',
    '/js/utils/three.min.js',
    // ./js/utils/files:
    '/js/utils/files/datFile.js',
    '/js/utils/files/htmlRender.js',
    '/js/utils/files/player.js',
    '/js/utils/files/renderable.js',
]



this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll(cachedFiles);
        })
    );

});