import React,{useId,useState} from 'react';
import {Eye,EyeOff} from 'lucide-react';
export default function PasswordField({autoComplete='current-password'}){
 const [visible,setVisible]=useState(false),id=useId();
 return <div className="field"><label htmlFor={id}>Password</label><div className="password-control"><input id={id} name="password" type={visible?'text':'password'} required minLength={8} maxLength={100} autoComplete={autoComplete}/><button type="button" className="password-toggle" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} aria-controls={id} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
}

