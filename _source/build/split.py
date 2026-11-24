import re, os, sys
BASE=os.path.dirname(os.path.abspath(__file__))
SRC=os.path.join(BASE,'..','site','index.html')
OUT=sys.argv[1]
s=open(SRC).read()
head_end=s.index('</style>')+len('</style>')
head=s[:head_end]
def block(start_pat, end_tag='</section>'):
    a=s.index(start_pat); b=s.index(end_tag,a)+len(end_tag); return s[a:b]
hero=block('  <section class="hero"')
ticket=s[s.index('  <div class="ticket-row">'):s.index('  <section id="story"')]
story=block('  <section id="story"')
helpsec=block('  <section class="help"')
events=block('  <section id="events"')
remind=block('  <section class="remind"')
photos=block('  <section aria-labelledby="photos-title">')
supporters=block('  <section class="supporters"')
nominate=block('  <section id="nominate"')
give=block('  <section class="give"')
footer=s[s.index('<footer id="contact">'):s.index('</footer>')+len('</footer>')]
_si=s.index('<script>'); script=s[_si:s.index('</script>',_si)+len('</script>')]

# split history out of events; agencies out of help
h_a=events.index('      <div class="history">'); h_b=events.index('      </div>\n    </div>\n  </section>',h_a)
history=events[h_a:h_b]+'      </div>\n'
events=events[:h_a]+events[h_b+len('      </div>\n'):]
ag_a=helpsec.index('      <div class="agencies">'); ag_b=helpsec.index('      </div>\n    </div>\n  </section>',ag_a)
agencies=helpsec[ag_a:ag_b]+'      </div>\n'
helpsec=helpsec[:ag_a]+helpsec[ag_b+len('      </div>\n'):]

extra_css='''
/* multi-page additions */
.nav a[aria-current="page"]{background:rgba(255,255,255,.12)}
.page-head{background:var(--band);color:var(--band-ink);padding-block:clamp(48px,7vw,84px) clamp(40px,6vw,64px);position:relative;overflow:hidden}
.page-head::before{content:"";position:absolute;inset:0;background:var(--ph) center/cover no-repeat;opacity:.22;filter:saturate(.5)}
.page-head::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--band) 35%,rgba(13,33,65,.6))}
.page-head .wrap{position:relative;z-index:1;display:grid;gap:14px}
.page-head h1{font-size:clamp(2.4rem,5.4vw,4rem);color:#fff}
.page-head p{color:#c9d4e6;font-size:1.15rem;max-width:58ch}
.up-list{list-style:none;margin:0;padding:0;border-top:2px solid var(--ink)}
.up-list li{display:grid;grid-template-columns:190px minmax(0,1fr);gap:6px 24px;padding:16px 0;border-bottom:1px solid var(--line)}
.up-list time{font:700 1.05rem/1.4 var(--display);color:var(--blue)}
.up-list a{font-weight:700}
.up-list span{color:var(--muted)}
@media (max-width:640px){.up-list li{grid-template-columns:1fr}}
.more{margin-top:28px}
.cta-band{background:var(--surface);border-top:1px solid var(--line)}
.cta-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.cta{display:grid;gap:12px;align-content:start;padding:30px;border-radius:12px;border:1px solid var(--line);background:var(--bg)}
.cta.dark{background:var(--navy);border-color:var(--navy);color:#fff}
.cta.dark p{color:#c9d4e6}
.cta p{color:var(--muted)}
.cta .btn{justify-self:start;margin-top:4px}
@media (max-width:760px){.cta-grid{grid-template-columns:1fr}}
.about-extra{background:var(--surface);border-block:1px solid var(--line)}
.about-extra .agencies{margin-top:0}
.history-sec .history{margin-top:0;border-top:0;padding-top:0}
'''+open(os.path.join(BASE,'stories.css')).read()
head=head.replace('</style>', extra_css+'</style>')

