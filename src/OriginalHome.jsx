import React,{useRef,useState,useEffect} from 'react';
import {m as motion,useScroll,useTransform,useReducedMotion} from 'framer-motion';
import {ChefHat,Search,CalendarCheck,Truck,ShieldCheck,Leaf,Wallet} from 'lucide-react';
import thali from './assets/thali.webp';
import cookImg from './assets/cook.webp';
import {HomeContent} from './Content.jsx';
import {TiltCard} from './Motion.jsx';
import {money,Field} from './shared.jsx';

const problems=[
 {Icon:Wallet,title:'Clear, affordable meal plans',description:'Compare daily, weekly and monthly prices before sending a request.'},
 {Icon:Leaf,title:'Familiar homemade menus',description:'Explore fresh dishes and check meal availability with your cook.'},
 {Icon:CalendarCheck,title:'A routine that fits you',description:'Try a day, plan a week or subscribe monthly. Pause eligible plans.'},
 {Icon:ShieldCheck,title:'Less coordination, more clarity',description:'Admin-approved kitchens, order updates and support in one place.'}
];
const steps=[
 {Icon:Search,title:'Search & filter',description:'By veg/non-veg, cuisine, city, price and plan.'},
 {Icon:ChefHat,title:'Pick your cook',description:'See menus, ratings and kitchen stories.'},
 {Icon:CalendarCheck,title:'Choose a plan',description:'Daily trial, weekly or monthly subscription.'},
 {Icon:Truck,title:'Get it hot',description:'The cook accepts, you get confirmation and delivery updates.'}
];
function Hero({go}){
 const ref=useRef(null),reduced=useReducedMotion(),[ready,setReady]=useState(false);
 useEffect(()=>setReady(true),[]);
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
 const rotate=useTransform(scrollYProgress,[0,1],[0,120]),rotateX=useTransform(scrollYProgress,[0,1],[0,45]),scale=useTransform(scrollYProgress,[0,1],[1,.7]),textY=useTransform(scrollYProgress,[0,1],[0,150]);
 return <section ref={ref} className="original-hero"><div className="source-container original-hero-grid">
 <motion.div className="original-hero-copy" style={reduced?{}:{y:textY}}><span className="original-tag">Fresh meals from local home kitchens</span><motion.h1 initial={false} animate={{y:0}} transition={{duration:.8}}>Ghar ka khana, <em>every single day.</em></motion.h1><p>Fresh, hygienic tiffins from home cooks in your neighbourhood. Subscribe daily, weekly or monthly — pause eligible plans anytime.</p><motion.div className="original-hero-actions" initial={false} animate={{y:0}}><a href="/cooks" className="btn" onClick={e=>{e.preventDefault();go('/cooks')}}>Find tiffins near me</a><a href="#how" className="ghost">How it works</a></motion.div></motion.div>
 <div className="original-food-stage"><motion.div className="original-food-depth hero-art" style={reduced?{}:{rotateX,scale}}><motion.img className="hero-food" src={thali} alt="Homemade Indian thali with dal, paneer, rice and rotis" width="800" height="800" fetchPriority="high" initial={false} animate={{scale:reduced||ready?1:.85}} transition={{duration:1.2,ease:'easeOut'}} style={reduced?{}:{rotate}}/></motion.div>
 {[{text:'100% homemade',Icon:Leaf,position:'original-label-one'},{text:'Approved local kitchens',Icon:ShieldCheck,position:'original-label-two'},{text:'Delivery updates',Icon:Truck,position:'original-label-three'}].map(({text,Icon,position},i)=><motion.div key={text} className={'original-floating '+position} initial={false} animate={ready&&!reduced?{y:[0,-10,0]}:{y:0}} transition={{repeat:Infinity,duration:3+i,ease:'easeInOut',delay:i*.2}}><Icon size={18}/><span>{text}</span></motion.div>)}</div>
 </div></section>
}
function Steps(){
 const ref=useRef(null),reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start 70%','end 50%']});
 const width=useTransform(scrollYProgress,[0,1],['0%','100%']);
 return <section id="how" ref={ref} className="source-container source-section"><h2 className="reveal">From kitchen to your desk in 4 steps</h2><div className="original-steps-wrap"><div className="original-progress"><motion.div style={{width:reduced?'100%':width}}/></div><div className="original-steps">{steps.map(({Icon,title,description},i)=><motion.article key={title} initial={reduced?false:{rotateY:-60}} whileInView={{rotateY:0}} viewport={{once:true,amount:.2}} transition={{delay:i*.15,duration:.7}}><span className="original-step-icon"><Icon size={25}/></span><p className="original-step-number">STEP {i+1}</p><h3>{title}</h3><p>{description}</p></motion.article>)}</div></div></section>
}
function Calculator(){
 const [meals,setMeals]=useState(2),[days,setDays]=useState(22),reduced=useReducedMotion();
 const restaurant=meals*days*250,home=meals*days*110;
 return <section className="original-calculator"><div className="source-container original-two-column"><div className="reveal"><h2>How much could you save?</h2><p>Illustrative comparison: a ₹250 restaurant meal and a ₹110 home tiffin. Actual kitchen prices vary.</p><div className="original-range-fields"><Field label={'Meals per day: '+meals}><input type="range" min="1" max="3" value={meals} onChange={e=>setMeals(+e.target.value)}/></Field><Field label={'Days per month: '+days}><input type="range" min="5" max="30" value={days} onChange={e=>setDays(+e.target.value)}/></Field></div></div><TiltCard><div className="original-savings-card"><p>You’d spend on restaurants</p><strong className="original-old-price">{money(restaurant)}</strong><p>With HomeFeast</p><strong>{money(home)}</strong><div className="original-saving-highlight"><span>Monthly savings</span><motion.strong key={restaurant-home} initial={reduced?false:{scale:.8}} animate={{scale:1}}>{money(restaurant-home)}</motion.strong></div></div></TiltCard></div></section>
}
export default function OriginalHome({go}){
 return <main className="source-home"><Hero go={go}/><section className="source-container source-section"><h2 className="original-problem-heading reveal">Living away from home shouldn’t mean eating badly.</h2><div className="original-problems">{problems.map(({Icon,title,description})=><TiltCard key={title}><article className="original-problem-card reveal"><Icon size={25}/><h3>{title}</h3><p>{description}</p></article></TiltCard>)}</div></section><Steps/><HomeContent go={go} mode="featured"/><Calculator/><section className="source-container source-section original-two-column original-onboarding"><img className="reveal" src={cookImg} width="900" height="684" alt="Home cook packing fresh meals into tiffin boxes" loading="lazy"/><div className="reveal"><h2>Cook at home? Earn from your kitchen.</h2><p>Set your menu, prices and delivery area. Accept subscriptions and track earnings — we bring the customers.</p><ul><li>✓ Kitchen onboarding and admin approval</li><li>✓ Manage menu, pricing and requests online</li><li>✓ You decide timings and service area</li></ul><a href="/auth?mode=register&role=cook" className="btn green" onClick={e=>{e.preventDefault();go('/auth?mode=register&role=cook')}}>Register your kitchen</a></div></section><HomeContent go={go} mode="extra"/></main>
}

