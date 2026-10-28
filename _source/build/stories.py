# ---- Stories page + home feature ----
FB='https://www.facebook.com/BrazosCountyFirstResponders'
def src(label,url): return f'<a class="src" href="{url}" target="_blank" rel="noopener">{label}</a>'
stories_css='''
.story-feature{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,.65fr);gap:56px;align-items:start}
.story-kicker{font:700 .78rem/1 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--red);margin:0 0 14px}
.story-feature h2{font-size:clamp(2rem,4.4vw,3rem);margin:0 0 22px}
.story-body p{font-size:1.08rem;line-height:1.75;margin:0 0 18px}
.story-body p:first-of-type::first-letter{font:700 3.6em/.8 var(--display);float:left;margin:6px 10px 0 0;color:var(--gold-deep)}
.story-side{display:grid;gap:18px;position:sticky;top:96px}
.stat-card{background:var(--navy);color:#fff;border-radius:12px;padding:24px;display:grid;gap:18px}
.stat-card div{display:grid;gap:2px}
.stat-card b{font:700 2.2rem/1 var(--display);color:var(--gold)}
.stat-card span{color:#c9d4e6;font-size:.92rem}
.pull{margin:28px 0;padding:6px 0 6px 22px;border-left:4px solid var(--gold);font:600 clamp(1.3rem,2.6vw,1.6rem)/1.35 var(--display);color:var(--ink)}
.pull cite{display:block;margin-top:10px;font:600 .9rem/1.3 var(--body);font-style:normal;color:var(--muted)}
.story-src{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:8px;font-size:.88rem}
.stories-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.story-card{display:grid;gap:12px;align-content:start;padding:28px;border:1px solid var(--line);border-radius:12px;background:var(--bg);border-top:4px solid var(--blue)}
.story-card.fire{border-top-color:var(--red)}.story-card.gold{border-top-color:var(--gold)}
.story-card .yr{font:700 .75rem/1 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.story-card h3{font-size:1.45rem;margin:0}
.story-card p{color:var(--muted);margin:0;line-height:1.65}
.story-card blockquote{margin:4px 0 0;padding-left:14px;border-left:3px solid var(--gold);font:600 1.05rem/1.45 var(--display);color:var(--ink)}
.story-card blockquote cite{display:block;margin-top:6px;font:500 .82rem var(--body);font-style:normal;color:var(--muted)}
.story-card .src{font-size:.85rem}
.stories-close{text-align:center;max-width:640px;margin:0 auto}
.stories-close p{color:var(--muted)}
.stories-close .row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:18px}
.home-story{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:center;padding:32px;border-radius:14px;background:var(--navy);color:#fff}
.home-story .story-kicker{color:var(--gold)}
.home-story h2{color:#fff;font-size:clamp(1.6rem,3.4vw,2.2rem);margin:0 0 10px}
.home-story p{color:#c9d4e6;margin:0;max-width:62ch}
@media (max-width:900px){.story-feature{grid-template-columns:1fr;gap:32px}.story-side{position:static}.stories-grid{grid-template-columns:1fr}.home-story{grid-template-columns:1fr}}
'''
KB1='https://www.kbtx.com/2026/08/30/hundreds-gather-help-raise-money-college-station-firefighter-battling-cancer/'
KB2='https://www.kbtx.com/2026/08/31/college-station-firefighters-organize-5k-benefit-firefighter-battling-cancer/'
import os as _os
def ph(name,alt,cap=''):
    if not _os.path.exists(_os.path.join(OUT,'img',name)): return ''
    c=f'<figcaption>{cap}</figcaption>' if cap else ''
    return f'<figure class="st-photo"><img src="img/{name}" alt="{alt}" loading="lazy">{c}</figure>'