NAV=[('about.html','About'),('stories.html','Stories'),('news.html','News'),('events.html','Events'),('nominate-someone.html','Nominate'),('get-involved.html','Get involved'),('contact.html','Contact')]
def header(cur):
    links='\n'.join(f'      <a href="{h}"'+(' aria-current="page"' if h==cur else '')+f'>{t}</a>' for h,t in NAV)
    return f'''<header class="top">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Brazos County First Responders Association, home">
      <img src="img/badge.png" alt="" width="44" height="48">
      <span><b>Brazos County First Responders</b><small>Association, est. 2014</small></span>
    </a>
    <button type="button" class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="main-nav"><span class="ml">Menu</span><span class="bars" aria-hidden="true"><i></i><i></i><i></i></span></button>
    <nav class="nav" id="main-nav" aria-label="Main">
{links}
      <a class="btn btn-gold" href="events.html#reminders">Remind me</a>
    </nav>
  </div>
</header>
'''
def relink(html, page):
    R={'href="#events"':'href="events.html"','href="#nominate"':'href="nominate-someone.html"','href="#give"':'href="get-involved.html"',
       'href="#story"':'href="about.html"','href="#steak-dinner"':'href="events.html#steak-dinner"','href="#top"':'href="index.html"'}
    if page!='events.html': R['href="#reminders"']='href="events.html#reminders"'
    for a,b in R.items(): html=html.replace(a,b)
    return html
def page_head(title,lede,photo):
    return f'''  <section class="page-head" style="--ph:url(/img/{photo})">
    <div class="wrap">
      <h1>{title}</h1>
      <p>{lede}</p>
    </div>
  </section>
'''
def strip_head(sec):  # remove the section's own sec-head block (title now in page-head)
    return re.sub(r'\n      <div class="sec-head">.*?\n      </div>\n','\n',sec,count=1,flags=re.S)
