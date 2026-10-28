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
  try{console.log('%cCode 4. All clear.','font:700 16px Georgia;color:#e9ae2f;background:#0d2141;padding:6px 10px','\nSite built and maintained by Jane Doe, webmaster. Identity still unknown.');}catch(e){}
  const now=new Date(), EOW=(now.getMonth()===7&&now.getDate()===13);
  const QUIET=/nominate|about/.test(location.pathname)||EOW;
  if(EOW){ const b=document.createElement('div'); b.className='eow-banner'; b.setAttribute('role','note'); b.textContent='Today we remember Constable Brian Bachmann, Brazos County Pct. 1. End of Watch: August 13, 2012.'; const h=document.querySelector('.top'); if(h) h.after(b); }
  function lights(ms){if(QUIET)return;const b=document.createElement('div');b.className='lightbar';const w=document.createElement('div');w.className='lightwash';document.body.append(w,b);setTimeout(()=>{b.remove();w.remove();},ms||4000);}
  const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raining=false;
  function rain(items,n,ms){
    if(RM||raining||QUIET) return; raining=true;
    const c=document.createElement('canvas'); c.style.cssText='position:fixed;inset:0;z-index:102;pointer-events:none';
    const dpr=Math.min(window.devicePixelRatio||1,2), W=innerWidth, H=innerHeight; c.width=W*dpr; c.height=H*dpr; c.style.width=W+'px'; c.style.height=H+'px';
    document.body.appendChild(c); const g=c.getContext('2d'); g.scale(dpr,dpr); g.textAlign='center'; g.textBaseline='middle';
    const P=Array.from({length:n},()=>({x:Math.random()*W,y:-40-Math.random()*H*0.9,v:2.4+Math.random()*3.6,r:Math.random()*6.28,vr:(Math.random()-.5)*0.18,s:26+Math.random()*26,e:items[Math.floor(Math.random()*items.length)],w:Math.random()*6.28}));
    const t0=performance.now();
    (function f(t){const el=t-t0; g.clearRect(0,0,W,H); let alive=0;
      for(const q of P){ q.y+=q.v; q.v+=0.04; q.r+=q.vr; q.w+=0.05; const x=q.x+Math.sin(q.w)*14;
        if(q.y<H+60){alive++; g.save(); g.globalAlpha=el>ms-600?Math.max(0,(ms-el)/600):1; g.translate(x,q.y); g.rotate(q.r); g.font=q.s+'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText(q.e,0,0); g.restore();}
        else if(el<ms-1500){q.y=-40; q.v=2.4+Math.random()*3.6; q.x=Math.random()*W;} }
      if(alive&&el<ms) requestAnimationFrame(f); else {c.remove(); raining=false;} })(t0);
  }
  function toast(msg,ms){if(QUIET)return;const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),ms||3500);}
  const jd=document.getElementById('jane-doe'), jn=document.getElementById('jd-note');
  const JD=['Webmaster identity: unknown. Case still open. Last seen near the brisket.',
    'Jane Doe was last seen leaving the chili tent with a ladle. If found, do not approach.',
    'Witnesses describe the webmaster as "average height, suspiciously good at CSS."',
    'Jane Doe has been placed on administrative leave for excessive use of the color gold.',
    'BOLO: one webmaster, answers to Jane, may be carrying a smoked sausage.',
    'Jane Doe declined to comment, citing an ongoing cookoff.',
    'Fingerprints lifted from this page belong to Jane Doe. Prints also found on the dessert table.',
    'Jane Doe is not available. Please leave a message after the siren.',
    'Last known location: the auction table, bidding on her own donation.',
    'Jane Doe responded to this call in 4 minutes. Average response time for a website is 3 seconds.',
    'Jane Doe has requested backup. Backup is at the steak line.',
    'Case file 10-4-JD: still no leads. The steak was excellent, though.',
    'Jane Doe was spotted at St. Nick\'s Green asking for "just a taste" at every pit.',
    'Jane Doe has been written up for parking in the fire lane. Again.',
    'Jane Doe\'s alibi: "I was at the chili table." Seven witnesses confirm.'];
  let jdi=Math.floor(Math.random()*JD.length);
  if(jn) jn.textContent=JD[jdi];
  if(jd&&jn) jd.addEventListener('click',()=>{ if(!jn.hidden){ jdi=(jdi+1+Math.floor(Math.random()*(JD.length-1)))%JD.length; jn.textContent=JD[jdi]; } jn.hidden=false; });
  const fb=document.getElementById('foot-badge'); let taps=0, tt;
  if(fb) fb.addEventListener('click',()=>{taps++;clearTimeout(tt);tt=setTimeout(()=>taps=0,1500);
    if(taps>=5){taps=0;lights(4000);toast('Lights on. Backing the blue and the red since 2014.');}});
  const seq=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']; let k=0;
  document.addEventListener('keydown',e=>{k=(e.key===seq[k]||e.key.toLowerCase()===seq[k])?k+1:(e.key===seq[0]?1:0); if(k===seq.length){k=0;toast('10-4, good buddy. All units report to the steak line.',4000);}});
  let typed='';
  const WORDS={
    'brisket':()=>{rain(['🥩','🍖','🥩','🔥'],70,6000);toast('Brisket detected. Dispatching a judge to your location.');},
    'steak':()=>{rain(['🥩','🥩','🔪','🍽️'],60,5500);toast('Steak Dinner: January 22, 2027. Bring your appetite.');},
    'chili':()=>{rain(['🌶️','🌶️','🫕','🔥'],65,5500);toast('Chili Cookoff: January 23, 2027. Mild is not a category.');},
    'bbq':()=>{rain(['🍖','🔥','🌭','🥩'],65,5500);toast('Smoke detected. This one is on purpose.');},
    'code3':()=>{lights(4000);toast('Lights and sirens. Please pull to the right.');},
    'tones':()=>toast('Tones dropped. Half the room is already walking to the truck.'),
    'donut':()=>toast('The donut joke has been retired. Brisket is the new donut.'),
    '10-8':()=>toast('10-8. Back in service. Coffee refilled.'),
    'coffee':()=>toast('Coffee located. Morale restored to acceptable levels.'),
    'overtime':()=>toast('Overtime approved. Just kidding. Talk to your sergeant.'),
    'quiet':()=>toast('We do not say the Q word. Now look what you did.'),
    'beans':()=>toast('Beans in chili? Take it up with the judges.'),
    'dispatch':()=>toast('Dispatch has entered the chat. Dispatch was always here.'),
    'gigem':()=>toast('Gig \'em. Now go buy a table.'),
    'kurten':()=>toast('See you in Kurten, January 22.'),
    'turnout':()=>toast('Turnout gear optional. Boots required.')
  };
  document.addEventListener('keydown',e=>{if(e.target.closest&&e.target.closest('input,textarea'))return; if(e.key.length!==1)return; typed=(typed+e.key.toLowerCase()).slice(-10); for(const w in WORDS){ if(typed.endsWith(w)){ WORDS[w](); typed=''; break; } }});
  // countdown in shifts (24 on / 48 off)
  const cnt=document.querySelector('.ticket .count');
  if(cnt){ let st=0; cnt.addEventListener('click',ev=>{ev.preventDefault(); const d=document.getElementById('days-left'); const n=parseInt(d.dataset.days||d.textContent,10); if(isNaN(n))return; d.dataset.days=n; st=(st+1)%3; if(st===1){d.textContent=Math.ceil(n/3); d.nextElementSibling.textContent='fire shifts to go';} else if(st===2){d.textContent=n*2; d.nextElementSibling.textContent='patrol shifts to go';} else {d.textContent=n; d.nextElementSibling.textContent='days to go';}}); }
  // mobile: tap the gold ticket date 3 times for steak rain
  const tdate=document.querySelector('.ticket .date'); let tdc=0, tdt;
  if(tdate) tdate.addEventListener('click',ev=>{ev.preventDefault(); tdc++; clearTimeout(tdt); tdt=setTimeout(()=>tdc=0,1200); if(tdc>=3){tdc=0; rain(['🥩','🍖','🌶️','🔥'],70,6000); toast('Order up. See you January 22 and 23.');}});
  // report in triplicate
  const yr2=document.getElementById('yr'); let yc=0;
  if(yr2) yr2.addEventListener('click',()=>{ if(++yc===3){yc=0;toast('Report filed in triplicate. Supervisor will review in 6 to 8 weeks.');} });
  // night shift note (not on the nomination or memorial pages)
  const pg=location.pathname.split('/').pop();
  if(!/nominate|about/.test(pg)){ const h=new Date().getHours(); if(h>=1&&h<5){ setTimeout(()=>toast('Working the night shift? Thank you. Go drink some water.',5000),2500); } }
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
