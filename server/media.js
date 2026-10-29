import sharp from 'sharp';
import jwt from 'jsonwebtoken';
import {z} from 'zod';
export async function verifyImages(d,images,ownerId){
 const ids=[...new Set(images.filter(Boolean))];
 if(!ids.length)return;
 const {ObjectId}=await import('mongodb');
 if(ids.some(value=>!ObjectId.isValid(value))||await d.collection('images').countDocuments({_id:{$in:ids.map(value=>new ObjectId(value))},ownerId})!==ids.length)throw Object.assign(new Error('Select images uploaded by your own account.'),{status:400});
 await d.collection('images').updateMany({_id:{$in:ids.map(value=>new ObjectId(value))},ownerId},{$unset:{expiresAt:''}});
}
export async function expireUnusedImages(d,images){
 const {ObjectId}=await import('mongodb');
 for(const image of new Set(images.filter(Boolean))){
  if(!ObjectId.isValid(image))continue;
  const used=await d.collection('cooks').findOne({images:image},{projection:{_id:1}})||await d.collection('menus').findOne({image},{projection:{_id:1}});
  if(!used)await d.collection('images').updateOne({_id:new ObjectId(image)},{$set:{expiresAt:new Date(Date.now()+86400000)}});
 }
}
let indexes;
export function installMedia(app,{auth,role,id,fail,db,secret}){
 app.post('/api/images',auth,role('cook'),async(req,res)=>{
  const {data}=z.object({data:z.string().min(16).max(850000).regex(/^[A-Za-z0-9+/]+={0,2}$/)}).parse(req.body),d=await db(),ownerId=String(req.user._id);
  if(!indexes)indexes=Promise.all([d.collection('images').createIndex({expiresAt:1},{expireAfterSeconds:0}),d.collection('images').createIndex({ownerId:1,createdAt:-1})]).catch(error=>{indexes=undefined;throw error});
  await indexes;
  if(await d.collection('images').countDocuments({ownerId,$or:[{expiresAt:{$exists:false}},{expiresAt:{$gt:new Date()}}]})>=40)fail('You can store up to 40 photos. Unused uploads are automatically cleared within 24 hours.');
  const input=Buffer.from(data,'base64');if(input.length>640000)fail('The image is too large. Choose a smaller photo.');
  let output;
  try{const image=sharp(input,{limitInputPixels:25000000,animated:false});const metadata=await image.metadata();if(!['jpeg','png','webp'].includes(metadata.format))fail('Unsupported image format');output=await image.rotate().resize({width:1200,height:1200,fit:'inside',withoutEnlargement:true}).webp({quality:78}).toBuffer()}catch{fail('Choose a valid JPEG, PNG or WebP photo.')}
  if(output.length>500000)fail('The image is too detailed. Please crop it or choose a smaller photo.');
  const asset={ownerId,data:output,contentType:'image/webp',createdAt:new Date(),expiresAt:new Date(Date.now()+86400000)};
  await d.collection('images').insertOne(asset);res.status(201).json({id:String(asset._id),url:'/api/images/'+asset._id});
 });
 app.get('/api/images/:id',async(req,res)=>{
  const d=await db(),asset=await d.collection('images').findOne({_id:id(req.params.id)});if(!asset)fail('Image not found',404);
  let viewer;try{const token=jwt.verify(req.cookies.hf_session||'',secret(),{algorithms:['HS256']});viewer=await d.collection('users').findOne({_id:id(token.sub),disabled:{$ne:true}})}catch{}
  let allowed=viewer&&(viewer.role==='admin'||String(viewer._id)===asset.ownerId);
  if(!allowed){
   const kitchen=await d.collection('cooks').findOne({images:req.params.id,status:'approved'});
   const menu=kitchen?null:await d.collection('menus').findOne({image:req.params.id});
   const cook=kitchen||(menu&&await d.collection('cooks').findOne({_id:id(menu.cookId),status:'approved'}));
   allowed=cook&&await d.collection('users').findOne({_id:id(cook.ownerId),disabled:{$ne:true}},{projection:{_id:1}});
  }
  if(!allowed)fail('Image not found',404);
  const tag='"'+req.params.id+'"';res.set({'Content-Type':'image/webp','Cache-Control':'private, max-age=300','ETag':tag,'X-Content-Type-Options':'nosniff'});
  if(req.get('If-None-Match')===tag)return res.status(304).end();
  res.send(Buffer.isBuffer(asset.data)?asset.data:Buffer.from(asset.data.buffer));
 });
}

