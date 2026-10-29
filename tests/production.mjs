import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const b=await chromium.launch({channel:'chrome'});
const p=await b.newPage({viewport:{width:375,height:900}}),errors=[];
p.on('pageerror',e=>errors.push(e.message));
try{
 const hydrated=p.waitForResponse(r=>r.url().endsWith('/api/auth/me'));
 await p.goto('http://127.0.0.1:3001/');await hydrated;
 await p.getByRole('button',{name:'Toggle navigation'}).click();
 await p.locator('header').getByRole('button',{name:/Sign in/}).click();
 await p.getByLabel('Email address').fill(process.env.ADMIN_EMAIL||'admin@gmail.com');
 await p.getByLabel('Password',{exact:true}).fill(process.env.ADMIN_PASSWORD||'admin@123');
 await p.getByRole('button',{name:'Sign in →',exact:true}).click();
 await p.waitForURL('**/dashboard');await p.getByText('Registered users',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);
 await p.getByRole('button',{name:'Toggle navigation'}).click();await p.getByRole('button',{name:'Sign out',exact:true}).click();await p.waitForURL('http://127.0.0.1:3001/');
 const report={passed:true,checks:['Production prerender/hydration','Mobile navigation','Admin login and success redirect','Admin dashboard','Logout redirect'],errors};await writeFile('verification/production-smoke.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await b.close()}

