import React from 'react';
import {m as motion,useMotionValue,useSpring,useTransform,useReducedMotion} from 'framer-motion';
export function TiltCard({children,className=''}){
 const x=useMotionValue(0),y=useMotionValue(0),reduced=useReducedMotion();
 const rx=useSpring(useTransform(y,[-.5,.5],[10,-10]),{stiffness:200,damping:20});
 const ry=useSpring(useTransform(x,[-.5,.5],[-10,10]),{stiffness:200,damping:20});
 return <div className={'source-perspective '+className}><motion.div className="source-preserve" style={reduced?{}:{rotateX:rx,rotateY:ry}} onPointerMove={e=>{if(reduced||e.pointerType==='touch')return;const r=e.currentTarget.getBoundingClientRect();x.set((e.clientX-r.left)/r.width-.5);y.set((e.clientY-r.top)/r.height-.5)}} onPointerLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div></div>
}

