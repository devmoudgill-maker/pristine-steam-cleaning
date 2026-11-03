# Pristine Steam Cleaning website

Static multi-page site for pristinesteamcleaning.co (Houston residential carpet cleaning, owner Abood Yahya).

## Edit

| What | Where |
|---|---|
| Phone, email, hours | `src/config.mjs` → `BIZ` |
| Social links (footer icons appear once set) | `src/config.mjs` → `SOCIAL` |
| Jobber request form | `src/config.mjs` → `JOBBER_EMBED` (paste the full embed snippet) |
| Prices | `src/config.mjs` → `PRICES` |
| Policy numbers (cancellation fees, late fee, etc.) | `src/config.mjs` → `POLICY` |
| Photos | `src/config.mjs` → `PHOTOS` (Unsplash for now) |
| City pages | `src/cities.mjs` |
| Terms, Service Agreement, Privacy | `src/legal.mjs` |
| Page layouts | `build.mjs` |
| Styles / behavior | `static/styles.css`, `static/site.js` |

## Build and preview

```bash
npm run build   # writes ./site
npm run dev     # build + serve at http://localhost:5243
```

## Deploy (Netlify drag and drop)

1. `npm run build`
2. Drag the `site/` folder onto the site's **Deploys** page in Netlify.
3. Domain: in Netlify add `pristinesteamcleaning.co`, then in Squarespace DNS point the apex `A` record to `75.2.60.5` and `www` `CNAME` to `<site-name>.netlify.app`. Check Netlify's domain screen for the current values before entering them.

## URLs

- `/` home, `/pricing/` (calculator `#calc`, quote form `#quote`, prep `#prep`, club `#club`)
- `/carpet-cleaning-houston/`, `-katy/`, `-richmond/`, `-sugar-land/`, `-cypress/`, `-missouri-city/`, `-stafford/`
- `/terms/`, `/service-agreement/`, `/privacy/`, `/404.html`, `/sitemap.xml`, `/robots.txt`

## Open items

- Jobber embed code, social links, business email
- Abood to approve placeholder policy numbers and hours
- Real logo SVG (the header logo is a CSS recreation of "concept 23")
- Swap Unsplash photos for real job photos
- Reviews section + Google Business Profile once reviews exist
