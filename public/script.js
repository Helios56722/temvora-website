(() => {
const menuButton=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
const setMenu=(open,restore=false)=>{if(!menuButton||!nav)return;menuButton.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);if(restore)menuButton.focus();};
menuButton?.addEventListener('click',()=>setMenu(menuButton.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('is-open'))setMenu(false,true);});
document.addEventListener('click',e=>{if(nav?.classList.contains('is-open')&&!e.target.closest('.site-header'))setMenu(false);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
const mobileQuery=matchMedia('(max-width:850px)');mobileQuery.addEventListener('change',()=>setMenu(false));
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
let paused=reduced.matches;
try{const preference=localStorage.getItem('temvora-motion');if(preference==='paused')paused=true;}catch{}
const canvas=document.getElementById('starfield'),ctx=canvas?.getContext('2d');
let raf=0,w=0,h=0,lastDraw=0;const stars=Array.from({length:45},(_,i)=>({x:((Math.sin(i*73.1+1)+1)/2),y:((Math.cos(i*91.7+2)+1)/2),r:i%7===0?1.4:.65,phase:i*.83}));
function draw(time=0){if(!ctx)return;ctx.clearRect(0,0,w,h);const count=w<600?24:45;stars.slice(0,count).forEach((s,i)=>{const a=.14+.32*(.5+.5*Math.sin(time/4900+s.phase));ctx.fillStyle='rgba(220,192,234,'+a+')';ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();if(i%13===0){ctx.strokeStyle='rgba(214,172,230,'+(a*.6)+')';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(s.x*w-3,s.y*h);ctx.lineTo(s.x*w+3,s.y*h);ctx.moveTo(s.x*w,s.y*h-3);ctx.lineTo(s.x*w,s.y*h+3);ctx.stroke();}});}
function tick(t){if(paused||document.hidden)return;if(t-lastDraw>70){draw(t);lastDraw=t;}raf=requestAnimationFrame(tick);}
function sync(){cancelAnimationFrame(raf);document.documentElement.classList.toggle('motion-paused',paused);window.dispatchEvent(new CustomEvent('temvora:motion')); document.querySelectorAll('.motion-toggle').forEach(b=>{b.setAttribute('aria-pressed',String(paused));b.querySelector('span').textContent=paused?'Resume ambience':'Pause ambience';});if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);else draw(0);}
function resize(){if(!canvas||!ctx)return;w=innerWidth;h=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw(0);}
addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});document.querySelectorAll('.motion-toggle').forEach(b=>b.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('temvora-motion',paused?'paused':'running');}catch{}sync();}));resize();sync();
const dateInput=document.querySelector('input[type=date]');if(dateInput){const now=new Date();const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');dateInput.min=today;}
document.querySelectorAll('.smart-form').forEach(form=>{
 const result=form.querySelector('.form-result');let draft='';
 const kind=form.dataset.kind;
 const chosenPackage=new URLSearchParams(location.search).get('package');
 const knownPackages=[...form.querySelectorAll('input[name=service]')].map(input=>input.value);
 const chosenSample=new URLSearchParams(location.search).get('sample');
 const knownSamples=new Map([['Form','FORM Architecture'],['Forme','FORM Architecture'],['After Hours','After Hours listening room'],['Terra','Terra Objects']]);
 const chosenIntent=new URLSearchParams(location.search).get('intent');
 const knownIntents=new Map([['web','Websites & advertising'],['documents','Document creation'],['it','IT support'],['systems','IT support'],['care','IT support']]);
 if(kind==='project'){
  const reference=knownPackages.includes(chosenPackage)?chosenPackage:(knownSamples.get(chosenSample)||knownIntents.get(chosenIntent));
  if(reference){const note=document.createElement('p');note.className='notice';note.textContent='Your starting point: '+reference+'. I’ll use this when preparing your quote.';form.before(note);const requestedService=knownPackages.includes(chosenPackage)?chosenPackage:(knownIntents.get(chosenIntent)||'Websites & advertising');form.querySelectorAll('input[name=service]').forEach(input=>input.checked=input.value===requestedService);}
 }
 const labels={name:'Name',email:'Email',business:'Business',service:'Help requested',budget:'Budget range',timing:'Ideal timing',category:'Category',impact:'Impact',date:'Preferred date',time:'Preferred time',timezone:'Time zone',details:kind==='project'?'Project brief':kind==='support'?'Issue details':'Discussion'};
 const titles={project:'Project inquiry',support:'Support request',consultation:'Consultation request'};
 form.addEventListener('input',()=>{result.hidden=true;form.querySelectorAll('input[name=service]').forEach(i=>i.setCustomValidity(''));});
 form.addEventListener('submit',e=>{
  e.preventDefault();
  if(kind==='project'&&!form.querySelector('input[name=service]:checked')){const first=form.querySelector('input[name=service]');first.setCustomValidity('Choose at least one type of help.');first.reportValidity();return;}
  if(!form.reportValidity())return;
  const data=new FormData(form),lines=['TemVora — '+titles[kind],''];
  if(kind==='project'&&knownPackages.includes(chosenPackage))lines.push('Package: '+chosenPackage,'');
  if(kind==='project'&&knownSamples.get(chosenSample))lines.push('Design reference: '+knownSamples.get(chosenSample),'');
  Object.entries(labels).forEach(([name,label])=>{const values=data.getAll(name).map(String).map(s=>s.trim()).filter(Boolean);if(values.length)lines.push(label+': '+values.join(', '),'');});
  if(kind==='consultation')lines.push('Preferred time requested; subject to confirmation.');
  draft=lines.join('\n');
  result.querySelector('.draft-preview').textContent=draft;
  const subject='TemVora | '+titles[kind];
  result.querySelector('.email-draft').href='mailto:tkjet718@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(draft);
  result.querySelector('.gmail-draft').href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent('tkjet718@gmail.com')+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(draft);
  result.querySelector('.mail-length-note').hidden=draft.length<1500;
 result.hidden=false;result.focus({preventScroll:true});result.scrollIntoView({behavior:paused?'instant':'smooth',block:'nearest'});
 });
 form.querySelector('.copy-draft')?.addEventListener('click',async()=>{if(!draft)return;const status=result.querySelector('.copy-status'),button=result.querySelector('.copy-draft');try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(draft);else{const area=document.createElement('textarea');area.value=draft;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();if(!document.execCommand('copy'))throw new Error('copy failed');area.remove();}status.textContent='Copied. Paste the request into any email or message.';button.textContent='Copied';setTimeout(()=>button.textContent='Copy request',2200);}catch{status.textContent='Copy was blocked by your browser. Select the request above, or use Gmail or the download option.';}});
 form.querySelector('button[type=submit]').disabled=false;
 form.querySelector('.download-draft')?.addEventListener('click',()=>{if(!draft)return;const blob=new Blob([draft],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='TemVora-'+kind+'-draft.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
});
const legacy={'#services':'/services/','#portfolio':'/portfolio/','#about':'/about/','#pricing':'/pricing/','#request':'/request/','#support':'/support/','#faq':'/faq/','#contact':'/contact/','#resources':'/resources/'};
if(location.pathname==='/'&&legacy[location.hash])location.replace(legacy[location.hash]);
})();
