// Builds the static site into ./site (the folder you drag onto Netlify).
// No dependencies: `node build.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BIZ, SOCIAL, JOBBER_EMBED, PRICES as $, POLICY, PHOTOS, PROOF, img } from './src/config.mjs';
import { CITIES } from './src/cities.mjs';
import { LEGAL } from './src/legal.mjs';

const OUT = 'site';
const YEAR = new Date().getFullYear();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = (n) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
const cityUrl = (c) => `/carpet-cleaning-${c.slug}/`;
const telHref = `tel:${BIZ.tel}`;

// ---------- icons ----------
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
const ICON = {
  phone: svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  check: svg('<path d="M20 6 9 17l-5-5"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  message: svg('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  minus: svg('<path d="M5 12h14"/>'),
  close: svg('<path d="M18 6 6 18M6 6l12 12"/>'),
};
const brandIcon = (name) => {
  const raw = fs.readFileSync(`static/icons/${name}.svg`, 'utf8');
  const d = raw.match(/ d="([^"]+)"/)[1];
  return `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
};

// ---------- images ----------
const srcset = (key, sizes) => sizes.map(([w, h]) => `${img(key, w, h)} ${w}w`).join(', ');
const picture = (key, { sizes, set, w, h, eager = false, cls = '' }) =>
  `<img class="${cls}" src="${img(key, set.at(-1)[0], set.at(-1)[1])}" srcset="${srcset(key, set)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(PHOTOS[key].alt)}"${PHOTOS[key].pos ? ` style="object-position:${PHOTOS[key].pos}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

// ---------- shared pieces ----------
const logo = (extra = '') => `<a class="logo" href="/" aria-label="${BIZ.name}, home" ${extra}><span class="logo-lines" aria-hidden="true"><i></i><i></i><i></i></span><span class="logo-word" aria-hidden="true">PRISTINE</span></a>`;

const NAV = [
  ['Services', '/#services'],
  ['Pricing', '/pricing/'],
  ['Service areas', '/#areas'],
  ['Get a quote', '/pricing/#quote'],
];

const header = (active) => `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr">
  <div class="wrap hdr-in">
    ${logo()}
    <nav class="hdr-nav" aria-label="Main">
      ${NAV.map(([t, h]) => `<a href="${h}"${active === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
    </nav>
    <a class="btn btn-ice hdr-call" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
    <button class="menu-btn" type="button" aria-haspopup="dialog" aria-controls="menu" data-menu-open>
      <span>Menu</span><span class="menu-bars" aria-hidden="true"><i></i><i></i><i></i></span>
    </button>
  </div>
</header>
<dialog id="menu" class="menu" aria-label="Site menu">
  <div class="wrap menu-top">
    ${logo()}
    <button class="menu-close" type="button" data-menu-close autofocus>Close ${ICON.close}</button>
  </div>
  <nav class="wrap menu-nav" aria-label="Mobile">
    <a href="/">Home</a>
    ${NAV.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}
  </nav>
  <div class="wrap menu-areas">
    <p>Service areas</p>
    <ul>${CITIES.map((c) => `<li><a href="${cityUrl(c)}">${c.name}</a></li>`).join('')}</ul>
  </div>
  <div class="wrap menu-foot">
    <a class="btn btn-ice btn-lg btn-block" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
    <p>${BIZ.hoursLabel}</p>
  </div>
</dialog>`;

const socialLinks = () => {
  const labels = { instagram: 'Instagram', facebook: 'Facebook', tiktok: 'TikTok', yelp: 'Yelp' };
  const set = Object.entries(SOCIAL).filter(([, url]) => url);
  if (!set.length) return '';
  return `<ul class="social">${set.map(([k, url]) => `<li><a href="${esc(url)}" rel="noopener" target="_blank" aria-label="${labels[k]}">${brandIcon(k)}</a></li>`).join('')}</ul>`;
};

const footer = () => `
<footer class="ftr">
  <div class="wrap ftr-grid">
    <div class="ftr-brand">
      ${logo()}
      <p>Residential carpet, upholstery and tile cleaning for Houston and the surrounding cities.</p>
      ${socialLinks()}
    </div>
    <div>
      <h2>Services</h2>
      <ul>
        <li><a href="/#services">Carpet cleaning</a></li>
        <li><a href="/#services">Upholstery cleaning</a></li>
        <li><a href="/#services">Tile & grout cleaning</a></li>
        <li><a href="/pricing/">Pricing & Pristine Club</a></li>
      </ul>
    </div>
    <div>
      <h2>Service areas</h2>
      <ul>${CITIES.map((c) => `<li><a href="${cityUrl(c)}">${c.name}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h2>Contact</h2>
      <ul>
        <li><a href="${telHref}">${BIZ.phone}</a></li>
        ${BIZ.email ? `<li><a href="mailto:${BIZ.email}">${BIZ.email}</a></li>` : ''}
        <li>${BIZ.hoursLabel}</li>
        <li><a href="/pricing/#quote">Request a quote</a></li>
      </ul>
    </div>
  </div>
  <div class="wrap ftr-legal">
    <p>© ${YEAR} ${BIZ.name}. Houston, TX.</p>
    <ul>
      <li><a href="/terms/">Terms & Conditions</a></li>
      <li><a href="/service-agreement/">Service Agreement</a></li>
      <li><a href="/privacy/">Privacy Policy</a></li>
    </ul>
  </div>
</footer>
<div class="mbar" role="region" aria-label="Quick contact">
  <a class="btn btn-navy" href="${telHref}">${ICON.phone}<span>Call</span></a>
  <a class="btn btn-ice" href="/pricing/#quote">Get a quote</a>
</div>`;

const BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${BIZ.domain}/#business`,
  name: BIZ.name,
  url: `${BIZ.domain}/`,
  telephone: BIZ.tel,
  ...(BIZ.email ? { email: BIZ.email } : {}),
  image: img('hero', 1200, 630),
  logo: `${BIZ.domain}/assets/icon-512.svg`,
  priceRange: '$$',
  openingHours: BIZ.hoursSchema,
  address: { '@type': 'PostalAddress', addressLocality: 'Houston', addressRegion: 'TX', addressCountry: 'US' },
  areaServed: CITIES.map((c) => ({ '@type': 'City', name: `${c.name}, TX` })),
  sameAs: Object.values(SOCIAL).filter(Boolean),
  makesOffer: [
    { '@type': 'Offer', name: `${$.specialRooms} Room Special`, price: $.specialPrice, priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Pristine Club membership', price: $.club, priceCurrency: 'USD', description: 'Per month. Four seasonal deep cleanings a year.' },
  ],
};

const faqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

const crumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${BIZ.domain}${url}` })),
});

let ASSET_V = '';

const layout = ({ url, title, description, body, schema = [], active = '', og = img('hero', 1200, 630), noindex = false }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${BIZ.domain}${url}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${BIZ.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${BIZ.domain}${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0D1F44">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/icon-512.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preconnect" href="https://images.pexels.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@800&text=PRISTINE&display=block">
<link rel="stylesheet" href="/assets/styles.css?v=${ASSET_V}">
<script src="/assets/site.js?v=${ASSET_V}" defer></script>
${[BUSINESS_SCHEMA, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;

// ---------- reusable sections ----------
const stripes = (cls = '') => `<div class="stripes ${cls}" aria-hidden="true"><i></i><i></i><i></i></div>`;

const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([t, h], i) => (i === items.length - 1
  ? `<span aria-current="page">${esc(t)}</span>`
  : `<a href="${h}">${esc(t)}</a><span aria-hidden="true">/</span>`)).join('')}</nav>`;

const ctaPair = (ghostLabel = 'Get a free quote', ghostHref = '/pricing/#quote') => `
<div class="cta-row">
  <a class="btn btn-ice btn-lg" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
  <a class="btn btn-ghost btn-lg" href="${ghostHref}"><span>${ghostLabel}</span>${ICON.arrow}</a>
</div>`;

// prices set as display type: [number, bold line, small line]
const heroOffer = (items) => `<div class="hero-offer">${items.map(([n, a, b]) => `<p><strong class="num">${n}</strong><span><b>${a}</b>${b}</span></p>`).join('')}</div>`;

// shared by home, pricing and city pages: navy, the photo bleeding off the right edge at the logo's lean
const hero = ({ id, top = '', h1, offer, lede, photo, cta = ctaPair() }) => `
<section class="hero" aria-labelledby="${id}">
  <figure class="hero-photo">${picture(photo, { eager: true, w: 1000, h: 900, sizes: '(min-width: 960px) 50vw, 100vw', set: [[640, 480], [1000, 900], [1400, 1260]] })}</figure>
  <div class="wrap hero-in">
    <div class="hero-copy">
      ${top}
      <h1 id="${id}">${h1}</h1>
      ${offer}
      <p class="hero-lede">${lede}</p>
      ${cta}
    </div>
  </div>
  ${stripes('hero-stripes')}
</section>`;

const factStrip = () => {
  const facts = [
    PROOF.rating && `<a href="${esc(PROOF.rating.url)}" rel="noopener" target="_blank"><strong>${PROOF.rating.score.toFixed(1)} stars</strong> from ${PROOF.rating.count} Google reviews</a>`,
    '<span><strong>Hot water extraction</strong> in every room</span>',
    '<span><strong>Price confirmed</strong> before we start</span>',
    `<span><strong>Houston</strong> + ${CITIES.length - 1} nearby cities</span>`,
    `<span><strong>${BIZ.hoursLabel}</strong></span>`,
  ].filter(Boolean).slice(0, 4);
  return `<div class="strip"><ul class="wrap strip-in">${facts.map((f) => `<li>${f}</li>`).join('')}</ul></div>`;
};

const SERVICES = [
  { key: 'carpet', title: 'Carpet cleaning', text: 'Bedrooms, living rooms, stairs and closets. We pull out the ground-in dirt, pet hair and spills that vacuuming leaves behind.', price: money($.specialPrice), unit: `for ${$.specialRooms} rooms`, note: `then ${money($.room)} per room, closets included` },
  { key: 'upholstery', title: 'Upholstery cleaning', text: 'Sofas, sectionals, chairs and ottomans. We check the fabric first so it comes out clean, not soaked.', price: money($.sofa), unit: 'per sofa', note: `chairs and ottomans ${money($.chair)}` },
  { key: 'tile', title: 'Tile & grout cleaning', text: 'Kitchens, entries and bathrooms. Saltillo, porcelain or ceramic, we rinse the grime out of the grout lines.', price: money($.tileSqft), unit: 'per sq ft', note: `${money($.minimum)} visit minimum` },
];

const services = () => `
<section class="sec-l" id="services" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="head">
      <h2 id="svc-h" class="h-feat">What we clean</h2>
      <p class="lede">One visit can cover the bedrooms, the couch and the kitchen floor. You get one clear price for all of it.</p>
    </div>
    <ul class="rates">
      ${SERVICES.map((s) => `
      <li class="rate">
        <figure class="rate-img">${picture(s.key, { w: 720, h: 480, sizes: '(min-width: 960px) 34vw, 100vw', set: [[480, 320], [720, 480], [1000, 667]] })}</figure>
        <div class="rate-body"><h3>${s.title}</h3><p>${s.text}</p></div>
        <p class="rate-price"><strong class="num">${s.price}</strong><span>${s.unit}</span><small>${s.note}</small></p>
      </li>`).join('')}
    </ul>
  </div>
</section>`;

const offerBand = (heading = 'Two easy ways to book') => `
<section class="sec sec-navy offers-band" aria-labelledby="offers-h">
  ${stripes('stripes-r band-stripes')}
  <div class="wrap">
    <div class="head">
      <h2 id="offers-h" class="h-feat">${heading}</h2>
      <p class="lede">Start with the special, or join the club and keep your floors on a schedule all year.</p>
    </div>
    <div class="offers">
      <article class="offer">
        <h3>${$.specialRooms} Room Special</h3>
        <p class="offer-price"><strong class="num">${money($.specialPrice)}</strong><span>one visit</span></p>
        <ul class="ticks">
          <li>${ICON.check}${$.specialRooms} carpeted rooms, deep cleaned</li>
          <li>${ICON.check}Walk-in closets included</li>
          <li>${ICON.check}Extra rooms ${money($.room)} each</li>
        </ul>
        <a class="btn btn-ice" href="/pricing/#quote"><span>Get the ${money($.specialPrice)} special</span>${ICON.arrow}</a>
      </article>
      <article class="offer offer-club">
        <h3>Pristine Club</h3>
        <p class="offer-price"><strong class="num">${money($.club)}</strong><span>per month</span></p>
        <ul class="ticks">
          <li>${ICON.check}4 seasonal deep cleanings a year</li>
          <li>${ICON.check}50% off additional services</li>
          <li>${ICON.check}Priority and same-day booking</li>
          <li>${ICON.check}Refer a friend, your next cleaning is free</li>
        </ul>
        <p class="offer-fine">Cancel anytime. <a href="/service-agreement/">Club terms</a></p>
        <a class="btn btn-navy" href="/pricing/#club"><span>See club details</span>${ICON.arrow}</a>
      </article>
    </div>
  </div>
</section>`;

const faqList = (faqs, id = 'faq-h', heading = 'Questions we hear a lot') => `
<section class="sec sec-tint" aria-labelledby="${id}">
  <div class="wrap faq-wrap">
    <div class="head">
      <h2 id="${id}" class="h-util">${heading}</h2>
      <p>Don't see yours? Call or text <a href="${telHref}">${BIZ.phone}</a>.</p>
    </div>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details><summary><span>${esc(q)}</span><span class="faq-ico" aria-hidden="true">${ICON.plus}</span></summary><p>${esc(a)}</p></details>`).join('')}
    </div>
  </div>
</section>`;

const AREAS_INTRO = "We serve homes across Houston and the cities west and southwest of town. Not sure you're in range? Send us your ZIP.";

const areasSection = ({ exclude = null, heading = 'Where we clean', intro = AREAS_INTRO } = {}) => `
<section class="sec-s" id="areas" aria-labelledby="areas-h">
  <div class="wrap areas">
    <div class="areas-head">
      <h2 id="areas-h" class="h-util">${heading}</h2>
      <p>${intro}</p>
    </div>
    <ul class="area-list">
      ${CITIES.filter((c) => c.slug !== exclude).map((c) => `<li><a href="${cityUrl(c)}"><span>${c.name}</span><small>${c.county}</small>${ICON.arrow}</a></li>`).join('')}
    </ul>
  </div>
</section>`;

// the last, biggest thing on every page: the phone number
const closer = (quoteHref = '/pricing/#quote') => `
<section class="closer" aria-labelledby="close-h">
  ${stripes('stripes-r closer-stripes')}
  <div class="wrap closer-in">
    <h2 id="close-h">Ready when you are</h2>
    <a class="closer-phone num" href="${telHref}">${BIZ.phone}</a>
    <p>Call or text with how many rooms, and we'll give you a price before we book anything.</p>
    <div class="cta-row">
      <a class="btn btn-navy btn-lg" href="${quoteHref}"><span>Get a free quote</span>${ICON.arrow}</a>
      <a class="btn btn-line btn-lg" href="sms:${BIZ.tel}">${ICON.message}<span>Text us a photo</span></a>
    </div>
    <p class="closer-hours">${ICON.clock}<span>${BIZ.hoursLabel}</span></p>
  </div>
</section>`;

// Renders nothing until PROOF in src/config.mjs has real reviews, photos or an owner bio.
const proofSection = () => {
  const { rating, reviews, beforeAfter, owner } = PROOF;
  if (!reviews.length && !beforeAfter.length && !owner) return '';
  const photo = (f) => `/assets/photos/${encodeURI(f)}`;
  const ba = beforeAfter.map((b, i) => `
      <figure class="ba">
        <div class="ba-frame" data-ba>
          <img src="${photo(b.after)}" alt="After cleaning: ${esc(b.label)}" loading="lazy" decoding="async">
          <div class="ba-before"><img src="${photo(b.before)}" alt="Before cleaning: ${esc(b.label)}" loading="lazy" decoding="async"></div>
          <span class="ba-handle"></span>
          <span class="ba-tag ba-tag-b" aria-hidden="true">Before</span><span class="ba-tag ba-tag-a" aria-hidden="true">After</span>
          <input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Compare before and after: ${esc(b.label)}">
        </div>
        <figcaption>${esc(b.label)}</figcaption>
      </figure>`).join('');
  const rv = reviews.slice(0, 3).map((r) => `<li><blockquote><p>${esc(r.text)}</p></blockquote><p class="rv-by">${esc(r.name)}${r.area ? `, ${esc(r.area)}` : ''}</p></li>`).join('');
  const head = (reviews.length || beforeAfter.length)
    ? `<div class="head"><h2 id="proof-h" class="h-feat">Real Houston homes</h2>${rating ? `<p class="lede"><a href="${esc(rating.url)}" rel="noopener" target="_blank">${rating.score.toFixed(1)} stars from ${rating.count} Google reviews</a></p>` : ''}</div>`
    : `<h2 id="proof-h" class="sr-only">About us</h2>`;
  return `
<section class="sec proof" aria-labelledby="proof-h">
  <div class="wrap">
    ${head}
    ${ba ? `<div class="ba-list">${ba}</div>` : ''}
    ${rv ? `<ul class="reviews">${rv}</ul>` : ''}
    ${owner ? `<div class="owner"><figure class="owner-img"><img src="${photo(owner.photo)}" alt="${esc(owner.name)}, owner of ${BIZ.name}" loading="lazy" decoding="async"></figure><div><h3>Meet ${esc(owner.name.split(' ')[0])}</h3><p>${esc(owner.text)}</p></div></div>` : ''}
  </div>
</section>`;
};

const STEPS = [
  ['Inspect & pre-treat', 'We walk the rooms with you, flag tough spots, and apply a pre-treatment matched to the stains and traffic lanes.'],
  ['Brush it loose', 'A grooming brush works the solution into the base of the fibers to loosen soil, oils and pet hair.'],
  ['Hot water extraction', 'Hot water rinses the carpet and powerful suction pulls it right back out, along with the dirt.'],
  ['Groom & speed dry', 'We set the pile, protect furniture legs, and get air moving so your floors dry faster.'],
];

const stepsSection = () => `
<section class="sec sec-tint" aria-labelledby="steps-h">
  <div class="wrap">
    <div class="head">
      <h2 id="steps-h" class="h-feat">Our 4-step deep clean</h2>
      <p class="lede">The same process in every room, every time. It's why traffic lanes disappear instead of coming back next week.</p>
    </div>
    <ol class="track">
      ${STEPS.map(([t, d], i) => `<li><span class="track-n" aria-hidden="true"><b>${i + 1}</b></span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>`;

// ---------- pages ----------
const HOME_FAQS = [
  ['How much does carpet cleaning cost in Houston?', `Our ${$.specialRooms} Room Special is ${money($.specialPrice)} for three carpeted rooms, walk-in closets included. Additional rooms are ${money($.room)} each, sofas are ${money($.sofa)}, chairs are ${money($.chair)}, and tile and grout is ${money($.tileSqft)} per square foot. Visits have a ${money($.minimum)} minimum unless you book the special.`],
  ['What cleaning method do you use?', 'Hot water extraction, often called steam cleaning. We pre-treat, brush the solution in, then rinse with hot water and extract it so the dirt leaves with the water.'],
  ['How long until I can walk on my carpet?', 'Most carpet is dry to the touch in a few hours. You can walk on it in clean socks right away. Running the AC and ceiling fans helps, especially on humid Houston days.'],
  ['Do I need to move my furniture?', 'Please move small and fragile items. We can work around larger furniture and will talk through it during the walkthrough.'],
  ['Will every stain come out?', "Most do. Some, like bleach spots, dye, burns and old pet urine that soaked into the pad, can be permanent. We'll tell you what to expect before we start."],
  ['What is the Pristine Club?', `A ${money($.club)}/month membership with four seasonal deep cleanings a year, 50% off additional services, priority and same-day booking, and a free cleaning when you refer a friend. You can cancel anytime.`],
];

const home = () => layout({
  url: '/',
  title: 'Houston Carpet Cleaning | 3 Rooms for $98 | Pristine Steam Cleaning',
  description: `Houston carpet, upholstery and tile cleaning with hot water extraction. ${$.specialRooms} carpeted rooms for $${$.specialPrice}, walk-in closets included. Call ${BIZ.phone}.`,
  schema: [faqSchema(HOME_FAQS)],
  body: `
${hero({
    id: 'hero-h',
    top: '<p class="hero-tag">Residential carpet cleaning in Houston, TX</p>',
    h1: 'Houston carpet cleaning that makes floors feel new again',
    offer: heroOffer([[money($.specialPrice), `${$.specialRooms} carpeted rooms`, 'Walk-in closets included']]),
    lede: 'Deep hot water extraction for carpet, upholstery and tile. Honest prices, careful work, and floors that feel soft under bare feet again.',
    photo: 'hero',
  })}
${factStrip()}
${services()}
${stepsSection()}

<section class="sec" aria-labelledby="health-h">
  <div class="wrap split">
    <figure class="split-media">
      ${picture('pet', { w: 800, h: 600, sizes: '(min-width: 960px) 46vw, 100vw', set: [[500, 400], [800, 600], [1100, 825]] })}
    </figure>
    <div class="split-copy">
      <h2 id="health-h" class="h-feat">A deeper clean for a healthier home</h2>
      <p class="lede">Carpet works like a filter. It holds on to what floats through your house until something pulls it out.</p>
      <dl class="points">
        <div><dt>Dust, pollen and allergens</dt><dd>Houston's long pollen seasons send it indoors on shoes and clothes. Hot water extraction rinses it out of the fibers instead of stirring it up.</dd></div>
        <div><dt>Pets and little ones</dt><dd>Pet dander, accidents and dropped snacks settle where kids and dogs spend the most time. We pre-treat those spots and rinse them clean.</dd></div>
        <div><dt>Humidity and odors</dt><dd>Damp air keeps smells hanging around. Removing the soil that holds them helps your rooms smell fresh again.</dd></div>
      </dl>
    </div>
  </div>
</section>

${proofSection()}
${offerBand()}
${faqList(HOME_FAQS, 'faq-h', 'Houston carpet cleaning questions')}
${areasSection({ intro: "We're a Houston company: bungalows in the Heights, condos in Uptown, two-stories in Spring Branch, family homes in Clear Lake and Kingwood, plus the cities west and southwest of town. Not sure you're in range? Send us your ZIP." })}
${closer()}
`,
});

// ----- pricing -----
const PREP = [
  'Pick up toys, shoes, cords and anything on the floor.',
  'Move small furniture, lamps, plants and breakables out of the rooms.',
  'Vacuum high-traffic areas if you have time. It helps, but it isn\'t required.',
  'Plan a spot for pets and kids while we work and until the floors dry.',
  'Make sure we can park close and that water and power are on.',
  'Point out stains, pet spots or anything delicate during the walkthrough.',
];

const counter = (key, label, unit, price) => `
<div class="calc-row">
  <div class="calc-label"><label for="calc-${key}">${label}</label><span>${unit}</span></div>
  <div class="stepper">
    <button type="button" data-step="${key}" data-dir="-1" aria-label="Fewer ${label.toLowerCase()}">${ICON.minus}</button>
    <input id="calc-${key}" name="${key}" type="number" inputmode="numeric" min="0" max="40" value="${key === 'rooms' ? 3 : 0}" data-calc="${key}" data-price="${price}">
    <button type="button" data-step="${key}" data-dir="1" aria-label="More ${label.toLowerCase()}">${ICON.plus}</button>
  </div>
</div>`;

const quoteForm = () => JOBBER_EMBED
  ? `<div class="jobber-embed">${JOBBER_EMBED}</div>`
  : `
<form class="quote-form" id="quote-form" novalidate>
  <div class="field">
    <label for="q-name">Your name <span aria-hidden="true">*</span></label>
    <input id="q-name" name="name" type="text" autocomplete="name" required>
    <p class="field-err" id="q-name-err" role="alert"></p>
  </div>
  <div class="field-pair">
    <div class="field">
      <label for="q-phone">Phone <span aria-hidden="true">*</span></label>
      <input id="q-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required>
      <p class="field-err" id="q-phone-err" role="alert"></p>
    </div>
    <div class="field">
      <label for="q-zip">ZIP code <span aria-hidden="true">*</span></label>
      <input id="q-zip" name="zip" type="text" autocomplete="postal-code" inputmode="numeric" maxlength="5" required>
      <p class="field-err" id="q-zip-err" role="alert"></p>
    </div>
  </div>
  <div class="field">
    <label for="q-notes">What should we clean?</label>
    <textarea id="q-notes" name="notes" rows="4" placeholder="Example: 3 bedrooms, a sectional, and a coffee stain in the living room"></textarea>
    <p class="field-help">Your estimate from the calculator is added automatically.</p>
  </div>
  <button class="btn btn-navy btn-lg btn-block" type="submit">Send my quote request</button>
  <div class="quote-done" id="quote-done" hidden tabindex="-1">
    <h3>Almost done. Send it as a text.</h3>
    <p>Your request is ready. Tap below to open your messages app with everything filled in, then press send.</p>
    <a class="btn btn-ice btn-block" id="quote-sms" href="sms:${BIZ.tel}">${ICON.message}<span>Open text message</span></a>
    <button class="btn btn-ghost-dark btn-block" type="button" id="quote-copy">Copy request</button>
    <p class="field-help">On a computer? Copy it, or just call <a href="${telHref}">${BIZ.phone}</a>.</p>
  </div>
</form>`;

const pricing = () => layout({
  url: '/pricing/',
  active: '/pricing/',
  title: 'Carpet Cleaning Prices Houston | $98 for 3 Rooms | Pristine Steam Cleaning',
  description: `Upfront carpet cleaning prices in Houston: ${$.specialRooms} rooms for $${$.specialPrice}, $${$.room} per extra room, sofas $${$.sofa}, tile $${$.tileSqft}/sq ft. Pristine Club $${$.club}/mo. Estimate calculator and quote form.`,
  schema: [crumbSchema([['Home', '/'], ['Pricing', '/pricing/']])],
  body: `
${hero({
    id: 'p-h',
    top: crumbs([['Home', '/'], ['Pricing']]),
    h1: 'Simple prices, confirmed before we start',
    offer: heroOffer([[money($.specialPrice), `${$.specialRooms} Room Special`, 'one visit'], [money($.club), 'Pristine Club', 'per month']]),
    lede: 'No upsell surprises at the end. We walk through your home, confirm the total, and only then start cleaning.',
    photo: 'upholstery',
    cta: ctaPair('Estimate your clean', '#calc'),
  })}

<section class="sec" aria-labelledby="deal-h">
  <div class="wrap">
    <div class="head"><h2 id="deal-h" class="h-feat">Pick how you book</h2></div>
    <div class="offers offers-light">
      <article class="offer">
        <h3>${$.specialRooms} Room Special</h3>
        <p class="offer-price"><strong class="num">${money($.specialPrice)}</strong><span>one visit</span></p>
        <p>The easiest way to try us. Three carpeted rooms, deep cleaned with our 4-step process.</p>
        <ul class="ticks">
          <li>${ICON.check}${$.specialRooms} carpeted rooms</li>
          <li>${ICON.check}Walk-in closets included</li>
          <li>${ICON.check}Add rooms for ${money($.room)} each</li>
        </ul>
        <a class="btn btn-navy" href="#quote"><span>Get the ${money($.specialPrice)} special</span>${ICON.arrow}</a>
      </article>
      <article class="offer offer-club" id="club">
        <h3>Pristine Club</h3>
        <p class="offer-price"><strong class="num">${money($.club)}</strong><span>per month</span></p>
        <p>Clean floors all year without having to remember to book.</p>
        <ul class="ticks">
          <li>${ICON.check}4 seasonal deep cleanings a year (up to ${POLICY.clubRooms} rooms each)</li>
          <li>${ICON.check}50% off additional services</li>
          <li>${ICON.check}Priority and same-day booking</li>
          <li>${ICON.check}Refer a friend and your next cleaning is free</li>
          <li>${ICON.check}Member-only offers</li>
        </ul>
        <p class="offer-fine">Cancel anytime; it ends after the current billing month. <a href="/service-agreement/">Club terms</a></p>
        <a class="btn btn-ice" href="#quote"><span>Ask about the club</span>${ICON.arrow}</a>
      </article>
    </div>
  </div>
</section>

<section class="sec sec-tint" id="calc-sec" aria-labelledby="calc-h">
  <div class="wrap calc-wrap">
    <div class="head">
      <h2 id="calc-h" class="h-feat">Estimate your clean</h2>
      <p class="lede">Add what you'd like cleaned. We'll confirm the final price at your door.</p>
    </div>
    <div class="calc" id="calc" data-special="${$.specialPrice}" data-special-rooms="${$.specialRooms}" data-min="${$.minimum}">
      <div class="calc-inputs">
        ${counter('rooms', 'Carpeted rooms', `${money($.room)} each, or ${$.specialRooms} for ${money($.specialPrice)}`, $.room)}
        ${counter('sofas', 'Sofas', `${money($.sofa)} each`, $.sofa)}
        ${counter('chairs', 'Chairs & ottomans', `${money($.chair)} each`, $.chair)}
        <div class="calc-row">
          <div class="calc-label"><label for="calc-tile">Tile & grout</label><span>${money($.tileSqft)} per sq ft</span></div>
          <div class="sqft"><input id="calc-tile" name="tile" type="number" inputmode="numeric" min="0" max="5000" step="10" value="0" data-calc="tile" data-price="${$.tileSqft}"><span>sq ft</span></div>
        </div>
      </div>
      <div class="calc-peek" id="calc-peek" aria-hidden="true"><span>Estimated total</span><strong class="num" id="calc-peek-total">${money($.specialPrice)}</strong></div>
      <div class="calc-out" aria-live="polite">
        <p class="calc-k">Estimated total</p>
        <p class="calc-total num" id="calc-total">${money($.specialPrice)}</p>
        <ul class="calc-lines" id="calc-lines"></ul>
        <p class="calc-note" id="calc-note"></p>
        <a class="btn btn-ice btn-block" href="#quote"><span>Send this estimate</span>${ICON.arrow}</a>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-navy" id="quote" aria-labelledby="quote-h">
  <div class="wrap quote">
    <div class="quote-copy">
      <h2 id="quote-h" class="h-feat">Get a free quote</h2>
      <p class="lede">Send us a few details and we'll reply with a price and the next open times. Prefer to talk? We pick up.</p>
      <a class="btn btn-ice btn-lg" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
      <p class="quote-hours">${ICON.clock}<span>${BIZ.hoursLabel}</span></p>
    </div>
    <div class="quote-panel">${quoteForm()}</div>
  </div>
</section>

<section class="sec-s" aria-labelledby="list-h">
  <div class="wrap prices">
    <div class="head">
      <h2 id="list-h" class="h-util">Individual prices</h2>
      <p>Mix and match. Every visit includes pre-treatment, hot water extraction and grooming.</p>
    </div>
    <dl class="price-list">
      <div><dt>Carpeted room<small>bedroom, living room, closet included</small></dt><dd>${money($.room)}<span>/room</span></dd></div>
      <div><dt>Sofa<small>sectionals quoted at your door</small></dt><dd>${money($.sofa)}</dd></div>
      <div><dt>Chair or ottoman</dt><dd>${money($.chair)}</dd></div>
      <div><dt>Tile & grout</dt><dd>${money($.tileSqft)}<span>/sq ft</span></dd></div>
      <div><dt>Visit minimum<small>the ${$.specialRooms} Room Special is the exception</small></dt><dd>${money($.minimum)}</dd></div>
    </dl>
  </div>
</section>

<section class="sec sec-tint" id="prep" aria-labelledby="prep-h">
  <div class="wrap split split-rev">
    <div class="split-copy">
      <h2 id="prep-h" class="h-feat">Getting ready for your clean</h2>
      <p class="lede">Ten minutes of prep helps us clean more of your floor and finish faster.</p>
      <ul class="checklist">${PREP.map((p) => `<li>${ICON.check}<span>${esc(p)}</span></li>`).join('')}</ul>
      <p>More detail on what happens during your visit is in <a href="/service-agreement/">Your Pristine Experience</a>.</p>
    </div>
    <figure class="split-media">
      ${picture('room', { w: 800, h: 600, sizes: '(min-width: 960px) 46vw, 100vw', set: [[500, 400], [800, 600], [1100, 825]] })}
    </figure>
  </div>
</section>

${closer('#quote')}
`,
});

// ----- city pages -----
const cityPage = (c) => layout({
  url: cityUrl(c),
  active: '/#areas',
  title: c.title,
  description: c.description,
  og: img(c.photo, 1200, 630),
  schema: [faqSchema(c.faqs), crumbSchema([['Home', '/'], ['Service areas', '/#areas'], [c.name, cityUrl(c)]]), {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Carpet cleaning',
    name: `Carpet cleaning in ${c.name}, TX`,
    provider: { '@id': `${BIZ.domain}/#business` },
    areaServed: { '@type': 'City', name: `${c.name}, TX` },
  }],
  body: `
${hero({
    id: 'c-h',
    top: crumbs([['Home', '/'], ['Service areas', '/#areas'], [c.name]]),
    h1: esc(c.h1),
    offer: heroOffer([[money($.specialPrice), `${$.specialRooms} rooms in ${c.name}`, 'Walk-in closets included']]),
    lede: esc(c.lede),
    photo: c.photo,
  })}
${factStrip()}

<section class="sec" aria-labelledby="c-about">
  <div class="wrap city-body">
    <div class="city-copy">
      <h2 id="c-about" class="h-feat">Deep cleaning for ${c.name} homes</h2>
      ${c.body.map((p) => `<p>${esc(p)}</p>`).join('')}
      <a class="link-arrow" href="/pricing/">See all prices ${ICON.arrow}</a>
    </div>
    <ul class="notes">
      ${c.notes.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${stepsSection()}

<section class="sec-s" aria-labelledby="c-hoods">
  <div class="wrap hoods">
    <h2 id="c-hoods" class="h-util">${c.name} neighborhoods we serve</h2>
    <ul class="hood-list">${c.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <p>Don't see yours? We likely still cover it. Send us your ZIP code and we'll confirm.</p>
  </div>
</section>

${offerBand(`Book your ${c.name} clean`)}
${faqList(c.faqs, 'c-faq', `${c.name} carpet cleaning FAQ`)}
${areasSection({ exclude: c.slug, heading: 'Other areas we serve' })}
${closer()}
`,
});

// ----- legal pages -----
const legalPage = (l) => layout({
  url: `/${l.slug}/`,
  title: `${l.title} | ${BIZ.name}`,
  description: l.description,
  schema: [crumbSchema([['Home', '/'], [l.title, `/${l.slug}/`]])],
  body: `
<section class="phero" aria-labelledby="l-h">
  <div class="wrap">
    ${crumbs([['Home', '/'], [l.title]])}
    <h1 id="l-h">${esc(l.title)}</h1>
    <p class="hero-lede">Effective ${POLICY.effective}</p>
  </div>
  ${stripes('hero-stripes')}
</section>
<section class="sec">
  <div class="wrap legal">
    <nav class="legal-toc" aria-label="On this page">
      <p>On this page</p>
      <ol>${l.sections.map(([h], i) => `<li><a href="#s${i + 1}">${esc(h)}</a></li>`).join('')}</ol>
    </nav>
    <article class="legal-body">
      ${l.sections.map(([h, html], i) => `<section id="s${i + 1}"><h2>${i + 1}. ${esc(h)}</h2>${html}</section>`).join('')}
    </article>
  </div>
</section>
`,
});

const notFound = () => layout({
  url: '/404.html',
  noindex: true,
  title: `Page not found | ${BIZ.name}`,
  description: 'This page does not exist.',
  body: `
<section class="phero phero-404" aria-labelledby="nf-h">
  <div class="wrap">
    <h1 id="nf-h">This page got cleaned right off the site</h1>
    <p class="hero-lede">The link may be old. Try the home page, or call us and we'll help.</p>
    <div class="cta-row"><a class="btn btn-ice btn-lg" href="/">Back to home</a><a class="btn btn-ghost btn-lg" href="${telHref}">${ICON.phone}<span>${BIZ.phone}</span></a></div>
  </div>
  ${stripes('hero-stripes')}
</section>`,
});

// ---------- write ----------
const write = (rel, html) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(`${OUT}/assets`, { recursive: true });
for (const f of ['styles.css', 'site.js', 'favicon.svg', 'icon-512.svg']) fs.copyFileSync(`static/${f}`, `${OUT}/assets/${f}`);
// real job photos for PROOF (before/after, owner) live in static/photos/
if (fs.existsSync('static/photos')) fs.cpSync('static/photos', `${OUT}/assets/photos`, { recursive: true });
ASSET_V = crypto.createHash('md5').update(fs.readFileSync('static/styles.css') + fs.readFileSync('static/site.js')).digest('hex').slice(0, 8);

const pages = [
  ['index.html', home(), '/', '1.0'],
  ['pricing/index.html', pricing(), '/pricing/', '0.9'],
  ...CITIES.map((c) => [`${cityUrl(c).slice(1)}index.html`, cityPage(c), cityUrl(c), '0.8']),
  ...LEGAL.map((l) => [`${l.slug}/index.html`, legalPage(l), `/${l.slug}/`, '0.3']),
];
for (const [rel, html] of pages) write(rel, html);
write('404.html', notFound());

const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([, , u, p]) => `  <url><loc>${BIZ.domain}${u}</loc><lastmod>${today}</lastmod><priority>${p}</priority></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${BIZ.domain}/sitemap.xml\n`);
write('_headers', `/assets/*\n  Cache-Control: public, max-age=604800\n`);

console.log(`Built ${pages.length + 1} pages into ./${OUT}`);
