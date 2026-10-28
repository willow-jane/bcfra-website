# bcfra.com source

The live site is plain static files at the repo root, served by GitHub Pages.
Everything is generated from this folder. Do not hand-edit the root .html files.

- `site/index.html` – master source: all CSS, the home/events/give/nominate/contact sections, and all JS (forms, Turnstile, easter eggs, lightbox, calendar).
- `build/split.py` – splits the master into pages, adds nav, page heads, CSP, clean URLs, and writes `css/site.css` + `js/site.js`.
- `build/stories.py` + `build/stories.css` – the Stories page (bcfra.com/stories). Add new stories here.

Rebuild from the repo root:

    python3 _source/build/split.py .

Then commit and push to `main`; GitHub Pages deploys in about a minute.

Rules for content: clean, concise copy. Only add facts that are dated and verifiable (Facebook post or news link). Easter eggs stay off the About and Nominate pages and on Aug 13. Photos go in `img/` (resize to about 1100px, JPEG q≈82). Update `sitemap.xml` when adding a page.
