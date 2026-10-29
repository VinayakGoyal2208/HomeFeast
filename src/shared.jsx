import React from 'react';
export async function api(path,method='GET',body){const r=await fetch('/api'+path,{method,credentials:'same-origin',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});const data=await r.json();if(!r.ok)throw new Error(data.error||'Request failed');if(method!=='GET')window.dispatchEvent(new Event('hf-updates'));return data}
export const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');
export function Field({label,children,...props}){const id=React.useId();return <label className="field"><span id={id}>{label}</span>{children?React.cloneElement(children,{"aria-labelledby":id}):<input {...props} aria-labelledby={id}/>}</label>}
export function Empty({children}){return <div className="empty"><span>◌</span><p>{children}</p></div>}
export function Status({value}){return <span className={'status '+value}>{value?.replaceAll('-',' ')}</span>}


export const imageUrl=id=>'/api/images/'+id;