import datetime as _dt
DAYS=max(0,(_dt.date(2027,1,22)-_dt.date.today()).days)
def doc(fname,title,desc,body):
    h=head
    full=f'{title} | Brazos County First Responders Association' if fname!='index.html' else 'Brazos County First Responders Association | Bryan-College Station, TX'
    h=h.replace('<title>Brazos County First Responders Association</title>',f'<title>{full}</title>')
    h=re.sub(r'<meta name="description" content="[^"]*">',f'<meta name="description" content="{desc}">',h)
    url='https://bcfra.com/'+('' if fname=='index.html' else fname.replace('.html',''))
    h=h.replace('<link rel="canonical" href="https://bcfra.com/">',f'<link rel="canonical" href="{url}">').replace('<meta property="og:url" content="https://bcfra.com/">',f'<meta property="og:url" content="{url}">')
    h=h.replace('<meta property="og:title" content="Brazos County First Responders Association">',f'<meta property="og:title" content="{full}">')
    h=h.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
    h=re.sub(r'<meta property="og:description" content="[^"]*">',f'<meta property="og:description" content="{desc}">\n<meta property="og:site_name" content="Brazos County First Responders Association">\n<meta name="twitter:card" content="summary_large_image">',h)
    h='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+h+'\n</head>\n<body>'
    if fname in ('events.html','get-involved.html'):
        body=body.replace('<h3 class="poster-title"','<h2 class="poster-title"').replace('</small>Steak Dinner Fundraiser</h3>','</small>Steak Dinner Fundraiser</h2>').replace('</small>Chili Cookoff</h3>','</small>Chili Cookoff</h2>').replace('</small>BBQ Cookoff</h3>','</small>BBQ Cookoff</h2>')
        for t in ('Give directly','Put your name on the night','Give something to bid on'): body=body.replace(f'<h3>{t}</h3>',f'<h2>{t}</h2>')
    out=h+'\n\n'+header(fname)+'\n<main id="top">\n'+relink(body,fname)+'</main>\n\n'+relink(footer,fname)+'\n\n'+script+'\n</body>\n</html>\n'
    out=out.replace("const f=document.getElementById(formId), m=document.getElementById(msgId);","const f=document.getElementById(formId), m=document.getElementById(msgId); if(!f) return;")
    out=out.replace("setTimeout(()=>document.getElementById('r-name').focus({preventScroll:true}),450);","const rn=document.getElementById('r-name'); if(rn) setTimeout(()=>rn.focus({preventScroll:true}),450);")
    out=out.replace('<b id="days-left">86</b>',f'<b id="days-left">{DAYS}</b>')
    out=out.replace('img/badge.png" alt="" width="44"','img/badge-sm.png" alt="" width="44"').replace('img/badge.png" alt="" width="62"','img/badge-sm.png" alt="" width="62"').replace('img/badge.png" alt="" width="64"','img/badge-sm.png" alt="" width="64"').replace('img/badge.png" alt="" width="72"','img/badge-sm.png" alt="" width="72"')
    # --- security hardening: move inline CSS/JS to files, add CSP ---
    st=re.search(r'<style>(.*?)</style>',out,re.S); sc=re.search(r'<script>(.*?)</script>',out,re.S)
    os.makedirs(os.path.join(OUT,'css'),exist_ok=True); os.makedirs(os.path.join(OUT,'js'),exist_ok=True)
    open(os.path.join(OUT,'css','site.css'),'w').write(st.group(1).strip()+'\n')
    open(os.path.join(OUT,'js','site.js'),'w').write(sc.group(1).strip()+'\n')
    import hashlib as _h; _v=_h.md5((st.group(1)+sc.group(1)).encode()).hexdigest()[:8]
    out=out.replace(st.group(0),f'<link rel="stylesheet" href="css/site.css?v={_v}">').replace(sc.group(0),f'<script src="js/site.js?v={_v}"></script>')
    CSP=("default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
         "font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src https://formspree.io https://challenges.cloudflare.com; "
         "form-action https://formspree.io; base-uri 'self'; object-src 'none'; frame-src https://challenges.cloudflare.com; manifest-src 'self'; upgrade-insecure-requests")
    if 'cf-turnstile' in out:
        out=out.replace('</head>','<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>\n</head>',1)
    sec=(f'<meta http-equiv="Content-Security-Policy" content="{CSP}">\n'
         '<meta name="referrer" content="strict-origin-when-cross-origin">\n'
         '<meta http-equiv="X-Content-Type-Options" content="nosniff">\n'
         '<meta name="format-detection" content="telephone=no">\n')
    out=out.replace('<meta name="viewport"',sec+'<meta name="viewport"',1)
    open(os.path.join(OUT,fname),'w').write(out)

teasers='''  <section aria-labelledby="up-title">
    <div class="wrap">
      <div class="sec-head">
        <h2 id="up-title">Upcoming events</h2>
      </div>
      <ul class="up-list">
        <li><time>Fri, Jan 22, 2027</time><div><a href="events.html#steak-dinner">4th Annual Steak Dinner</a><br><span>Kurten Community Center. Tickets on sale. Boots encouraged.</span></div></li>
        <li><time>Sat, Jan 23, 2027</time><div><a href="events.html#chili-cookoff">3rd Annual Chili Cookoff</a><br><span>Kurten Community Center. Agency teams, one pot each. Mild is not a category.</span></div></li>
        <li><time>2027, date TBA</time><div><a href="events.html#bbq-cookoff">Annual BBQ Cookoff</a><br><span>St. Nick's Green, College Station. Badge vs. badge. Brisket decides.</span></div></li>
      </ul>
      <div class="more"><a class="btn btn-navy" href="events.html#reminders">Remind me</a></div>
    </div>
  </section>

'''
cta='''  <section class="cta-band" aria-label="Get involved">
    <div class="wrap cta-grid">
      <div class="cta dark">
        <h2 style="font-size:2rem">Know someone who needs help?</h2>
        <p>If a Brazos County first responder is hurt, sick or struggling, tell us. Confidential. Self-nominations welcome.</p>
        <a class="btn btn-gold" href="nominate-someone.html">Nominate a first responder</a>
      </div>
      <div class="cta">
        <h2 style="font-size:2rem">Be their backup</h2>
        <p>Donate, sponsor a table, or give an auction item.</p>
        <a class="btn btn-navy" href="get-involved.html">Ways to give</a>
      </div>
    </div>
  </section>

'''
exec(open(os.path.join(BASE,'stories.py')).read())
# Home
doc('index.html','Home','Since 2014, the Brazos County First Responders Association has supported local first responders facing line-of-duty injury, illness and other hardships, and funded scholarships for their children.',
    hero+'\n'+ticket+helpsec+'\n\n'+teasers+photos+'\n\n'+cta)

