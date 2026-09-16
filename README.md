# siggisuperconductors.com — static copy

A self-contained static snapshot of the Squarespace site, captured 2026-09-15,
ready to deploy to Vercel. No build step, no dependencies.

```
index.html                  home page
email-confirmation/         "Thanks for joining!" page
404.html                    not-found page
assets/css/                 Squarespace stylesheets, rewritten to load locally
assets/fonts/               Inknut Antiqua (self-hosted) + Squarespace icon fonts
assets/img/                 every image, at 500/1000/1500/2500px widths
assets/js/menu.js           mobile menu toggle
vercel.json                 clean URLs, cache headers, /home -> / redirect
robots.txt, sitemap.xml
```

## Deploying

Vercel needs no framework preset — it's a plain static directory.

From this folder with the Vercel CLI:

```bash
npx vercel deploy --prod
```

Or push the folder to a GitHub repo and import it at vercel.com/new, leaving the
framework as "Other" and the output directory as the repo root.

To preview locally, serve it over HTTP rather than opening `index.html` directly —
asset paths are absolute (`/assets/...`), so `file://` won't resolve them:

```bash
npx serve .
```

## Fidelity

Verified against the live site at 1024px and 375px wide: identical rendered text
(477 characters), and every heading, image, and caption lands at the same size and
the same vertical position. All 14 images load; nothing 404s.

The `email-confirmation` page is actually *better* than the live one — the
"the golds" image is broken on Squarespace right now (it returns nothing), so that
page shows an empty tinted square. This copy serves the real image from a file.

## What changed, and why

Squarespace's JavaScript bundle is not included — it reported analytics, loaded a
commerce cart, and phoned home on every page view, none of which a static copy can
or should do. Three things depended on it, so they were replaced:

- **Content reveal.** The theme hides the header, footer, and every section behind
  `animation: hideContent` until the bundle sets `data-animation-state="booted"` on
  `<body>`. That attribute is now baked into the markup, with a CSS backstop in
  `assets/css/overrides.css`. Without this the page renders completely blank.
- **Font loading flag.** An inline script set `wf-loading`, which made all text
  transparent for 3 seconds while waiting on a font loader that is no longer there.
  Removed.
- **Mobile menu.** `assets/js/menu.js` (30 lines) reproduces the burger toggle so
  the Patreon and email links stay reachable on phones.

Also removed: the `SQUARESPACE_CONTEXT` blob (account IDs and feature flags), the
cart link, per-element editor config attributes, and an empty `LocalBusiness`
structured-data block. These stripped about 90 KB from the two HTML files.

## Two things worth knowing

**1. The body font depends on Adobe Fonts, and that may stop working.**

Headings use Inknut Antiqua, which is open-licensed and self-hosted here, so it will
always work. Body text — image captions, the Patreon supporter names, the copyright
line — uses `acumin-pro`, delivered by an Adobe Fonts (Typekit) kit that was
provisioned through the Squarespace account. That's the one remaining external
dependency:

```html
<script src="//use.typekit.net/ik/QFrMC9zf...js"></script>
```

It currently loads fine from a non-Squarespace origin (tested from localhost). But
if the Squarespace subscription is cancelled, the kit will likely stop serving.
Nothing breaks visually when it does — `overrides.css` defines a fallback stack that
lands on Helvetica Neue / Arial — but the captions would change appearance slightly.

To make the site fully independent, either add the domain to an Adobe Fonts kit on
your own Adobe account, or swap `acumin-pro` for a self-hosted open font.

**2. Update the domain in the meta tags if you move it.**

`og:image`, `twitter:image`, and `canonical` are absolute URLs pointing at
`https://www.siggisuperconductors.com`. They're correct once that domain points at
Vercel. If you deploy somewhere else permanently, search for that string in
`index.html` and `email-confirmation/index.html` and update it, plus `sitemap.xml`
and `robots.txt`.

## Size

30 MB, almost all of it images — each of the 13 photos ships at four widths so
browsers pick the right one. Dropping the 2500px variants would save about 19 MB at
some cost to sharpness on retina displays. The CSS is Squarespace's full framework
(1.7 MB across two files, unminified); it compresses to a fraction of that in transit
and was kept intact so the layout stays pixel-identical.
