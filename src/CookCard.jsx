import React from 'react';
import thali from './assets/thali.webp';
import {money} from './shared.jsx';
import {TiltCard} from './Motion.jsx';
import {imageUrl} from './shared.jsx';
export default function CookCard({c,go,plan='daily'}){
 return <TiltCard><article className="kitchen-card"><a className="kitchen-card-link" href={'/cooks/'+c._id} aria-label={'View '+c.kitchen} onClick={e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();go('/cooks/'+c._id)}}><div className="kitchen-art"><img className={c.images?.length?'uploaded-cover':''} src={c.images?.length?imageUrl(c.images[0]):thali} alt="" width="1024" height="1024" loading="lazy"/><span className={c.demo?'status preview':'status approved'}>{c.demo?'Preview kitchen':'✓ Approved kitchen'}</span><span className="meal-badge">{c.mealType}</span></div><div className="kitchen-body"><div className="row"><span className="eyebrow">{c.cuisine}</span><span>★ {c.reviewCount?Number(c.rating).toFixed(1):'New'}</span></div><h3>{c.kitchen}</h3>{c.cookName&&<p className="cook-byline">By {c.cookName}</p>}<p>⌖ {c.area}, {c.city}</p><p className="clamp">{c.bio}</p><div className="row card-bottom"><div><strong>{money(c[plan])}</strong><small> / {plan==='daily'?'day':plan==='weekly'?'6 days':'26 days'}</small></div><span className="round-btn" aria-hidden="true">↗</span></div></div></a></article></TiltCard>
}
