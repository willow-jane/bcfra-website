# ---- Stories page ----
FB='https://www.facebook.com/BrazosCountyFirstResponders'
def src(label,url): return f'<a class="src" href="{url}" target="_blank" rel="noopener">{label}</a>'
KB1='https://www.kbtx.com/2026/08/30/hundreds-gather-help-raise-money-college-station-firefighter-battling-cancer/'
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
        <p class="st-links">{src('BCFRA on Facebook',FB)} · {src('KBTX coverage',KB1)}</p>
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
        <p class="st-links">{src('BCFRA on Facebook',FB)} (Snuffy’s post, May 13, 2024)</p>
      </article>

      <article class="st-item">
        <h3>Scholarships: Kyler Giles and Emily Brown</h3>
        <p class="st-meta">April 2025</p>
        <div class="st-pair">{ph('story-kyler.jpg','Kyler Giles receives his scholarship on stage')}{ph('story-emily.jpg','Emily Brown receives her scholarship on stage')}</div>
        <p>Constable Jeff Reeves presented two $1,500 Brian Bachmann Scholarships. Kyler Giles, son of CSFD Battalion Chief Jason Giles, is studying welding at Universal Technical Institute in Austin. Emily Brown, daughter of CSPD Lt. Tom Brown, is at Texas A&amp;M studying veterinary medicine and biomedical sciences.</p>
        <p class="st-links">{src('BCFRA on Facebook',FB)} (Jeff Reeves’s post, April 10, 2025)</p>
      </article>

      <article class="st-item">
        <h3>Scholarship: Hallie Sigler</h3>
        <p class="st-meta">May 2026</p>
        {ph('story-hallie.jpg','Hallie Sigler holds her scholarship check with BCFRA board members')}
        <p>Her mom, Monica, wrote to the association:</p>
        <blockquote class="st-post"><p>“Thank you so much for awarding Hallie Sigler this scholarship. We are incredibly grateful for your generosity, support, and investment in her future.”</p></blockquote>
        <p class="st-links">{src('BCFRA on Facebook',FB)} (Monica’s post, May 16, 2026)</p>
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
      <p>To ask for help for someone, use the nomination form.</p>
      <a class="btn btn-gold" href="nominate-someone.html">Nominate a first responder</a>
    </div>
  </section>
"""
doc('stories.html','Stories: The first responders you have helped','How the Brazos County First Responders Association has stood behind Grayson Brock and other Brazos County first responders and their families.',
    page_head('Their stories','A few of the first responders and families we’ve been able to help, in their words and ours.','deputy.jpg')+feature+'\n'+cards)
