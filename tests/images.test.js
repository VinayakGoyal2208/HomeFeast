import test from 'node:test';
import assert from 'node:assert/strict';
import {once} from 'node:events';
import {randomBytes} from 'node:crypto';
import sharp from 'sharp';
import app from '../server/app.js';
import {db,closeDb} from '../server/db.js';
test('cook photos persist, enforce ownership, and become public only on approved listings',async()=>{
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');const base='http://127.0.0.1:'+server.address().port;
 const stamp=randomBytes(5).toString('hex'),emails=['a','b','c'].map(x=>'hf-images-'+x+'-'+stamp+'@example.com'),ids=[],d=await db();
 const client=()=>{let cookie='';return async(path,method='GET',body)=>{const r=await fetch(base+'/api'+path,{method,headers:{...(cookie?{cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const data=(r.headers.get('content-type')||'').includes('application/json')?await r.json():Buffer.from(await r.arrayBuffer());return {status:r.status,data,headers:r.headers}}};
 const cook=client(),other=client(),customer=client(),admin=client(),anon=client();
 try{
  for(const [i,fn] of [cook,other,customer].entries()){const result=await fn('/auth/register','POST',{email:emails[i],password:'PhotoTest123!',name:'Image Test '+i,role:i===2?'customer':'cook'});assert.equal(result.status,200);ids.push(result.data.id)}
  const data=(await sharp({create:{width:80,height:50,channels:3,background:'#c54f2c'}}).png().toBuffer()).toString('base64');
  assert.equal((await anon('/images','POST',{data})).status,401);
  assert.equal((await customer('/images','POST',{data})).status,403);
  assert.equal((await cook('/images','POST',{data:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>').toString('base64')})).status,400);
  const uploaded=await cook('/images','POST',{data});assert.equal(uploaded.status,201);const photo=uploaded.data.id;
  assert.equal((await anon('/images/'+photo)).status,404);assert.equal((await other('/images/'+photo)).status,404);
  const own=await cook('/images/'+photo);assert.equal(own.status,200);assert.equal(own.headers.get('content-type'),'image/webp');assert.equal(own.data.subarray(8,12).toString(),'WEBP');
  const profile={images:[photo],kitchen:'Photo Test Kitchen '+stamp,bio:'Test image profile',city:'Bengaluru',area:'HSR',serviceArea:'HSR Layout',cuisine:'North Indian',mealType:'Veg',daily:120,weekly:650,monthly:2600,delivery:'12–2 PM'};
  assert.equal((await other('/kitchen','PUT',profile)).status,400);
  assert.equal((await cook('/kitchen','PUT',profile)).status,200);
  const kitchen=(await cook('/kitchen')).data;assert.deepEqual(kitchen.images,[photo]);
  const dish={image:photo,name:'Photographed thali',mealType:'Veg',price:120,available:true,delivery:'Lunch'};
  assert.equal((await cook('/menu','POST',dish)).status,200);
  assert.equal((await anon('/images/'+photo)).status,404);
  assert.equal((await admin('/auth/login','POST',{email:process.env.ADMIN_EMAIL||'admin@gmail.com',password:process.env.ADMIN_PASSWORD||'admin@123'})).status,200);
  assert.equal((await admin('/images/'+photo)).status,200);
  assert.equal((await admin('/admin/cooks/'+kitchen._id,'PATCH',{status:'approved'})).status,200);
  assert.equal((await anon('/images/'+photo)).status,200);
  const publicKitchen=(await anon('/cooks/'+kitchen._id)).data;assert.equal(publicKitchen.images[0],photo);assert.equal(publicKitchen.menu[0].image,photo);
  assert.equal((await cook('/kitchen','PUT',{...profile,images:[]})).status,200);
  const menu=(await cook('/kitchen')).data.menu[0];
  assert.equal((await cook('/menu/'+menu._id,'PUT',{...dish,image:''})).status,200);
  assert.equal((await anon('/images/'+photo)).status,404);
  const stored=await d.collection('images').findOne({ownerId:ids[0]});assert.ok(stored.expiresAt instanceof Date);
 }finally{
  await d.collection('images').deleteMany({ownerId:{$in:ids}});
  const kitchens=await d.collection('cooks').find({ownerId:{$in:ids}}).toArray();await d.collection('menus').deleteMany({cookId:{$in:kitchens.map(k=>String(k._id))}});
  await d.collection('cooks').deleteMany({ownerId:{$in:ids}});
  await d.collection('notifications').deleteMany({$or:[{userId:{$in:ids}},{actorId:{$in:ids}}]});
  await d.collection('users').deleteMany({email:{$in:emails}});
  await new Promise(resolve=>server.close(resolve));await closeDb();
 }
});

