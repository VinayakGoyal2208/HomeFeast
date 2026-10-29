import {db} from './db.js';
import bcrypt from 'bcryptjs';
const d=await db();
await Promise.all([
d.collection('users').createIndex({email:1},{unique:true}),
d.collection('cooks').createIndex({ownerId:1},{unique:true}),
d.collection('cooks').createIndex({status:1,city:1}),
d.collection('orders').createIndex({customerId:1,createdAt:-1}),
d.collection('orders').createIndex({ownerId:1,createdAt:-1}),
d.collection('subscriptions').createIndex({orderId:1},{unique:true}),
d.collection('reviews').createIndex({orderId:1},{unique:true}),
d.collection('menus').createIndex({cookId:1}),
d.collection('notifications').createIndex({userId:1,createdAt:-1})
]);
const email=(process.env.ADMIN_EMAIL||'admin@gmail.com').toLowerCase();
await d.collection('users').updateOne({email},{$setOnInsert:{email,name:'HomeFeast Admin',password:await bcrypt.hash(process.env.ADMIN_PASSWORD||'admin@123',12),role:'admin',createdAt:new Date(),lastActiveAt:new Date()}},{upsert:true});
for(const [type,names] of Object.entries({cuisine:['North Indian','South Indian','Maharashtrian','Gujarati','Bengali'],category:['Veg','Non-Veg','Daily','Weekly','Monthly']}))for(const name of names)await d.collection('taxonomy').updateOne({type,name},{$set:{type,name}},{upsert:true});
console.log('HomeFeast database initialized. Admin and taxonomy ready. No sample orders or kitchens created.');
process.exit(0);

