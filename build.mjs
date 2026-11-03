// Builds the static site into ./site (the folder you drag onto Netlify).
// No dependencies: `node build.mjs`.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { BIZ, SOCIAL, JOBBER_EMBED, PRICES as $, POLICY, PHOTOS, img } from './src/config.mjs';
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
  `<img class="${cls}" src="${img(key, set.at(-1)[0], set.at(-1)[1])}" srcset="${srcset(key, set)}" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(PHOTOS[key].alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

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
    <a class="btn btn-ice hdr-call" href="${telHref}">${ICON.phone}<span>Call us today</span></a>
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
const proofList = () => `
<ul class="proof">
  <li>${ICON.check}<span>${$.specialRooms} rooms for ${money($.specialPrice)}</span></li>
  <li>${ICON.check}<span>Walk-in closets included</span></li>
  <li>${ICON.check}<span>Price confirmed before we start</span></li>
</ul>`;

const ctaPair = (ghostLabel = 'Get a free quote') => `
<div class="cta-row">
  <a class="btn btn-ice btn-lg" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
  <a class="btn btn-ghost btn-lg" href="/pricing/#quote"><span>${ghostLabel}</span>${ICON.arrow}</a>
</div>`;

const offerBand = (heading = 'Two easy ways to book') => `
<section class="sec sec-navy offers-band" aria-labelledby="offers-h">
  <div class="wrap">
    <div class="sec-head sec-head-split">
      <h2 id="offers-h">${heading}</h2>
      <p>Start with the special, or join the club and keep your floors on a schedule all year.</p>
    </div>
    <div class="offers">
      <article class="offer">
        <h3>${$.specialRooms} Room Special</h3>
        <p class="offer-price"><strong>${money($.specialPrice)}</strong><span>one visit</span></p>
        <ul class="ticks">
          <li>${ICON.check}${$.specialRooms} carpeted rooms, deep cleaned</li>
          <li>${ICON.check}Walk-in closets included</li>
          <li>${ICON.check}Extra rooms ${money($.room)} each</li>
        </ul>
        <a class="btn btn-ice" href="/pricing/#quote">Book the special</a>
      </article>
      <article class="offer offer-club">
        <h3>Pristine Club</h3>
        <p class="offer-price"><strong>${money($.club)}</strong><span>per month</span></p>
        <ul class="ticks">
          <li>${ICON.check}4 seasonal deep cleanings a year</li>
          <li>${ICON.check}50% off additional services</li>
          <li>${ICON.check}Priority and same-day booking</li>
          <li>${ICON.check}Refer a friend, your next cleaning is free</li>
        </ul>
        <a class="btn btn-navy" href="/pricing/#club">See club details</a>
      </article>
    </div>
  </div>
</section>`;

const faqList = (faqs, id = 'faq-h', heading = 'Questions we hear a lot') => `
<section class="sec sec-tint" aria-labelledby="${id}">
  <div class="wrap faq-wrap">
    <div class="sec-head">
      <h2 id="${id}">${heading}</h2>
      <p>Don't see yours? Call or text <a href="${telHref}">${BIZ.phone}</a>.</p>
    </div>
    <div class="faq">
      ${faqs.map(([q, a]) => `<details><summary><span>${esc(q)}</span><span class="faq-ico" aria-hidden="true">${ICON.plus}</span></summary><p>${esc(a)}</p></details>`).join('')}
    </div>
  </div>
</section>`;

const contactCard = () => `
<aside class="contact-card" aria-labelledby="contact-h">
  <h2 id="contact-h">Ready when you are</h2>
  <p>Tell us how many rooms and we'll give you a price on the spot.</p>
  <ul>
    <li>${ICON.phone}<a href="${telHref}">${BIZ.phone}</a></li>
    <li>${ICON.message}<a href="sms:${BIZ.tel}">Text us a photo of the stain</a></li>
    <li>${ICON.clock}<span>${BIZ.hoursLabel}</span></li>
    ${BIZ.email ? `<li>${ICON.message}<a href="mailto:${BIZ.email}">${BIZ.email}</a></li>` : ''}
  </ul>
  <a class="btn btn-ice btn-block" href="/pricing/#quote">Request a quote</a>
