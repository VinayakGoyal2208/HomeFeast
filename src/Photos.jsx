import React,{useId,useRef,useState} from 'react';
import {api,imageUrl} from './shared.jsx';
async function preparePhoto(file){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Choose a JPEG, PNG or WebP photo.');
 if(file.size>8*1024*1024)throw new Error('Please choose a photo smaller than 8 MB.');
 const bitmap=await createImageBitmap(file);
 try{
  const ratio=Math.min(1,1200/Math.max(bitmap.width,bitmap.height)),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.82));
  if(blob?.size>600000)blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.6));
  if(!blob||blob.size>600000)throw new Error('Please crop this photo or choose a smaller image.');
  const result=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('Could not read this photo.'));reader.readAsDataURL(blob)});
  return result;
 }finally{bitmap.close()}
}
export function PhotoPicker({label,value=[],onChange,max=1,onBusyChange=()=>{}}){
 const id=useId(),[busy,setBusy]=useState(false),[error,setError]=useState(''),inputRef=useRef(null);
 async function choose(event){
  const files=Array.from(event.target.files||[]);if(!files.length)return;
  if(files.length+value.length>max){setError('Choose up to '+max+' photo'+(max===1?'':'s')+'.');event.target.value='';return}
  setBusy(true);onBusyChange(true);setError('');const added=[];
  try{for(const file of files){const data=await preparePhoto(file);const image=await api('/images','POST',{data});added.push(image.id)}}
  catch(e){setError(e.message||'Could not upload this photo. Please try again.')}
  finally{if(added.length)onChange([...value,...added]);setBusy(false);onBusyChange(false);if(inputRef.current)inputRef.current.value=''}
 }
 return <div className="photo-picker"><label htmlFor={id}>{label}</label><p className="form-note">JPEG, PNG or WebP, up to 8 MB each. Photos are resized automatically.{max>1?' The first photo is your cover.':''} Save the form to publish changes.</p><div className="photo-previews">{value.map((image,index)=><div key={image} className="photo-preview"><img src={imageUrl(image)} alt={label+' '+(index+1)}/><div>{max>1&&index===0&&<span>Cover</span>}{index>0&&<button type="button" disabled={busy} onClick={()=>onChange([image,...value.filter(v=>v!==image)])}>Set cover</button>}<button type="button" disabled={busy} aria-label={'Remove '+label.toLowerCase()+' '+(index+1)} onClick={()=>onChange(value.filter(v=>v!==image))}>Remove</button></div></div>)}</div><input ref={inputRef} id={id} type="file" accept="image/jpeg,image/png,image/webp" multiple={max>1} disabled={busy||value.length>=max} onChange={choose}/>{busy&&<p role="status">Preparing and uploading photos…</p>}{error&&<p role="alert" className="error">{error}</p>}</div>
}