helped_sec='''  <section class="about-extra" aria-labelledby="helped-title">
    <div class="wrap">
      <div class="sec-head">
        <h2 id="helped-title">Who you've helped</h2>
        <p class="lede">Grayson Brock, Snuffy and Angela, the Walker family, our scholarship winners and more.</p>
      </div>
      <p><a class="btn btn-navy" href="stories.html">Read their stories</a></p>
    </div>
  </section>

  <section aria-labelledby="news-title">
    <div class="wrap">
      <div class="sec-head"><h2 id="news-title">In the news</h2><p class="lede">Local TV and news coverage of our fundraisers and the first responders we've helped.</p></div>
      <p><a class="btn btn-navy" href="news.html">See all news coverage</a></p>
    </div>
  </section>
'''
# About
about_body=page_head('About BCFRA','A 501(c)(3) started in 2014 by Brazos County first responders, in memory of Constable Brian Bachmann.','hall.jpg')+story.replace('<section id="story"','<section id="story" style="padding-top:clamp(56px,7vw,88px)"')+'\n\n'+ \
  f'  <section class="about-extra" aria-label="Agencies">\n    <div class="wrap">\n{agencies}    </div>\n  </section>\n\n'+ \
  f'  <section class="history-sec" aria-label="History">\n    <div class="wrap">\n{history}    </div>\n  </section>\n'+helped_sec
