const entry=document.querySelector('script[data-app]')?.dataset.app;
if(entry)requestAnimationFrame(()=>requestAnimationFrame(()=>{import(entry).catch(()=>{const message=document.createElement('p');message.setAttribute('role','alert');message.textContent='Interactive features could not load. Please refresh the page.';document.body.prepend(message)})}));