feature=f"""  <section aria-labelledby="grayson-title">
    <div class="wrap st-wrap">
      <article class="st-lead">
        <h2 id="grayson-title">Grayson Brock</h2>
        <p class="st-meta">College Station Fire Department · August 2026</p>
        {ph('story-grayson.jpg','Board member Jason Giles hands an iPad to Steve Brock, Grayson’s father','Board member Jason Giles delivers the iPad to Steve Brock, Grayson’s dad.')}
        <p class="st-from">From our Facebook page, August 20, 2026:</p>
        <blockquote class="st-post">
          <p>On a recent visit to see City of College Station Firefighter Grayson Brock at MD Anderson in The Woodlands, it was observed that Grayson arrives around 6:30 a.m. to begin his chemotherapy treatment. We noticed that there was also no television in the patient treatment area. To make matters more difficult, the chemotherapy Grayson is undergoing has made him particularly sensitive to light. With limited lighting in the room, he was unable to read his Bible, books, or magazines. Grayson does not leave treatment until approximately 4:30 p.m. each afternoon—far too long to sit without meaningful engagement.</p>
          <p>In response, the Brazos County First Responders Board voted to purchase an iPad for Grayson, allowing him to watch TV, read, or play games during his treatment. Pictured here is board member Jason Giles delivering this thoughtful gift to Steve, Grayson’s father and a recent retiree from CSPD, where he served as a lieutenant.</p>
        </blockquote>
        <p>Ten days later, 371 runners turned out for the Brock 5K at Brayton Fire Training Field, organized by CSFD Battalion Chief Jason Giles. Together with a silent auction and a profit share at the Angry Elephant, the community raised nearly $23,000 for the Brock family.</p>
        <p class="st-links">{src('Original post',FB)} · {src('KBTX coverage',KB1)}</p>
      </article>
    </div>
  </section>
"""
cards=f"""  <section class="about-extra" aria-labelledby="more-title">
    <div class="wrap st-wrap">
      <h2 id="more-title">More of our own</h2>

      <article class="st-item">
        <h3>Snuffy Smith and Angela Birdwell</h3>
        <p class="st-meta">May 2024</p>
        <p>While Angela was in treatment, the association joined Judge Kenny Elliott and Constable Jeff Reeves in a donation toward the family’s medical bills. Snuffy thanked everyone on Facebook:</p>
        <blockquote class="st-post"><p>“I would encourage anybody who wants to make an amazing, positive difference in a first responder’s life, to please consider donating to these great organizations. They take all of the funds and give them back directly to first responders in need here in the Brazos Valley.”</p></blockquote>
        <p class="st-links">{src('Snuffy’s post, May 13, 2024',FB)}</p>
      </article>

      <article class="st-item">
        <h3>Scholarships: Kyler Giles and Emily Brown</h3>
        <p class="st-meta">April 2025</p>
        <div class="st-pair">{ph('story-kyler.jpg','Kyler Giles receives his scholarship on stage')}{ph('story-emily.jpg','Emily Brown receives her scholarship on stage')}</div>
        <p>Constable Jeff Reeves presented two $1,500 Brian Bachmann Scholarships. Kyler Giles, son of CSFD Battalion Chief Jason Giles, is studying welding at Universal Technical Institute in Austin. Emily Brown, daughter of CSPD Lt. Tom Brown, is at Texas A&amp;M studying veterinary medicine and biomedical sciences.</p>
        <p class="st-links">{src('Jeff Reeves’s post, April 10, 2025',FB)}</p>
      </article>

      <article class="st-item">
        <h3>Scholarship: Hallie Sigler</h3>
        <p class="st-meta">May 2026</p>
        {ph('story-hallie.jpg','Hallie Sigler holds her scholarship check with BCFRA board members')}
        <p>Her mom, Monica, wrote to the association:</p>
        <blockquote class="st-post"><p>“Thank you so much for awarding Hallie Sigler this scholarship. We are incredibly grateful for your generosity, support, and investment in her future.”</p></blockquote>
        <p class="st-links">{src('Monica’s post, May 16, 2026',FB)}</p>
      </article>

      <article class="st-item">
        <h3>John Campbell’s family</h3>
        <p class="st-meta">May 2022</p>
        <p>John’s wife spent a month in the hospital with a life-threatening illness. He told 25 News that association members called him first, wanting to help with her costs.</p>
        <p class="st-links">{src('25 News',"https://www.kxxv.com/brazos/brazos-county-first-responder-association-bbq-fundraiser-helps-first-responders-in-need")}</p>
      </article>

      <article class="st-item">
        <h3>Trooper Chad Walker’s family</h3>
        <p class="st-meta">April 2021</p>
        <p>After DPS Trooper Chad Walker was killed in the line of duty, BCFRA presented his family a $1,000 check through Precinct 1 Constable Jeff Reeves.</p>
        <p class="st-links">{src('25 News',"https://www.kxxv.com/brazos/brazos-county-nonprofit-pledges-to-help-families-of-fallen-officers-including-the-walker-family")}</p>
      </article>

      <article class="st-item">
        <h3>Chief Deputy Constable Calder Lively</h3>
        <p class="st-meta">February 2021</p>
        <p>He was hurt in an icy crash on Highway 21 during Winter Storm Uri. BCFRA helped cover his expenses, including hotel stays.</p>
        <p class="st-links">{src('25 News',"https://www.kxxv.com/brazos/brazos-county-nonprofit-pledges-to-help-families-of-fallen-officers-including-the-walker-family")}</p>
      </article>
    </div>
  </section>

  <section aria-label="Nominate">
    <div class="wrap st-wrap st-close">
      <p>Every story here started with someone speaking up.</p>
      <a class="btn btn-gold" href="nominate-someone.html">Nominate a first responder</a>
    </div>
  </section>
"""
doc('stories.html','Stories: The first responders you have helped','How the Brazos County First Responders Association has stood behind Grayson Brock and other Brazos County first responders and their families.',
    page_head('Their stories','A few of the first responders and families we’ve been able to help, in their words and ours.','deputy.jpg')+feature+'\n'+cards)
home_story='''  <section aria-label="Featured story">
    <div class="wrap">
      <a class="home-story" href="stories.html" style="text-decoration:none">
        <div><p class="story-kicker">Their stories</p><h2>An iPad for Grayson</h2><p>College Station firefighter Grayson Brock spends ten-hour days in chemo with no TV and light too dim to read by. So the board voted to send him an iPad.</p></div>
        <span class="btn btn-gold">Read the stories</span>
      </a>
    </div>
  </section>

'''
