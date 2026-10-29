import {chromium} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:375,height:900}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.__lcp=0;new PerformanceObserver(list=>{for(const e of list.getEntries())window.__lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true})});
const cdp=await context.newCDPSession(page);
await cdp.send('Network.enable');
await cdp.send('Network.emulateNetworkConditions',{offline:false,downloadThroughput:1.6*1024*1024/8,uploadThroughput:750*1024/8,latency:150});
await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
const listingResponse=page.waitForResponse(r=>r.url().endsWith('/api/cooks'));await page.goto('http://127.0.0.1:3001/',{waitUntil:'networkidle'});const listing=await listingResponse;if(listing.status()!==200)throw new Error('Kitchen API returned '+listing.status());if(!Array.isArray(await listing.json()))throw new Error('Kitchen API returned invalid data');
await page.locator('.hero-food').waitFor({state:'visible'});await page.locator('.hero-food').evaluate(img=>img.decode());await page.screenshot({path:'verification/production-first-view.png'});await page.waitForTimeout(1000);
const metrics=await page.evaluate(()=>({lcp:Math.round(window.__lcp),paints:performance.getEntriesByType('paint').map(p=>({name:p.name,time:Math.round(p.startTime)})),domContentLoaded:Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd),load:Math.round(performance.getEntriesByType('navigation')[0].loadEventEnd),resources:performance.getEntriesByType('resource').map(r=>({url:new URL(r.name).pathname,bytes:r.transferSize,duration:Math.round(r.duration)}))}));
await cdp.send('Network.emulateNetworkConditions',{offline:false,downloadThroughput:-1,uploadThroughput:-1,latency:0});await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=600){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(120)}
await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(900);await page.screenshot({path:'verification/home-375.png',fullPage:true});
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:3001/');const reducedMotion=await page.locator('.hero-food').evaluate(e=>getComputedStyle(e).animationName)==='none';
await writeFile('verification/performance.json',JSON.stringify({environment:'Local production build; Chrome; 375px; 4× CPU slowdown; 1.6Mbps download; 150ms latency; compressed local static preview; Vercel provides CDN compression',metrics,kitchenApiStatus:listing.status(),reducedMotion,errors},null,2));console.log(JSON.stringify({metrics,kitchenApiStatus:listing.status(),reducedMotion,errors}));await browser.close();