</aside>`;

const areasAndContact = (exclude = null, heading = 'Where we clean') => `
<section class="sec" id="areas" aria-labelledby="areas-h">
  <div class="wrap areas">
    <div>
      <div class="sec-head">
        <h2 id="areas-h">${heading}</h2>
        <p>We serve homes across Houston and the cities west and southwest of town. Not sure if you're in range? Send us your ZIP.</p>
      </div>
      <ul class="area-list">
        ${CITIES.filter((c) => c.slug !== exclude).map((c) => `<li><a href="${cityUrl(c)}"><span>${c.name}</span><small>${c.county}</small>${ICON.arrow}</a></li>`).join('')}
      </ul>
    </div>
    ${contactCard()}
  </div>
</section>`;

const STEPS = [
  ['Inspect & pre-treat', 'We walk the rooms with you, flag tough spots, and apply a pre-treatment matched to the stains and traffic lanes.'],
  ['Agitate', 'A grooming brush works the solution into the base of the fibers to loosen soil, oils and pet hair.'],
  ['Hot water extraction', 'Hot water rinses the carpet and powerful suction pulls it right back out, along with the dirt.'],
  ['Groom & speed dry', 'We set the pile, protect furniture legs, and get air moving so your floors dry faster.'],
];

const stepsSection = () => `
<section class="sec sec-tint" aria-labelledby="steps-h">
  <div class="wrap">
    <div class="sec-head sec-head-split">
      <h2 id="steps-h">Our 4-step deep clean</h2>
      <p>The same process in every room, every time. It's why traffic lanes disappear instead of coming back next week.</p>
    </div>
    <ol class="steps">
      ${STEPS.map(([t, d], i) => `<li><span class="step-n" aria-hidden="true">${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>`;

// ---------- pages ----------
const HOME_FAQS = [
  ['How much does carpet cleaning cost in Houston?', `Our ${$.specialRooms} Room Special is ${money($.specialPrice)} for three carpeted rooms, walk-in closets included. Additional rooms are ${money($.room)} each, sofas are ${money($.sofa)}, chairs are ${money($.chair)}, and tile and grout is ${money($.tileSqft)} per square foot. Visits have a ${money($.minimum)} minimum unless you book the special.`],
  ['What cleaning method do you use?', 'Hot water extraction, often called steam cleaning. We pre-treat, agitate, then rinse with hot water and extract it so the dirt leaves with the water.'],
  ['How long until I can walk on my carpet?', 'Most carpet is dry to the touch in a few hours. You can walk on it in clean socks right away. Running the AC and ceiling fans helps, especially on humid Houston days.'],
  ['Do I need to move my furniture?', 'Please move small and fragile items. We can work around larger furniture and will talk through it during the walkthrough.'],
  ['Will every stain come out?', "Most do. Some, like bleach spots, dye, burns and old pet urine that soaked into the pad, can be permanent. We'll tell you what to expect before we start."],
  ['What is the Pristine Club?', `A ${money($.club)}/month membership with four seasonal deep cleanings a year, 50% off additional services, priority and same-day booking, and a free cleaning when you refer a friend.`],
];

const HOUSTON_HOODS = CITIES[0].neighborhoods;

const home = () => layout({
  url: '/',
  title: 'Houston Carpet Cleaning | 3 Rooms for $98 | Pristine Steam Cleaning',
  description: `Houston carpet, upholstery and tile cleaning with hot water extraction. ${$.specialRooms} carpeted rooms for $${$.specialPrice}, walk-in closets included. Call ${BIZ.phone}.`,
  schema: [faqSchema(HOME_FAQS)],
  body: `
<section class="hero" aria-labelledby="hero-h">
  <div class="hero-lines" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="hero-tag">Residential carpet cleaning in Houston, TX</p>
      <h1 id="hero-h">Houston carpet cleaning that makes floors feel new again</h1>
      <p class="hero-lede">Deep hot water extraction for carpet, upholstery and tile. Honest prices, careful work, and floors that feel soft under bare feet again.</p>
      ${ctaPair()}
      ${proofList()}
    </div>
    <figure class="hero-media">
      ${picture('hero', { eager: true, w: 900, h: 1000, sizes: '(min-width: 960px) 44vw, 100vw', set: [[600, 520], [900, 1000], [1300, 1440]] })}
      <figcaption class="tagcard">
        <span class="tagcard-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="tagcard-k">${$.specialRooms} Room Special</span>
        <strong>${money($.specialPrice)}</strong>
        <span class="tagcard-s">Closets included</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="sec" id="services" aria-labelledby="svc-h">
  <div class="wrap">
    <div class="sec-head sec-head-split">
      <h2 id="svc-h">What we clean</h2>
      <p>One visit can cover the bedrooms, the couch and the kitchen floor. You get one clear price for all of it.</p>
    </div>
    <div class="svc">
      <article class="svc-item svc-lg">
        ${picture('carpet', { w: 800, h: 620, sizes: '(min-width: 960px) 56vw, 100vw', set: [[600, 460], [900, 700], [1200, 930]] })}
        <div class="svc-body">
          <h3>Carpet cleaning</h3>
          <p>Bedrooms, living rooms, stairs and closets. We pull out the ground-in dirt, pet hair and spills that vacuuming leaves behind.</p>
          <p class="svc-price"><strong>${$.specialRooms} rooms ${money($.specialPrice)}</strong><span>then ${money($.room)} per room</span></p>
        </div>
      </article>
      <article class="svc-item">
        ${picture('upholstery', { w: 600, h: 400, sizes: '(min-width: 960px) 36vw, 100vw', set: [[480, 320], [720, 480]] })}
        <div class="svc-body">
          <h3>Upholstery cleaning</h3>
          <p>Sofas, sectionals, chairs and ottomans. We check the fabric first so it comes out clean, not soaked.</p>
          <p class="svc-price"><strong>Sofas ${money($.sofa)}</strong><span>chairs ${money($.chair)}</span></p>
        </div>
      </article>
      <article class="svc-item">
        ${picture('tile', { w: 600, h: 400, sizes: '(min-width: 960px) 36vw, 100vw', set: [[480, 320], [720, 480]] })}
        <div class="svc-body">
          <h3>Tile & grout cleaning</h3>
          <p>Kitchens, entries and bathrooms. Saltillo, porcelain or ceramic, we rinse the grime out of the grout lines.</p>
          <p class="svc-price"><strong>${money($.tileSqft)} per sq ft</strong><span>${money($.minimum)} visit minimum</span></p>
        </div>
      </article>
    </div>
  </div>
</section>

${stepsSection()}

<section class="sec" aria-labelledby="health-h">
  <div class="wrap split">
    <figure class="split-media">
      ${picture('pet', { w: 700, h: 760, sizes: '(min-width: 960px) 42vw, 100vw', set: [[500, 540], [800, 870]] })}
    </figure>
    <div class="split-copy">
      <h2 id="health-h">A deeper clean for a healthier home</h2>
      <p class="lede">Carpet works like a filter. It holds on to what floats through your house until something pulls it out.</p>
      <dl class="points">
        <div><dt>Dust, pollen and allergens</dt><dd>Houston's long pollen seasons send it indoors on shoes and clothes. Hot water extraction rinses it out of the fibers instead of stirring it up.</dd></div>
        <div><dt>Pets and little ones</dt><dd>Pet dander, accidents and dropped snacks settle where kids and dogs spend the most time. We pre-treat those spots and rinse them clean.</dd></div>
        <div><dt>Humidity and odors</dt><dd>Damp air keeps smells hanging around. Removing the soil that holds them helps your rooms smell fresh again.</dd></div>
      </dl>
    </div>
  </div>
</section>

${offerBand()}

<section class="sec" aria-labelledby="htx-h">
  <div class="wrap htx">
    <div class="htx-copy">
      <h2 id="htx-h">Carpet cleaning across Houston, neighborhood by neighborhood</h2>
      <p>We're a Houston company, and we clean Houston homes: bungalows in the Heights, high-rise condos in Uptown, two-stories in Spring Branch and family homes in Clear Lake and Kingwood. Every visit gets the same 4-step deep clean and a price you approve before we begin.</p>
      <p>Our city has its own challenges. Humid summers slow down drying, storms track in mud, and pollen season seems to last half the year. We plan for all of it, pull out as much water as possible, and leave airflow running so your carpet is ready for bare feet by evening.</p>
      <a class="link-arrow" href="${cityUrl(CITIES[0])}">Carpet cleaning in Houston ${ICON.arrow}</a>
    </div>
    <div class="htx-hoods">
      <h3>Neighborhoods we serve</h3>
      <ul class="chips">${HOUSTON_HOODS.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    </div>
  </div>
</section>

${faqList(HOME_FAQS, 'faq-h', 'Houston carpet cleaning questions')}

${areasAndContact()}
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
<section class="phero" aria-labelledby="p-h">
  <div class="hero-lines" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">Pricing</span></nav>
    <h1 id="p-h">Simple prices, confirmed before we start</h1>
    <p class="hero-lede">No upsell surprises at the end. We walk through your home, confirm the total, and only then start cleaning.</p>
  </div>
</section>

<section class="sec" aria-labelledby="deal-h">
  <div class="wrap">
    <h2 id="deal-h" class="sr-only">Offers</h2>
    <div class="offers offers-light">
      <article class="offer">
        <h3>${$.specialRooms} Room Special</h3>
        <p class="offer-price"><strong>${money($.specialPrice)}</strong><span>one visit</span></p>
        <p>The easiest way to try us. Three carpeted rooms, deep cleaned with our 4-step process.</p>
        <ul class="ticks">
          <li>${ICON.check}${$.specialRooms} carpeted rooms</li>
          <li>${ICON.check}Walk-in closets included</li>
          <li>${ICON.check}Add rooms for ${money($.room)} each</li>
        </ul>
        <a class="btn btn-navy" href="#quote">Book the special</a>
      </article>
      <article class="offer offer-club" id="club">
        <h3>Pristine Club</h3>
        <p class="offer-price"><strong>${money($.club)}</strong><span>per month</span></p>
        <p>Clean floors all year without having to remember to book.</p>
        <ul class="ticks">
          <li>${ICON.check}4 seasonal deep cleanings a year (up to ${POLICY.clubRooms} rooms each)</li>
          <li>${ICON.check}50% off additional services</li>
          <li>${ICON.check}Priority and same-day booking</li>
          <li>${ICON.check}Refer a friend and your next cleaning is free</li>
          <li>${ICON.check}Member-only offers</li>
        </ul>
        <a class="btn btn-ice" href="#quote">Join the club</a>
      </article>
    </div>
  </div>
</section>

<section class="sec sec-tint" aria-labelledby="list-h">
  <div class="wrap prices">
    <div class="sec-head">
      <h2 id="list-h">Individual prices</h2>
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

<section class="sec" aria-labelledby="calc-h">
  <div class="wrap calc-wrap">
    <div class="sec-head">
      <h2 id="calc-h">Estimate your clean</h2>
      <p>Add what you'd like cleaned. We'll confirm the final price at your door.</p>
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
      <div class="calc-out" aria-live="polite">
        <p class="calc-k">Estimated total</p>
        <p class="calc-total" id="calc-total">${money($.specialPrice)}</p>
        <ul class="calc-lines" id="calc-lines"></ul>
        <p class="calc-note" id="calc-note"></p>
        <a class="btn btn-ice btn-block" href="#quote">Send this estimate</a>
      </div>
    </div>
  </div>
</section>

<section class="sec sec-navy" id="quote" aria-labelledby="quote-h">
  <div class="wrap quote">
    <div class="quote-copy">
      <h2 id="quote-h">Request a quote</h2>
      <p>Send us a few details and we'll reply with a price and the next open times. Prefer to talk? We pick up.</p>
      <a class="btn btn-ice btn-lg" href="${telHref}">${ICON.phone}<span>Call ${BIZ.phone}</span></a>
      <p class="quote-hours">${ICON.clock}<span>${BIZ.hoursLabel}</span></p>
    </div>
    <div class="quote-panel">${quoteForm()}</div>
  </div>
</section>

<section class="sec" id="prep" aria-labelledby="prep-h">
  <div class="wrap split split-rev">
    <div class="split-copy">
      <h2 id="prep-h">Getting ready for your clean</h2>
      <p class="lede">Ten minutes of prep helps us clean more of your floor and finish faster.</p>
      <ul class="checklist">${PREP.map((p) => `<li>${ICON.check}<span>${esc(p)}</span></li>`).join('')}</ul>
      <p>More detail on what happens during your visit is in <a href="/service-agreement/">Your Pristine Experience</a>.</p>
    </div>
    <figure class="split-media">
      ${picture('room', { w: 700, h: 640, sizes: '(min-width: 960px) 42vw, 100vw', set: [[500, 460], [800, 730]] })}
    </figure>
  </div>
</section>
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
<section class="hero hero-city" aria-labelledby="c-h">
  <div class="hero-lines" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/#areas">Service areas</a><span aria-hidden="true">/</span><span aria-current="page">${c.name}</span></nav>
      <h1 id="c-h">${esc(c.h1)}</h1>
      <p class="hero-lede">${esc(c.lede)}</p>
      ${ctaPair()}
      ${proofList()}
    </div>
    <figure class="hero-media">
      ${picture(c.photo, { eager: true, w: 900, h: 1000, sizes: '(min-width: 960px) 44vw, 100vw', set: [[600, 520], [900, 1000], [1300, 1440]] })}
      <figcaption class="tagcard">
        <span class="tagcard-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="tagcard-k">Serving ${c.name}</span>
        <strong>${money($.specialPrice)}</strong>
        <span class="tagcard-s">${$.specialRooms} rooms, closets included</span>
      </figcaption>
    </figure>
  </div>
</section>

<section class="sec" aria-labelledby="c-about">
  <div class="wrap city-body">
    <div class="city-copy">
      <h2 id="c-about">Deep cleaning for ${c.name} homes</h2>
      ${c.body.map((p) => `<p>${esc(p)}</p>`).join('')}
      <a class="link-arrow" href="/pricing/">See all prices ${ICON.arrow}</a>
    </div>
    <ul class="notes">
      ${c.notes.map(([t, d]) => `<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join('')}
    </ul>
  </div>
</section>

${stepsSection()}

<section class="sec" aria-labelledby="c-hoods">
  <div class="wrap hoods">
    <h2 id="c-hoods">${c.name} neighborhoods we serve</h2>
    <ul class="chips">${c.neighborhoods.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <p>Don't see yours? We likely still cover it. Send us your ZIP code and we'll confirm.</p>
  </div>
</section>

${offerBand(`Book your ${c.name} clean`)}

${faqList(c.faqs, 'c-faq', `${c.name} carpet cleaning FAQ`)}

${areasAndContact(c.slug, 'Other areas we serve')}
`,
});

// ----- legal pages -----
const legalPage = (l) => layout({
  url: `/${l.slug}/`,
  title: `${l.title} | ${BIZ.name}`,
  description: l.description,
  schema: [crumbSchema([['Home', '/'], [l.title, `/${l.slug}/`]])],
  body: `
<section class="phero phero-sm" aria-labelledby="l-h">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span aria-current="page">${esc(l.title)}</span></nav>
    <h1 id="l-h">${esc(l.title)}</h1>
    <p class="hero-lede">Effective ${POLICY.effective}</p>
  </div>
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
  <div class="hero-lines" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap">
    <h1 id="nf-h">This page got cleaned right off the site</h1>
    <p class="hero-lede">The link may be old. Try the home page, or call us and we'll help.</p>
    <div class="cta-row"><a class="btn btn-ice btn-lg" href="/">Back to home</a><a class="btn btn-ghost btn-lg" href="${telHref}">${ICON.phone}<span>${BIZ.phone}</span></a></div>
  </div>
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
