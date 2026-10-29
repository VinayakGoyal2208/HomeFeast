import {readFile,writeFile,readdir} from 'node:fs/promises';
import {render} from '../.prerender/prerender.js';
const path=new URL('../dist/index.html',import.meta.url);let html=await readFile(path,'utf8');
html=html.replace('<div id="root"></div>','<div id="root" data-prerendered="true">'+render()+'</div>');
html=html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/,'<script type="module" src="/boot.js" data-app="$1"></script>');
const fonts=(await readdir(new URL('../dist/assets/',import.meta.url))).filter(file=>file.endsWith('.woff2'));html=html.replace('</head>',fonts.map(file=>'<link rel="preload" href="/assets/'+file+'" as="font" type="font/woff2" crossorigin/>').join('')+'</head>');await writeFile(path,html);console.log('Landing page pre-rendered; hydration scheduled after first paint.');