doc('about.html','About us: In memory of Constable Brian Bachmann','How the Brazos County First Responders Association began in memory of Constable Brian Bachmann, and the agencies it supports.',about_body)
news_body=page_head('In the news','Local news coverage of BCFRA and the first responders we’ve helped, newest first.','friends.jpg')+'''  <section aria-labelledby="n1-title">
    <div class="wrap" style="max-width:900px">
      <h2 id="n1-title" style="font-size:1.8rem;margin-bottom:18px">About BCFRA and our events</h2>
      <ul class="news">
        <li><span>KBTX, Jan 27, 2024</span><a href="https://www.kbtx.com/2024/01/27/inaugural-chili-cook-off-raises-money-brazos-county-first-responders/" target="_blank" rel="noopener">Inaugural chili cook-off raises money for Brazos County first responders</a></li>
        <li><span>KBTX, Jan 20, 2024</span><a href="https://www.kbtx.com/2024/01/20/chili-cookoff-steak-dinner-benefit-brazos-county-first-responders/" target="_blank" rel="noopener">Chili Cookoff and Steak Dinner to benefit Brazos County first responders</a></li>
        <li><span>KAGS, Jan 2024</span><a href="https://www.kagstv.com/article/entertainment/events/brazos-county-first-responders-association-first-annual-chili-cook-off-jan-27-2024/499-559268ee-484b-4a52-9851-0aa70216ffa9" target="_blank" rel="noopener">Brazos County First Responders Association to host first annual chili cook off on Jan. 27</a></li>
        <li><span>KBTX, Jan 14, 2024</span><a href="https://www.kbtx.com/2024/01/14/chili-cookoff-steak-dinner-benefit-brazos-county-first-responders-association/" target="_blank" rel="noopener">Chili cookoff and steak dinner to benefit Brazos County First Responders Association</a></li>
        <li><span>KBTX, Jun 4, 2023</span><a href="https://www.kbtx.com/2023/06/04/brazos-county-first-responders-association-raises-money-families-first-responders-need/" target="_blank" rel="noopener">Brazos County First Responders Association raises money for families of first responders in need</a></li>
        <li><span>KBTX, Jun 3, 2023</span><a href="https://www.kbtx.com/2023/06/03/annual-brazos-county-first-responders-association-cookoff-returns-saturday/" target="_blank" rel="noopener">Annual Brazos County First Responders Association cookoff returns Saturday</a></li>
        <li><span>25 News, May 2022</span><a href="https://www.kxxv.com/brazos/brazos-county-first-responder-association-bbq-fundraiser-helps-first-responders-in-need" target="_blank" rel="noopener">BBQ fundraiser helps first responders in need</a></li>
        <li><span>25 News, May 2021</span><a href="https://kxxv.com/brazos/bcfra-hosts-7th-annual-bbq-cookoff-fundraiser-raising-thousands" target="_blank" rel="noopener">BCFRA hosts 7th annual BBQ cookoff fundraiser, raising thousands</a></li>
        <li><span>KBTX, May 16, 2021</span><a href="https://www.kbtx.com/2021/05/16/brazos-county-first-responders-bbq-cookoff-returns-after-missing-2020/" target="_blank" rel="noopener">Brazos County First Responders BBQ Cookoff returns after missing 2020</a></li>
        <li><span>25 News, Apr 2021</span><a href="https://www.kxxv.com/brazos/brazos-county-nonprofit-pledges-to-help-families-of-fallen-officers-including-the-walker-family" target="_blank" rel="noopener">Brazos County nonprofit pledges to help families of fallen officers, including the Walker family</a></li>
      </ul>
      <h2 style="font-size:1.8rem;margin:48px 0 18px">About first responders we’ve helped</h2>
      <p style="color:var(--muted);margin-bottom:12px">Grayson Brock, College Station Fire Department. <a href="stories.html">Read his story</a>.</p>
      <ul class="news">
        <li><span>KBTX, Aug 31, 2026</span><a href="https://www.kbtx.com/2026/08/31/college-station-firefighters-organize-5k-benefit-firefighter-battling-cancer/" target="_blank" rel="noopener">College Station firefighters organize 5k to benefit firefighter battling cancer</a></li>
        <li><span>KBTX, Aug 30, 2026</span><a href="https://www.kbtx.com/2026/08/30/hundreds-gather-help-raise-money-college-station-firefighter-battling-cancer/" target="_blank" rel="noopener">Hundreds gather to help raise money for College Station firefighter battling cancer</a></li>
        <li><span>KBTX, Aug 6, 2026</span><a href="https://www.kbtx.com/2026/08/06/first-responders-community-rally-behind-college-station-firefighter-battling-cancer/" target="_blank" rel="noopener">First responders, community rally behind College Station firefighter battling cancer</a></li>
      </ul>
      <p class="fine" style="margin-top:28px;font-size:.95rem">Know of a story we missed? <a href="contact.html?topic=media">Send us the link</a>.</p>
    </div>
  </section>
'''
doc('news.html','In the news','Local news coverage of the Brazos County First Responders Association, its fundraisers and the first responders it has helped.',news_body)
# Events
doc('events.html','Steak Dinner Jan 22, Chili Cookoff Jan 23, Kurten','Steak Dinner, Chili Cookoff and BBQ Cookoff: upcoming Brazos County First Responders Association fundraisers, tickets and reminders.',
    page_head('Come hungry.','The Steak Dinner and Chili Cookoff are in January and the BBQ Cookoff later in the year. The money pays for help for first responders and scholarships for their kids.','stage.jpg')+strip_head(events)+'\n\n'+remind+'\n')
# Nominate
doc('nominate-someone.html','Nominate a first responder','Nominate a Brazos County first responder facing illness, injury or hardship for assistance from the BCFRA.',
    page_head('Nominate a first responder','Tell us who needs help. The board reviews every request in confidence.','speaker.jpg')+nominate.replace('<h2 id="nom-title">Nominate a first responder</h2>','<h2 id="nom-title">How it works</h2>')+'\n')
