import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome'}),page=await browser.newPage(),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto('http://127.0.0.1:3001/');
 for(const heading of ['Explore home kitchens.','One meal or a new habit.','A little less everyday effort.','A few helpful answers.'])await page.getByRole('heading',{name:heading,exact:true}).waitFor();
 await page.locator('summary').filter({hasText:'How do payments work?'}).click();await page.getByText('Cash on delivery is available in Phase 1.',{exact:false}).waitFor();
 checks.push('Home discovery, plan comparison, audience content and working FAQ');
 await page.getByRole('link',{name:'Explore weekly plans'}).click();await page.getByLabel('Plan',{exact:true}).waitFor();assert.equal(await page.getByLabel('Plan',{exact:true}).inputValue(),'weekly');checks.push('Plan CTA applies chosen plan');
 await page.goto('http://127.0.0.1:3001/cooks/preview-arjun');await page.getByRole('heading',{name:'Arjun’s Home Tiffins'}).waitFor();
 assert.equal(await page.getByRole('button',{name:/Request .* plan/}).count(),0);
 await page.getByText('Preview only',{exact:true}).waitFor();await page.getByText('Chicken curry, rice & chapatis',{exact:true}).waitFor();checks.push('Sample kitchen clearly labeled; live ordering disabled; full menu shown');
 for(const width of [320,375,425,768,1024,1440]){
 await page.setViewportSize({width,height:900});
 for(const path of ['/','/cooks','/cooks/preview-anita']){
 await page.goto('http://127.0.0.1:3001'+path);await page.locator('h1').waitFor();await page.waitForTimeout(250);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path+' overflows at '+width);
 checks.push(path+' fits '+width);
 }
 }
 await page.route('**/api/cooks',route=>route.fulfill({json:[]}));await page.setViewportSize({width:1440,height:900});await page.goto('http://127.0.0.1:3001/cooks');await page.getByLabel('City',{exact:true}).waitFor();
 await page.getByText('Preview directory',{exact:true}).waitFor();const option=await page.getByLabel('City',{exact:true}).locator('option').allTextContents();if(option.includes('Pune')){await page.getByLabel('City',{exact:true}).selectOption('Pune');await page.getByRole('heading',{name:'Meera’s South Indian Table',exact:true}).waitFor();assert.equal(await page.locator('.kitchen-card').count(),1);checks.push('City filtering works for sample directory')}
 await page.screenshot({path:'verification/discovery-preview.png',fullPage:true});
 assert.deepEqual(errors,[]);await writeFile('verification/content-report.json',JSON.stringify({passed:true,checks,errors},null,2));console.log(JSON.stringify({passed:true,checks:checks.length,errors}));
}finally{await browser.close()}


