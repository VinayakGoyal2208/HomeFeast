import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {db,closeDb} from '../server/db.js';
const browser=await chromium.launch({headless:true,channel:'chrome'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage(),errors=[],report={viewports:[],flows:[],consoleErrors:errors};
page.on('pageerror',e=>errors.push(e.message));const authResponses=[];page.on('response',async r=>{if(/api\/auth\/(register|login)/.test(r.url())){const data=await r.json().catch(()=>({}));authResponses.push({status:r.status(),error:data.error})}});
const stamp=randomBytes(5).toString('hex'),email='hf-browser-'+stamp+'@example.com',cookEmail='hf-browser-cook-'+stamp+'@example.com';
await mkdir('verification',{recursive:true});
const d=await db();let ids=[],cookId;
try{
 await page.goto('http://127.0.0.1:3001/');
 await page.getByRole('heading',{name:/Ghar ka khana/}).waitFor();
 for(const width of [1440,1024,768,425,375,320,1920]){
  await page.setViewportSize({width,height:1000});
  for(const route of ['/','/cooks','/auth']){
   await page.goto('http://127.0.0.1:3001'+route);
   await page.locator('h1').waitFor();
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForTimeout(250);
   const dimensions=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dimensions.scroll<=dimensions.width+1,route+' overflows at '+width+': '+dimensions.scroll);
   report.viewports.push({route,width,horizontalOverflow:false});
  }
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:3001/');
 await page.locator('.hero-food').waitFor();
 await page.waitForTimeout(1300);await page.screenshot({path:'verification/home-1440.png',fullPage:false});
 await page.setViewportSize({width:375,height:900});await page.waitForTimeout(300);await page.screenshot({path:'verification/home-375.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});
 await page.goto('http://127.0.0.1:3001/auth?mode=register&role=cook');
 await page.getByLabel('Your name').fill('Browser Test Cook');
 await page.getByLabel('Email address').fill(cookEmail);await page.getByLabel('Password',{exact:true}).fill('TestPassword123!');
 await page.getByRole('button',{name:'Show password',exact:true}).click();assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'text');assert.equal(await page.getByLabel('Password',{exact:true}).inputValue(),'TestPassword123!');await page.getByRole('button',{name:'Hide password',exact:true}).click();assert.equal(await page.getByLabel('Password',{exact:true}).getAttribute('type'),'password');report.flows.push('Password visibility toggle preserves value and does not submit');await page.getByRole('button',{name:'Create my account'}).click();
 await page.getByRole('status').filter({hasText:'Your account is ready!'}).waitFor();
 await page.waitForURL('**/dashboard');await page.getByRole('button',{name:'Set up my kitchen'}).click();
 await page.getByLabel('Kitchen name').fill('Browser Test Kitchen');
 await page.getByLabel('City',{exact:true}).fill('Bengaluru');
 await page.getByLabel('Neighbourhood').fill('HSR Layout');
 await page.getByLabel('Delivery service area').fill('HSR Layout, Bengaluru');
 await page.getByLabel('Your kitchen story').fill('Traditional homemade meals, prepared fresh every day.');await page.getByLabel('Kitchen photos',{exact:true}).setInputFiles(['src/assets/cook.webp','src/assets/thali.webp']);await page.getByAltText('Kitchen photos 2',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Submit for approval'}).click();
 await page.getByRole('alert').filter({hasText:'Kitchen saved'}).waitFor();
 await page.getByRole('button',{name:'menu',exact:true}).click();
 await page.getByLabel('Dish name').fill('Dal, rice & roti');await page.getByLabel('Dish photo',{exact:true}).setInputFiles('src/assets/thali.webp');await page.getByAltText('Dish photo 1',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Add dish'}).click();
 await page.getByRole('alert').filter({hasText:'Menu updated'}).waitFor();
 report.flows.push('Cook registration, success animation, dashboard redirect, profile submission, menu creation');
 const cookUser=await d.collection('users').findOne({email:cookEmail});ids.push(String(cookUser._id));
 const kitchen=await d.collection('cooks').findOne({ownerId:String(cookUser._id)});cookId=String(kitchen._id);assert.equal(kitchen.images.length,2);report.flows.push('Kitchen gallery and dish photo upload persist in MongoDB');
 for(const width of [1440,1024,768,425,375,320]){
 await page.setViewportSize({width,height:900});
 for(const tab of ['overview','requests','subscriptions','earnings','menu','profile']){
 if(page.viewportSize().width<=640)await page.getByLabel('Dashboard section',{exact:true}).selectOption(tab);else await page.getByRole('button',{name:tab,exact:true}).click();
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Cook '+tab+' overflow at '+width);
 report.viewports.push({route:'cook/'+tab,width,horizontalOverflow:false});
 }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.getByRole('button',{name:'overview',exact:true}).click();
 await page.screenshot({path:'verification/cook-1440.png',fullPage:true});
 const adminContext=await browser.newContext({viewport:{width:1440,height:1000}});const login=await adminContext.request.post('http://127.0.0.1:3001/api/auth/login',{data:{email:process.env.ADMIN_EMAIL||'admin@gmail.com',password:process.env.ADMIN_PASSWORD||'admin@123'}});assert.equal(login.status(),200);
 assert.equal((await adminContext.request.patch('http://127.0.0.1:3001/api/admin/cooks/'+cookId,{data:{status:'approved'}})).status(),200);
 const adminPage=await adminContext.newPage();await adminPage.goto('http://127.0.0.1:3001/dashboard');await adminPage.getByText('Registered users',{exact:true}).waitFor();await adminPage.screenshot({path:'verification/admin-1440.png',fullPage:true});await adminPage.getByRole('button',{name:'cooks',exact:true}).click();await adminPage.getByRole('article').filter({hasText:'Browser Test Kitchen'}).getByText('Review submitted menu',{exact:true}).click();await adminPage.getByText('Dal, rice & roti',{exact:true}).waitFor();report.flows.push('Admin can inspect kitchen menus');
 await page.getByRole('button',{name:'Sign out',exact:true}).click();await page.getByRole('status').filter({hasText:'signed out'}).waitFor();await page.waitForURL('http://127.0.0.1:3001/');
 await page.goto('http://127.0.0.1:3001/auth?mode=register');await page.getByLabel('Your name').fill('Browser Test Customer');await page.getByLabel('Email address').fill(email);await page.getByLabel('Password',{exact:true}).fill('TestPassword123!');await page.getByRole('button',{name:'Create my account'}).click();await page.waitForURL('**/dashboard');
 const customer=await d.collection('users').findOne({email});ids.push(String(customer._id));
 await page.goto('http://127.0.0.1:3001/cooks');const fullCard=page.getByRole('link',{name:'View Browser Test Kitchen',exact:true});await fullCard.locator('h3').click();await page.getByRole('heading',{name:'Browser Test Kitchen',exact:true}).waitFor();await page.goBack();await page.getByRole('link',{name:'View Browser Test Kitchen',exact:true}).locator('img').click();await page.getByRole('heading',{name:'Browser Test Kitchen',exact:true}).waitFor();await page.goBack();await page.getByRole('link',{name:'View Browser Test Kitchen',exact:true}).focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'Browser Test Kitchen',exact:true}).waitFor();await page.getByAltText('Browser Test Kitchen cover photo',{exact:true}).evaluate(img=>img.decode());await page.getByAltText('Dal, rice & roti',{exact:true}).evaluate(img=>img.decode());report.flows.push('Whole kitchen card supports heading/image clicks and keyboard activation; uploaded images render publicly');
 await page.getByLabel('Start date').fill(new Date().toLocaleDateString('en-CA',{timeZone:'Asia/Kolkata'}));
 await page.getByLabel('Phone number').fill('9876543210');await page.getByLabel('Delivery address').fill('12 Garden Street, HSR Layout, Bengaluru 560102');await page.getByRole('button',{name:'Request daily plan'}).click();await page.waitForURL('**/dashboard');await page.getByText('Pending confirmation',{exact:true}).waitFor();
 report.flows.push('Customer registration, dashboard redirect, kitchen detail, COD order placement and tracking');
 for(const width of [1440,1024,768,425,375,320]){
  await page.setViewportSize({width,height:900});
  for(const tab of ['overview','orders','subscriptions','support']){
   if(page.viewportSize().width<=640)await page.getByLabel('Dashboard section',{exact:true}).selectOption(tab);else await page.getByRole('button',{name:tab,exact:true}).click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Customer dashboard overflow at '+width);
   report.viewports.push({route:'customer/'+tab,width,horizontalOverflow:false});
  }
  await page.goto('http://127.0.0.1:3001/cooks/'+cookId);await page.getByRole('heading',{name:'Browser Test Kitchen'}).waitFor();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Kitchen detail overflow at '+width);
  report.viewports.push({route:'kitchen-detail',width,horizontalOverflow:false});
  await page.goto('http://127.0.0.1:3001/dashboard');await page.getByText('Pending confirmation',{exact:true}).waitFor();
 }
 for(const width of [1440,1024,768,425,375,320]){
  await adminPage.setViewportSize({width,height:900});
  for(const tab of ['overview','cooks','users','orders','subscriptions','complaints','settings']){
   if(adminPage.viewportSize().width<=640)await adminPage.getByLabel('Dashboard section',{exact:true}).selectOption(tab);else await adminPage.getByRole('button',{name:tab,exact:true}).click();
   assert.ok(await adminPage.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Admin '+tab+' overflow at '+width);
   report.viewports.push({route:'admin/'+tab,width,horizontalOverflow:false});
  }
 }
 await page.setViewportSize({width:375,height:900});await page.getByLabel('Dashboard section',{exact:true}).selectOption('overview');await page.locator('.notification-menu>summary').click();const panel=await page.locator('.notification-panel').boundingBox();assert.ok(panel.x>=0&&panel.x+panel.width<=375);await page.locator('.notification-menu>summary').click();report.flows.push('Mobile notification panel stays within screen');await page.screenshot({path:'verification/customer-375.png',fullPage:true});
 await adminContext.close();
 assert.deepEqual(errors,[]);
 report.passed=true;
}catch(error){await page.screenshot({path:'verification/browser-failure.png'});console.log(JSON.stringify({url:page.url(),authResponses,body:(await page.locator('body').innerText()).slice(0,2500)}));throw error;}finally{
 const accounts=await d.collection('users').find({email:{$in:[email,cookEmail]}}).toArray();ids=accounts.map(u=>String(u._id));
 const kitchens=await d.collection('cooks').find({ownerId:{$in:ids}}).toArray();const cookIds=kitchens.map(c=>String(c._id));
 const orders=await d.collection('orders').find({customerId:{$in:ids}}).toArray();const orderIds=orders.map(o=>String(o._id));
 for(const [collection,filter] of [['images',{ownerId:{$in:ids}}],['reviews',{orderId:{$in:orderIds}}],['subscriptions',{orderId:{$in:orderIds}}],['complaints',{customerId:{$in:ids}}],['orders',{customerId:{$in:ids}}],['notifications',{$or:[{userId:{$in:ids}},{actorId:{$in:ids}}]}],['menus',{cookId:{$in:cookIds}}],['cooks',{ownerId:{$in:ids}}],['users',{email:{$in:[email,cookEmail]}}]])await d.collection(collection).deleteMany(filter);
 await browser.close();await closeDb();await writeFile('verification/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,viewportChecks:report.viewports.length,flows:report.flows,errors}));
}