# Get involved
doc('get-involved.html','Donate or sponsor','Donate, sponsor an event, or give an auction item to support Brazos County first responders.',
    page_head('Back them up.','Give money, sponsor the Steak Dinner, or donate an auction item.','tables.jpg')+strip_head(give)+'\n\n'+supporters.replace('<section class="supporters"','<section class="supporters" id="supporters"')+'\n')

contact_body=page_head('Call it in.','Questions about tickets, cookoff teams, sponsorships or auction items. A board member will reply.','group.jpg')+'''  <section aria-labelledby="ct-title">
    <div class="wrap nominate-grid">
      <div>
        <h2 id="ct-title">Email, call or use the form</h2>
        <p class="lede" style="margin-top:16px">The form and the email both go to the board's inbox.</p>
        <ul class="facts" style="margin-top:28px">
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg><span><a href="mailto:brazoscountyfirstresponders@gmail.com">brazoscountyfirstresponders@gmail.com</a></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg><span><a href="tel:+19792290100">(979) 229-0100</a></span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg><span>4773 Holm Oak Rd, College Station, TX 77845</span></li>
          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 3h-3a4 4 0 0 0-4 4v3H5v4h3v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg><span><a href="https://www.facebook.com/BrazosCountyFirstResponders" target="_blank" rel="noopener">Facebook</a></span></li>
        </ul>
        <p class="fine" style="margin-top:22px">Need help for a first responder? Use the <a href="nominate-someone.html">nomination form</a> so the board can review it confidentially.</p>
      </div>
      <form class="form" id="contact-form" novalidate>
        <input type="hidden" name="_subject" value="New message from bcfra.com"><input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px">
        <div class="row2">
          <div class="field"><label for="c-name">Your name</label><input id="c-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="c-mail">Email</label><input id="c-mail" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="row2">
          <div class="field"><label for="c-tel">Phone <span class="hint">(optional)</span></label><input id="c-tel" name="phone" type="tel" autocomplete="tel"></div>
          <div class="field"><label for="c-topic">Topic</label>
            <select id="c-topic" name="topic">
              <option value="general">General question</option>
              <option value="sponsorship">Sponsorship</option>
              <option value="donation">Donation</option>
              <option value="auction">Auction or raffle item</option>
              <option value="tickets">Steak Dinner tickets</option>
              <option value="team">Cookoff team entry</option>
              <option value="volunteer">Volunteering</option>
              <option value="media">Media</option>
            </select>
          </div>
        </div>
        <div class="field"><label for="c-msg">Message</label><textarea id="c-msg" name="message" required></textarea></div>
        <div class="cf-turnstile" data-sitekey="0x4AAAAAAFqAYsAjF7eMCc8U" data-theme="auto" data-size="flexible"></div>
        <button class="btn btn-navy" type="submit">Send it</button>
        <div class="form-msg" id="contact-msg" role="status" hidden></div>
      </form>
    </div>
  </section>
'''
doc('contact.html','Contact us','Contact the Brazos County First Responders Association about sponsorships, donations, auction items, cookoff teams or general questions.',contact_body)
# sponsors redirect
open(os.path.join(OUT,'sponsors.html'),'w').write('<!doctype html><meta charset="utf-8"><title>Sponsors | BCFRA</title><meta http-equiv="refresh" content="0; url=get-involved.html#supporters"><link rel="canonical" href="https://bcfra.com/get-involved"><p><a href="get-involved.html#supporters">Our supporters</a></p>\n')
# clean URLs: /events instead of events.html (GitHub Pages serves both)
import re, glob
for f in glob.glob(os.path.join(OUT,'*.html')):
    t=open(f).read()
    t=re.sub(r'(href="|url=)index\.html', r'\1/', t)
    t=re.sub(r'(href="|url=)([a-z0-9-]+)\.html', r'\1/\2', t)
    open(f,'w').write(t)
print('ok')
