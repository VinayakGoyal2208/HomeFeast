import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'});
const page=await browser.newPage();const errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const [width,height] of [[1366,768],[1280,720],[1024,768],[1440,900]]){
  await page.setViewportSize({width,height});
  for(const mode of ['','?mode=register','?mode=register&role=cook']){
   await page.goto('http://127.0.0.1:3001/auth'+mode);
   await page.getByLabel('Email address').waitFor();await page.evaluate(()=>document.fonts.ready);
   const size=await page.evaluate(()=>({h:document.documentElement.scrollHeight,v:innerHeight,w:document.documentElement.scrollWidth,vw:innerWidth}));
   assert.ok(size.h<=size.v+1,'Auth needs scroll at '+width+'x'+height+mode+': '+JSON.stringify(size));
   assert.ok(size.w<=size.vw+1);
   results.push({page:'auth'+mode,width,height,fits:true});
  }
 }
 await page.setViewportSize({width:1366,height:768});await page.goto('http://127.0.0.1:3001/');
 await page.waitForResponse(r=>r.url().endsWith('/api/auth/me')).catch(()=>{});
 await page.getByRole('button',{name:'Become a cook'}).click();await page.getByRole('heading',{name:'Let’s get you started.'}).waitFor();
 assert.equal(await page.getByRole('combobox').inputValue(),'cook');
 results.push({page:'Become a cook query navigation',passed:true});
 await page.screenshot({path:'verification/auth-laptop-fixed.png'});
 for(const route of ['/cooks/','/auth/','/login','/register','/orders','/cook','/admin']){
  await page.goto('http://127.0.0.1:3001'+route);await page.waitForTimeout(500);
  assert.equal(await page.getByRole('heading',{name:'Page not found'}).count(),0,route);
  results.push({page:route,passed:true});
 }
 await page.goto('http://127.0.0.1:3001/');await page.locator('.hero-food').waitFor();
 await page.waitForTimeout(1000);
 const transform1=await page.locator('.original-floating').first().evaluate(e=>getComputedStyle(e).transform);
 await page.waitForTimeout(1000);
 const transform2=await page.locator('.original-floating').first().evaluate(e=>getComputedStyle(e).transform);
 assert.notEqual(transform1,transform2,'Food animation must visibly change');
 await page.evaluate(()=>window.scrollTo(0,350));await page.waitForTimeout(250);
 const scrollRotate=await page.locator('.hero-food').evaluate(e=>e.style.transform);
 assert.ok(scrollRotate.includes('rotate')&&!scrollRotate.includes('rotate(0deg)'),'Scroll must animate the hero: '+scrollRotate);
 await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(500);await page.screenshot({path:'verification/home-1366-fixed.png'});
 results.push({page:'Continuous and scroll-driven animation',passed:true,scrollRotate});
 assert.deepEqual(errors,[]);
 await writeFile('verification/revision-report.json',JSON.stringify({passed:true,results,errors},null,2));
 console.log(JSON.stringify({passed:true,checks:results.length,errors}));
}finally{await browser.close()}

