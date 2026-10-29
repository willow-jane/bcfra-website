// Formspree endpoints (deliver to brazoscountyfirstresponders@gmail.com)
const FORMS = { remind: "https://formspree.io/f/mwllbzak", nominate: "https://formspree.io/f/mppprnog", contact: "https://formspree.io/f/xeaakwop" };
const DONATE_URL = "";

(function(){
  // refuse to be framed by other sites (GitHub Pages can't send X-Frame-Options)
  try{ if(/(^|\.)bcfra\.com$/.test(location.hostname) && window.top!==window.self){ document.documentElement.style.display='none'; window.top.location=window.self.location; } }catch(e){ document.documentElement.style.display='none'; }
  const yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
  // countdown to the Steak Dinner (Jan 22, 2027, local time)
  const d=document.getElementById('days-left');
  if(d){
    const target=new Date(2027,0,22); const now=new Date(); now.setHours(0,0,0,0);
    const n=Math.round((target-now)/86400000);
    if(n>1){d.textContent=n;}
    else if(n===1){d.textContent=1;d.nextElementSibling.textContent='day to go';}
    else if(n===0){d.textContent='Tonight';d.nextElementSibling.textContent='';}
    else {d.closest('.count').hidden=true;}
  }
  if(DONATE_URL){const b=document.getElementById('donate-btn');b.href=DONATE_URL;b.target='_blank';b.rel='noopener';}

  try{const pk=new URLSearchParams(location.search).get('pick'); const mp={steak:'r-steak',chili:'r-chili',bbq:'r-bbq',sponsor:'r-sponsor'}; if(pk&&mp[pk]){document.querySelectorAll('#remind-form input[name=events]').forEach(c=>c.checked=false); document.getElementById(mp[pk]).checked=true;}}catch(e){}
  // "Remind me" buttons preselect the right checkbox
  document.querySelectorAll('[data-pick]').forEach(a=>a.addEventListener('click',()=>{
    const map={steak:'r-steak',chili:'r-chili',bbq:'r-bbq',sponsor:'r-sponsor'};
    const el=document.getElementById(map[a.dataset.pick]); if(el){document.querySelectorAll('#remind-form input[name=events]').forEach(c=>c.checked=false); el.checked=true;}
    const rn=document.getElementById('r-name'); if(rn) setTimeout(()=>rn.focus({preventScroll:true}),450);
  }));

  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
    const t=document.getElementById(b.dataset.copy).textContent;
    const done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1600);};
    try{navigator.clipboard.writeText(t).then(done,()=>sel(b))}catch(e){sel(b)}
  }));
  function sel(b){const r=document.createRange();r.selectNodeContents(document.getElementById(b.dataset.copy));const s=getSelection();s.removeAllRanges();s.addRange(r);}

  function wire(formId,msgId,okText,FORM_ENDPOINT){
    const f=document.getElementById(formId), m=document.getElementById(msgId); if(!f) return;
    f.addEventListener('submit',async e=>{
      e.preventDefault();
      const missing=[...f.querySelectorAll('[required]')].filter(i=>!i.value.trim());
      const badEmail=[...f.querySelectorAll('input[type=email]')].filter(i=>i.value && !/^\S+@\S+\.\S+$/.test(i.value));
      const evs=f.querySelectorAll('input[name=events]'); if(evs.length && ![...evs].some(c=>c.checked)){m.hidden=false;m.textContent='Pick at least one event.';evs[0].focus();return;}
      if(missing.length||badEmail.length){
        m.hidden=false;
        m.textContent=missing.length?'Missing a few things: '+missing.map(i=>f.querySelector('label[for="'+i.id+'"]').firstChild.textContent.trim().replace(/[?.]$/,'')).join(', ')+'.':'Please check the email address.';
        (missing[0]||badEmail[0]).focus(); return;
      }
      const ts=f.querySelector('[name="cf-turnstile-response"]'); if(f.querySelector('.cf-turnstile') && /(^|\.)bcfra\.com$/.test(location.hostname) && (!ts||!ts.value)){m.hidden=false;m.textContent='One sec. Finish the quick security check above the button, then try again.';return;}
      if(!FORM_ENDPOINT){m.hidden=false;m.textContent=okText+' (Preview: once the site is live, this goes straight to the association\'s inbox.)';f.reset();return;}
      try{
        const r=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:new FormData(f)});
        if(!r.ok) throw 0;
        m.hidden=false;m.textContent=okText;f.reset(); try{ if(window.turnstile) turnstile.reset(f.querySelector('.cf-turnstile')); }catch(_){}
      }catch(_){m.hidden=false;m.textContent='That didn\'t go through. Please email brazoscountyfirstresponders@gmail.com instead.';}
    });
  }
  document.addEventListener('click',e=>{document.querySelectorAll('details.cal[open]').forEach(d=>{if(!d.contains(e.target))d.removeAttribute('open');});});
  // mobile menu
  const mb=document.getElementById('menu-btn'), nv=document.getElementById('main-nav');
  if(mb&&nv){ mb.addEventListener('click',()=>{const o=nv.classList.toggle('open'); mb.setAttribute('aria-expanded',o); mb.querySelector('.ml').textContent=o?'Close':'Menu';});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nv.classList.contains('open')){nv.classList.remove('open');mb.setAttribute('aria-expanded','false');mb.querySelector('.ml').textContent='Menu';mb.focus();}}); }
  // --- easter eggs ---
  try{console.log('%c★ BCFRA ★%c\n%cCode 4. All clear.','font:800 22px Georgia;color:#0d2141;background:#e9ae2f;padding:8px 14px;border-radius:6px','','font:700 15px Georgia;color:#e9ae2f;background:#0d2141;padding:6px 10px','\nSite built and maintained by Jane Doe, webmaster. Identity still unknown.\nYou opened the dev tools, so you are clearly the curious type. Nine things are hidden on this site. Field notes are kept in your browser.\nHint: the old cheat codes still work. So does holding down the badge.');}catch(e){}
  const now=new Date(), EOW=(now.getMonth()===7&&now.getDate()===13);
  const QUIET=/nominate|about/.test(location.pathname)||EOW;
  if(EOW){ const b=document.createElement('div'); b.className='eow-banner'; b.setAttribute('role','note'); b.textContent='Today we remember Constable Brian Bachmann, Brazos County Pct. 1. End of Watch: August 13, 2012.'; const h=document.querySelector('.top'); if(h) h.after(b); }
  // ---------- eggs: shared helpers ----------
  const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EGGS=['coin','dispatch','lights','thanks','food','radio','jane','shifts','night'];
  function found(id){ let s=[]; try{s=JSON.parse(localStorage.getItem('bcfra-field-notes')||'[]');}catch(e){} if(!Array.isArray(s))s=[]; if(!s.includes(id)){s.push(id); try{localStorage.setItem('bcfra-field-notes',JSON.stringify(s));}catch(e){}} return s.filter(x=>EGGS.includes(x)).length; }
  const hhmm=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0');};
  const hms=()=>{const d=new Date();return [d.getHours(),d.getMinutes(),d.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');};
  let lastToast=null;
  function toast(msg,ms,opt){ if(QUIET)return; opt=opt||{}; if(lastToast)lastToast.remove();
    const t=document.createElement('div'); t.className='radio'; t.setAttribute('role','status');
    const h=document.createElement('div'); h.className='radio-h'; h.innerHTML='<span class="radio-sig" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    const lab=document.createElement('span'); lab.textContent=(opt.from||'BCFRA Dispatch')+' · '+hhmm()+' hrs'; h.appendChild(lab);
    const m=document.createElement('p'); m.className='radio-m'; m.textContent=msg; t.append(h,m);
    if(opt.egg){ const n=found(opt.egg); const f=document.createElement('div'); f.className='radio-f'; f.textContent=n>=EGGS.length?'Field notes: all '+EGGS.length+' found. Jane Doe is impressed.':'Field notes: '+n+' of '+EGGS.length+' found'; t.appendChild(f); }
    document.body.appendChild(t); lastToast=t; requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add('in')));
    setTimeout(()=>{t.classList.remove('in'); setTimeout(()=>{t.remove(); if(lastToast===t)lastToast=null;},400);},ms||4600);
  }
  function overlay(cls,label){
    const o=document.createElement('div'); o.className='egg-ov '+cls; o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true'); o.setAttribute('aria-label',label);
    const prev=document.activeElement; let done=false;
    const esc=e=>{ if(e.key==='Escape')close(); else if(e.key==='Tab'){ const f=[...o.querySelectorAll('button,[tabindex="0"]')]; if(!f.length)return; const a=f[0], z=f[f.length-1]; if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();} } };
    function close(){ if(done)return; done=true; o.classList.remove('in'); document.removeEventListener('keydown',esc); document.body.classList.remove('lb-open'); o.dispatchEvent(new Event('egg-close')); setTimeout(()=>o.remove(),320); if(prev&&prev.focus)try{prev.focus({preventScroll:true});}catch(e){} }
    document.addEventListener('keydown',esc);
    o.addEventListener('click',e=>{ if(e.target===o)close(); });
    document.body.appendChild(o); document.body.classList.add('lb-open'); requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('in')));
    return {o,close};
  }
  const busy=()=>QUIET||!!document.querySelector('.egg-ov,.thanks');

  // ---------- lights ----------
  function lights(ms){if(QUIET)return;const b=document.createElement('div');b.className='lightbar';const w=document.createElement('div');w.className='lightwash';document.body.append(w,b);setTimeout(()=>{b.remove();w.remove();},ms||4000);}

  // ---------- food rain: falls, bounces, piles up, clears ----------
  let raining=false;
  function rain(items,n,ms){
    if(RM||raining||QUIET) return; raining=true;
    const c=document.createElement('canvas'); c.style.cssText='position:fixed;inset:0;z-index:102;pointer-events:none';
    const dpr=Math.min(window.devicePixelRatio||1,2), W=innerWidth, H=innerHeight; c.width=W*dpr; c.height=H*dpr; c.style.width=W+'px'; c.style.height=H+'px';
    document.body.appendChild(c); const g=c.getContext('2d'); g.scale(dpr,dpr); g.textAlign='center'; g.textBaseline='middle';
    const P=Array.from({length:n},()=>{const s=26+Math.random()*24; return {x:s+Math.random()*(W-2*s),y:-s-Math.random()*H*1.5,v:1.5+Math.random()*2.5,vx:(Math.random()-.5)*1.2,r:Math.random()*6.28,vr:(Math.random()-.5)*0.16,s,e:items[Math.floor(Math.random()*items.length)],floor:H-s*0.42-Math.random()*s*0.9,rest:false};});
    const t0=performance.now();
    (function f(t){const el=t-t0; g.clearRect(0,0,W,H); const a=el>ms-900?Math.max(0,(ms-el)/900):1;
      for(const q of P){
        if(!q.rest){ q.v+=0.12; q.y+=q.v; q.x+=q.vx; q.r+=q.vr;
          if(q.y>=q.floor){ q.y=q.floor; if(q.v>2.2){ q.v=-q.v*0.38; q.vr*=0.6; q.vx*=0.7; } else { q.rest=true; q.vr=0; q.r=Math.round(q.r/1.5708)*1.5708*0.08+q.r*0.92; } } }
        if(q.y<-q.s)continue;
        g.save(); g.globalAlpha=a; g.translate(q.x,q.y); g.rotate(q.r); g.font=q.s+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText(q.e,0,0); g.restore(); }
      if(el<ms) requestAnimationFrame(f); else {c.remove(); raining=false;} })(t0);
  }

  // ---------- challenge coin ----------
  const TOP='M23,100 a77,77 0 0,1 154,0', BOT='M15,100 a85,85 0 0,0 170,0';
  const ring=(id,top,bot)=>{ const t=(c,dx)=>'<g transform="translate('+dx+')"><text class="'+c+'"><textPath href="#'+id+'t" startOffset="50%" text-anchor="middle">'+top+'</textPath></text><text class="'+c+'"><textPath href="#'+id+'b" startOffset="50%" text-anchor="middle">'+bot+'</textPath></text><text class="'+c+'" x="15" y="103.5" text-anchor="middle">★</text><text class="'+c+'" x="185" y="103.5" text-anchor="middle">★</text></g>'; return '<defs><path id="'+id+'t" d="'+TOP+'"/><path id="'+id+'b" d="'+BOT+'"/></defs>'+t('coin-ring-hi','.55 .75')+t('coin-ring','0 0'); };
  function coin(){
    if(busy())return; const n=found('coin');
    const {o,close}=overlay('coin-ov','Challenge coin');
    o.innerHTML='<div class="coin-wrap">'+
      '<div class="coin-stage"><div class="coin-shadow"></div><div class="coin" tabindex="0" role="button" aria-label="Flip the coin">'+
        '<div class="coin-face coin-front"><div class="coin-rim"></div><svg viewBox="0 0 200 200" aria-hidden="true">'+ring('cf','BRAZOS COUNTY FIRST RESPONDERS','ASSOCIATION · EST. 2014')+'<circle cx="100" cy="100" r="67.5" fill="none" stroke="rgba(255,244,210,.7)" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.01 3.53" transform="translate(.5 .7)"/><circle cx="100" cy="100" r="67.5" fill="none" stroke="#5a3a05" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.01 3.53"/></svg><img src="img/badge.png" alt=""><div class="coin-spec"></div></div>'+
        '<div class="coin-face coin-back"><div class="coin-rim"></div><div class="coin-enamel"></div><svg viewBox="0 0 200 200" aria-hidden="true">'+ring('cb','DEPUTIES · OFFICERS · TROOPERS','FIRE · EMS · DISPATCH')+''+
          '<g fill="#05102a" transform="translate(0 1.2)" opacity=".8"><text x="100" y="74" class="coin-sm" text-anchor="middle">BRAZOS COUNTY</text><text x="100" y="98" class="coin-lg" text-anchor="middle">TAKES CARE</text><text x="100" y="120" class="coin-lg" text-anchor="middle">OF ITS OWN</text><text x="100" y="152" class="coin-sm" text-anchor="middle">★ ★ ★</text></g>'+
          '<g fill="#f5cd6a"><text x="100" y="74" class="coin-sm" text-anchor="middle">BRAZOS COUNTY</text><text x="100" y="98" class="coin-lg" text-anchor="middle">TAKES CARE</text><text x="100" y="120" class="coin-lg" text-anchor="middle">OF ITS OWN</text><text x="100" y="152" class="coin-sm" text-anchor="middle">★ ★ ★</text></g>'+
          '<rect x="68" y="130" width="32" height="3.2" rx="1.6" fill="#3d8bff" stroke="#f0c25a" stroke-width=".6"/><rect x="100" y="130" width="32" height="3.2" rx="1.6" fill="#ff4747" stroke="#f0c25a" stroke-width=".6"/></svg><div class="coin-spec"></div></div>'+
      '</div></div>'+
      '<p class="coin-k">Challenge coin · Drag or tap to flip</p>'+
      '<h2 class="coin-t">You’ve been coined.</h2>'+
      '<p class="coin-c">Challenge coins pass palm to palm in a handshake, a quiet thank-you for a job done right. This one is for backing the people who back Brazos County.</p>'+
      '<p class="coin-n"></p><button class="coin-x" type="button">Pocket it</button></div>';
    o.querySelector('.coin-n').textContent=n>=EGGS.length?'Field notes: all '+EGGS.length+' found':'Field notes: '+n+' of '+EGGS.length+' found';
    const stage=o.querySelector('.coin-stage'), c=o.querySelector('.coin');
    const D=stage.getBoundingClientRect().width||280, T=Math.max(7,Math.round(D*0.036)), NL=Math.max(10,T*2);
    const fr=o.querySelector('.coin-front'), bk=o.querySelector('.coin-back'), sh=o.querySelector('.coin-shadow');
    fr.style.transform='translateZ('+(T/2)+'px)'; bk.style.transform='rotateY(180deg) translateZ('+(T/2)+'px)';
    const edges=[]; for(let i=0;i<NL;i++){ const e=document.createElement('div'); e.className='coin-edge'; e.style.transform='translateZ('+(-T/2+0.4+i*(T-0.8)/(NL-1)).toFixed(2)+'px)'; c.insertBefore(e,fr); edges.push(e); }
    let ry=RM?0:-1080, rx=RM?0:18, target=0, drag=null, raf=0;
    const render=()=>{ c.style.transform='rotateX('+rx.toFixed(2)+'deg) rotateY('+ry.toFixed(2)+'deg)'; const a=((ry%360)+360)%360, rad=ry*Math.PI/180, cs=Math.cos(rad), sn=Math.sin(rad); c.style.setProperty('--sx',(a/3.6).toFixed(1)); c.style.setProperty('--hx',(38-sn*55).toFixed(1)); c.style.setProperty('--hy',(26-rx*1.2).toFixed(1)); fr.style.setProperty('--lit',(0.62+0.5*Math.max(0,cs)).toFixed(3)); bk.style.setProperty('--lit',(0.62+0.5*Math.max(0,-cs)).toFixed(3)); c.style.setProperty('--le',(0.55+0.6*Math.abs(sn)).toFixed(3)); sh.style.transform='scaleX('+Math.max(0.1,Math.abs(cs)).toFixed(3)+')'; c.setAttribute('aria-label',(a>90&&a<270)?'Coin, back side. Flip the coin':'Coin, front side. Flip the coin'); };
    const loop=()=>{ if(!drag){ ry+=(target-ry)*0.065; rx+=(Math.sin(performance.now()/900)*4-rx)*0.05; } render(); raf=requestAnimationFrame(loop); };
    const flip=()=>{ target=Math.round(ry/180)*180+180; if(RM){ry=target;render();} };
    if(RM)render(); else raf=requestAnimationFrame(loop);
    stage.addEventListener('pointerdown',e=>{ if(RM)return; drag={x:e.clientX,y:e.clientY,ry,t:performance.now(),last:e.clientX,v:0,moved:0}; stage.setPointerCapture(e.pointerId); stage.classList.add('grab'); });
    stage.addEventListener('pointermove',e=>{ if(!drag)return; const dx=e.clientX-drag.x; drag.moved=Math.max(drag.moved,Math.abs(dx)); drag.v=e.clientX-drag.last; drag.last=e.clientX; ry=drag.ry+dx*0.7; rx=Math.max(-25,Math.min(25,-(e.clientY-drag.y)*0.2)); });
    const up=()=>{ if(!drag)return; const d=drag; drag=null; stage.classList.remove('grab'); if(d.moved<6){flip();return;} target=Math.round((ry+d.v*14)/180)*180; };
    stage.addEventListener('pointerup',up); stage.addEventListener('pointercancel',up);
    if(RM) stage.addEventListener('click',flip);
    c.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '||e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault(); if(e.key==='ArrowLeft'){target=Math.round(ry/180)*180-180; if(RM){ry=target;render();}} else flip();} });
    o.querySelector('.coin-x').addEventListener('click',close);
    o.addEventListener('egg-close',()=>cancelAnimationFrame(raf));
    setTimeout(()=>c.focus({preventScroll:true}),60);
  }

  // ---------- dispatch / CAD log ----------
  let actx=null;
  function tones(){ try{ actx=actx||new (window.AudioContext||window.webkitAudioContext)(); const t=actx.currentTime, gn=actx.createGain(); gn.connect(actx.destination); gn.gain.setValueAtTime(0,t); gn.gain.linearRampToValueAtTime(0.045,t+0.03);
      [[853,0,.45],[960,.45,.9]].forEach(([fr,a,b])=>{ const os=actx.createOscillator(); os.type='sine'; os.frequency.value=fr; os.connect(gn); os.start(t+a); os.stop(t+b); });
      gn.gain.setValueAtTime(0.045,t+0.86); gn.gain.linearRampToValueAtTime(0,t+0.9); }catch(e){} }
  function cad(from){
    if(busy())return; found('dispatch');
    const {o,close}=overlay('cad-ov','Dispatch log');
    o.innerHTML='<div class="cad"><div class="cad-h"><span class="cad-dot" aria-hidden="true"></span><span>Brazos Co. CAD · Ch 1</span><span class="cad-clock"></span><button class="cad-x" type="button" aria-label="Close dispatch log">CLR</button></div><ol class="cad-log"></ol><div class="cad-units" aria-hidden="true"></div><p class="cad-sr" aria-live="polite"></p></div>';
    const log=o.querySelector('.cad-log'), units=o.querySelector('.cad-units'), clock=o.querySelector('.cad-clock'), sr=o.querySelector('.cad-sr');
    const U=['Sheriff','Police','Detention','Fire','EMS','Dispatch','Constable','Troopers','Vol. Fire'];
    const tiles=U.map(u=>{const d=document.createElement('div'); d.className='cad-u'; d.innerHTML='<b></b><span>DISP</span>'; d.firstChild.textContent=u.toUpperCase(); units.appendChild(d); return d;});
    const L=[
      ['tone','TONE ALERT · ALL STATIONS, ALL AGENCIES'],
      ['','CALL TYPE: COMMUNITY APPRECIATION · PRIORITY 1'],
      ['','LOCATION: BRAZOS COUNTY, TX · EVERY BEAT, EVERY DISTRICT'],
      ['','RP: YOUR NEIGHBORS. ALL OF THEM.'],
      ['','NARRATIVE: RP ADVISES THE COUNTY SEES YOU. THE NIGHTS, THE HOLIDAYS, THE CALLS YOU CARRY HOME.'],
      ['','RP REQUESTS ALL UNITS EAT SOMETHING, SLEEP WHEN YOU CAN, AND GO HOME SAFE.'],
      ['ok','DISPO: THANKED. NO FURTHER ACTION REQUIRED.'],
      ['ok',from==='yr'?'REPORT FILED IN TRIPLICATE. SUPERVISOR REVIEW IN 6 TO 8 WEEKS.':'ALL UNITS 10-8. CODE 4.'],
      ['sig','DISPATCH: THE FIRST FIRST RESPONDERS. THANK YOU, TOO.']];
    let alive=true, timers=[]; const later=(fn,ms)=>timers.push(setTimeout(()=>{if(alive)fn();},ms));
    const tick=()=>{ if(!alive)return; clock.textContent=hms(); timers.push(setTimeout(tick,1000)); }; tick();
    const status=(i,s)=>{ const tl=tiles[i]; if(!tl)return; tl.lastChild.textContent=s; tl.classList.toggle('av',s==='AVAIL'); };
    let li=0;
    function next(){
      if(li>=L.length){ sr.textContent='All units available. Code 4.'; return; }
      const [cls,txt]=L[li]; const row=document.createElement('li'); if(cls)row.className=cls;
      const tm=document.createElement('time'); tm.textContent=hms(); const sp=document.createElement('span'); row.append(tm,sp); log.appendChild(row);
      const step=li; li++;
      if(step===1) tiles.forEach((_,i)=>later(()=>status(i,'ENRT'),i*90));
      if(step===4) tiles.forEach((_,i)=>later(()=>status(i,'ON SCN'),i*110));
      if(step===7) tiles.forEach((_,i)=>later(()=>status(i,'AVAIL'),i*140));
      if(RM){ sp.textContent=txt; next(); return; }
      sp.classList.add('cur'); let k=0;
      (function type(){ if(!alive)return; k=Math.min(txt.length,k+2); sp.textContent=txt.slice(0,k); if(k<txt.length) later(type,22); else { sp.classList.remove('cur'); later(next,step===0?900:340); } })();
    }
    if(!RM) tones();
    later(next,RM?0:250);
    o.querySelector('.cad-x').addEventListener('click',close);
    o.addEventListener('egg-close',()=>{alive=false; timers.forEach(clearTimeout);});
    setTimeout(()=>o.querySelector('.cad-x').focus({preventScroll:true}),60);
  }

  // ---------- thank-you moment (thin blue + thin red line, rising embers) ----------
  function thanks(){
    if(busy())return; found('thanks');
    const o=document.createElement('div'); o.className='thanks'; o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true'); o.setAttribute('aria-label','Thank you');
    o.innerHTML='<canvas aria-hidden="true"></canvas><div class="thanks-c"><p class="thanks-k">From Brazos County</p><p class="thanks-t">To the ones who run toward&nbsp;it.<br><em>Thank you.</em></p><div class="thanks-line" aria-hidden="true"></div><p class="thanks-r"><span>Deputies</span><span>Officers</span><span>Detention Officers</span><span>Firefighters</span><span>Medics</span><span>Dispatchers</span><span>Troopers</span><span>Constables</span><span>Volunteers</span></p><button type="button" class="thanks-s">Return to duty</button></div>';
    document.body.appendChild(o); document.body.classList.add('lb-open');
    let alive=true, raf=0; const prev=document.activeElement;
    const close=()=>{ if(!alive)return; alive=false; cancelAnimationFrame(raf); o.classList.remove('in'); document.body.classList.remove('lb-open'); document.removeEventListener('keydown',key); setTimeout(()=>o.remove(),800); if(prev&&prev.focus)try{prev.focus({preventScroll:true});}catch(e){} };
    const key=e=>{ if(e.key==='Escape'||e.key==='Tab'){ if(e.key==='Escape')close(); else e.preventDefault(); } };
    document.addEventListener('keydown',key); o.addEventListener('click',close);
    requestAnimationFrame(()=>requestAnimationFrame(()=>o.classList.add('in')));
    setTimeout(()=>o.querySelector('.thanks-s').focus({preventScroll:true}),60);
    setTimeout(close,14000);
    if(RM)return;
    const cv=o.querySelector('canvas'), dpr=Math.min(window.devicePixelRatio||1,2), W=innerWidth, H=innerHeight; cv.width=W*dpr; cv.height=H*dpr; const g=cv.getContext('2d'); g.scale(dpr,dpr);
    const E=Array.from({length:Math.round(Math.min(110,W/9))},()=>({x:Math.random()*W,y:H+Math.random()*H,v:.25+Math.random()*.7,r:.6+Math.random()*2.2,p:Math.random()*6.28,s:.004+Math.random()*.01,c:Math.random()<.78?'233,174,47':(Math.random()<.5?'90,150,255':'255,90,90')}));
    (function f(){ if(!alive)return; g.clearRect(0,0,W,H);
      for(const e of E){ e.y-=e.v; e.p+=e.s*6; const x=e.x+Math.sin(e.p)*10; if(e.y<-10){e.y=H+10;e.x=Math.random()*W;}
        const a=Math.max(0,Math.min(1,e.y/H))*(0.55+0.45*Math.sin(e.p*2)); g.beginPath(); g.fillStyle='rgba('+e.c+','+a.toFixed(3)+')'; g.shadowColor='rgba('+e.c+',.9)'; g.shadowBlur=8; g.arc(x,e.y,e.r,0,6.283); g.fill(); }
      raf=requestAnimationFrame(f); })();
  }

  // ---------- Jane Doe, the webmaster ----------
  const jd=document.getElementById('jane-doe'), jn=document.getElementById('jd-note');
  const JD=["Webmaster identity: unknown. Last seen near the brisket, looking guilty.", "Witnesses describe the webmaster as \"cute, caffeinated and suspiciously good at CSS.\"", "Jane Doe has been written up for excessive use of the color gold. She regrets nothing.", "BOLO: one webmaster, answers to Jane, probably carrying a bar of handmade soap. Approach with snacks.", "Jane Doe opened a ticket to close a ticket. It is now pending her own approval.", "Jane Doe's to-do list has its own to-do list. Both are color-coded. Obviously.", "Last known location: a spreadsheet with 14 tabs and one perfectly named pivot table.", "Jane Doe was spotted rendering tallow at 2 AM. Investigators are choosing not to ask.", "Suspect is known to say \"quick question\" right before sharing her screen. Run.", "Jane Doe answered this call in 4 minutes. With an agenda. And action items. Bless.", "Prints lifted from the scene smell faintly of lavender, tallow and ambition.", "Jane Doe called for backup. Backup is a Gantt chart. It's doing great, thanks.", "Case file 10-4-JD: no leads, but the website is beautifully documented.", "Jane Doe has been caught playing the meow game during a traffic stop. Officer, what game?", "Witnesses report the webmaster fixed the DNS before the coffee finished brewing. Show-off.", "Jane Doe's alibi: \"I was studying.\" Her other alibi: \"I was also building a website.\"", "Suspect is armed with a label maker and should be considered dangerously organized.", "Jane Doe declined to comment. She has a soap batch curing and feelings about it.", "Jane Doe doesn't have a hobby. She has side quests. Several. All at once.", "Webmaster last seen leaving the chili tent with a ladle, a QR code and zero remorse.", "Jane Doe got a ticket for parking in the fire lane. She says she was \"just dropping off a cookie.\"", "Jane Doe wrote a book, launched a brand and built this site. She is now \"just resting her eyes.\"", "Status: In progress. Owner: Jane Doe. Due date: yesterday. Vibes: immaculate.", "Jane Doe's love language is a well-formatted email with a clear subject line.", "Jane Doe proofreads the press releases at home. He knows. He pretends he doesn't.", "Recovered search history: \"how long does tallow keep,\" \"DNS propagation,\" \"is 4 PM too late for coffee.\"", "Jane Doe escalated this issue to herself. She approved it. Efficiency.", "Jane Doe runs on coffee, deadlines and the occasional brisket. Mostly brisket.", "Webmaster spotted at the auction table, bidding on her own donation. Again. Allegedly.", "Shenanigans have been called on this website. Jane Doe denies all shenanigans. Mostly.", "Root cause analysis: Jane Doe said \"I can build that\" one more time.", "Jane Doe does not do rough drafts. She does Revision 4. Minimum.", "Jane Doe was dared to chug maple syrup at the diner. She ordered coffee like an adult.", "Field note: the webmaster can make deodorant, a dashboard and dinner before 6 PM. Witnesses are shook.", "She asked for the design to be \"crisp, clean and high-level.\" Nobody argued.", "Jane Doe is ITIL certified, so even this easter egg went through change management.", "Jane Doe rated this bug Priority 3. Then fixed it like it owed her money.", "Last seen on the couch watching COPS reruns, narrating every stop like a PIO.", "Jane Doe doesn't procrastinate. She lets ideas cure, like soap. Four to six weeks.", "Jane Doe requested this page be \"less word salad.\" Request granted. Salad removed.", "On COPS, the suspect always runs. Jane Doe walked. With a clipboard. And a plan.", "Witnesses say Jane Doe hums a certain reggae theme song every time the lights come on.", "Suspect described as barefoot in the front yard. Correction: that was the COPS episode she was watching.", "If found, return to the nearest Aggieland coffee shop. She knows the way. She has a usual.", "The webmaster built this whole website, then asked if the logo looked \"smooshed.\" It did. She was right.", "Jane Doe insists she can say meow in a sentence without anyone noticing. Meow. See?", "Jane Doe isn't bossy. She's \"aggressively helpful with a timeline.\"", "Jane Doe is not available. Please leave a message after the siren. WEE-OO.", "Case closed? Never. Jane Doe always has \"one more tiny change.\"", "Jane Doe's alibi: \"I was at the chili table.\" Seven witnesses and one ladle confirm."];
  // shuffled deck shared across pages: every note shows once before any repeats, in random order
  const jdNext=()=>{ let deck=[]; try{deck=JSON.parse(localStorage.getItem('bcfra-jd-deck')||'[]');}catch(e){} if(!Array.isArray(deck)||!deck.length){ deck=[...JD.keys()]; for(let i=deck.length-1;i>0;i--){const r=Math.floor(Math.random()*(i+1)); [deck[i],deck[r]]=[deck[r],deck[i]];} } const n=deck.shift(); try{localStorage.setItem('bcfra-jd-deck',JSON.stringify(deck));}catch(e){} return JD[(n>=0&&n<JD.length)?n:Math.floor(Math.random()*JD.length)]; };
  if(jn) jn.textContent=jdNext();
  let jdTimer=null;
  const jdShow=()=>{ if(RM){ jn.textContent=jdNext(); return; } jn.classList.add('jd-swap'); setTimeout(()=>{ jn.textContent=jdNext(); jn.classList.remove('jd-swap'); },220); };
  if(jd&&jn&&!EOW) jd.addEventListener('click',()=>{ if(!jn.hidden) jdShow(); jn.hidden=false; found('jane'); clearInterval(jdTimer); jdTimer=setInterval(()=>{ if(!document.hidden) jdShow(); },9000); });

  // ---------- footer badge: 5 taps = lights, then the thank-you; press and hold = challenge coin ----------
  const fb=document.getElementById('foot-badge'); let taps=0, tt, hold, held=false;
  if(fb){
    fb.addEventListener('pointerdown',()=>{ held=false; clearTimeout(hold); hold=setTimeout(()=>{held=true; taps=0; coin();},650); });
    ['pointerup','pointerleave','pointercancel'].forEach(ev=>fb.addEventListener(ev,()=>clearTimeout(hold)));
    fb.addEventListener('contextmenu',e=>e.preventDefault());
    fb.addEventListener('click',()=>{ if(held||busy())return; taps++; clearTimeout(tt); tt=setTimeout(()=>taps=0,1500);
      if(taps>=5){ taps=0; found('lights'); lights(3200); setTimeout(thanks,2900); } });
  }
  // Konami code = challenge coin
  const seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let k=0;
  document.addEventListener('keydown',e=>{ if(document.querySelector('.egg-ov'))return; k=(e.key===seq[k]||e.key.toLowerCase()===seq[k])?k+1:(e.key===seq[0]?1:0); if(k===seq.length){k=0;coin();} });
  // typed words
  let typed='';
  const R=(m,from)=>()=>toast(m,4600,{egg:'radio',from});
  const WORDS={
    'brisket':()=>{rain(['🥩','🍖','🥩','🔥'],70,6500);toast('Brisket detected. Dispatching a judge to your location.',4600,{egg:'food',from:'Pit Boss'});},
    'steak':()=>{rain(['🥩','🥩','🔪','🍽️'],60,6000);toast('Steak Dinner: January 22, 2027. Bring your appetite.',4600,{egg:'food',from:'Kitchen'});},
    'chili':()=>{rain(['🌶️','🌶️','🫕','🔥'],65,6000);toast('Chili Cookoff: January 23, 2027. Mild is not a category.',4600,{egg:'food',from:'Chili Tent'});},
    'bbq':()=>{rain(['🍖','🔥','🌭','🥩'],65,6000);toast('Smoke detected. This one is on purpose.',4600,{egg:'food',from:'Pit Boss'});},
    'code3':()=>{lights(4000);toast('Lights and sirens. Please pull to the right.',4600,{egg:'lights',from:'Unit 1'});},
    'coin':coin,
    'dispatch':()=>cad(),
    'tones':()=>cad(),
    'thank you':thanks,
    'thanks':thanks,
    'donut':R('The donut joke has been retired. Brisket is the new donut.'),
    '10-8':R('10-8. Back in service. Coffee refilled.'),
    'coffee':R('Coffee located. Morale restored to acceptable levels.','Break Room'),
    'overtime':R('Overtime approved. Just kidding. Talk to your sergeant.','Sergeant'),
    'quiet':R('We do not say the Q word. Now look what you did.'),
    'beans':R('Beans in chili? Take it up with the judges.','Chili Tent'),
    'gigem':R('Gig \'em. Now go buy a table.','Kyle Field'),
    'kurten':R('See you in Kurten, January 22.'),
    'turnout':R('Turnout gear optional. Boots required.','Station 1')
  };
  document.addEventListener('keydown',e=>{ if(e.target.closest&&e.target.closest('input,textarea,select'))return; if(e.metaKey||e.ctrlKey||e.altKey||e.key.length!==1)return; typed=(typed+e.key.toLowerCase()).slice(-12); for(const w in WORDS){ if(typed.endsWith(w)){ typed=''; WORDS[w](); break; } } });
  // countdown in shifts (24 on / 48 off)
  const cnt=document.querySelector('.ticket .count');
  if(cnt){ let st=0; cnt.addEventListener('click',ev=>{ev.preventDefault(); const d=document.getElementById('days-left'); const n=parseInt(d.dataset.days||d.textContent,10); if(isNaN(n))return; d.dataset.days=n; st=(st+1)%3; found('shifts'); if(st===1){d.textContent=Math.ceil(n/3); d.nextElementSibling.textContent='fire shifts to go';} else if(st===2){d.textContent=n*2; d.nextElementSibling.textContent='patrol shifts to go';} else {d.textContent=n; d.nextElementSibling.textContent='days to go';}}); }
  // mobile: tap the gold ticket date 3 times for steak rain
  const tdate=document.querySelector('.ticket .date'); let tdc=0, tdt;
  if(tdate) tdate.addEventListener('click',ev=>{ev.preventDefault(); tdc++; clearTimeout(tdt); tdt=setTimeout(()=>tdc=0,1200); if(tdc>=3){tdc=0; rain(['🥩','🍖','🌶️','🔥'],70,6500); toast('Order up. See you January 22 and 23.',4600,{egg:'food',from:'Kitchen'});}});
  // report in triplicate
  const yr2=document.getElementById('yr'); let yc=0;
  if(yr2) yr2.addEventListener('click',()=>{ if(++yc===3){yc=0;cad('yr');} });
  // night shift note (not on the nomination or memorial pages)
  const pg=location.pathname.split('/').pop();
  if(!/nominate|about/.test(pg)){ let h=new Date().getHours(); try{h=parseInt(new Intl.DateTimeFormat('en-US',{hour:'numeric',hourCycle:'h23',timeZone:'America/Chicago'}).format(new Date()),10)%24;}catch(e){} const night=(h>=18||h<6); let seen=false; try{seen=sessionStorage.getItem('bcfra-night')==='1'; if(night) sessionStorage.setItem('bcfra-night','1');}catch(e){} if(night&&!seen){ setTimeout(()=>toast('Working nights? The county sleeps because you don\'t. Thank you. Now go drink some water.',6500,{egg:'night',from:'Night Shift'}),2500); } }
  // photo viewer
  const gal=[...document.querySelectorAll('.gallery figure img')];
  if(gal.length){
    let lb=null, cur=0, sx=null;
    const show=i=>{cur=(i+gal.length)%gal.length; const im=lb.querySelector('.lb-stage img'); im.src=gal[cur].currentSrc||gal[cur].src; im.alt=gal[cur].alt; lb.querySelector('.lb-cap').textContent=gal[cur].alt; lb.querySelector('.lb-count').textContent=(cur+1)+' of '+gal.length;};
    const close=()=>{if(!lb)return; lb.remove(); lb=null; document.body.classList.remove('lb-open'); document.removeEventListener('keydown',key); gal[cur].parentElement.focus();};
    const key=e=>{if(e.key==='Escape')close(); else if(e.key==='ArrowRight')show(cur+1); else if(e.key==='ArrowLeft')show(cur-1);};
    const open=i=>{
      lb=document.createElement('div'); lb.className='lb'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label','Photo viewer');
      lb.innerHTML='<div class="lb-top"><span class="lb-count"></span><button type="button" class="lb-btn lb-close" aria-label="Close photo viewer">✕ Close</button></div><div class="lb-stage"><button type="button" class="lb-nav lb-prev" aria-label="Previous photo">‹</button><img alt=""><button type="button" class="lb-nav lb-next" aria-label="Next photo">›</button></div><p class="lb-cap"></p>';
      document.body.appendChild(lb); document.body.classList.add('lb-open');
      lb.querySelector('.lb-close').onclick=close; lb.querySelector('.lb-prev').onclick=()=>show(cur-1); lb.querySelector('.lb-next').onclick=()=>show(cur+1);
      lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('lb-stage'))close();});
      const st=lb.querySelector('.lb-stage'); st.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true}); st.addEventListener('touchend',e=>{if(sx===null)return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>45) show(cur+(dx<0?1:-1)); sx=null;});
      document.addEventListener('keydown',key); show(i); lb.querySelector('.lb-close').focus();
    };
    gal.forEach((im,i)=>{const f=im.parentElement; f.tabIndex=0; f.setAttribute('role','button'); f.setAttribute('aria-label','Expand photo: '+im.alt); f.addEventListener('click',()=>open(i)); f.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i);}});});
  }
  wire('remind-form','remind-msg','You\'re on the list. We\'ll holler when tickets and team entry open.',FORMS.remind);
  try{const tp=new URLSearchParams(location.search).get('topic'); const sel=document.getElementById('c-topic'); if(tp&&sel&&sel.querySelector('option[value="'+tp+'"]')) sel.value=tp;}catch(e){}
  wire('contact-form','contact-msg','Copy that. A board member will reply by email.',FORMS.contact);
  wire('nom-form','nom-msg','Received. A board member will reach out to you directly. Thank you for looking out for them.',FORMS.nominate);
})();
