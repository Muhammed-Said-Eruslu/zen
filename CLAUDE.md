# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static multi-page website for **ZEN DESIGN Mimarlık**, an architecture and interior design firm based in Gaziantep, Turkey. No build system, no dependencies, no package manager — just HTML files, a single CSS file, and one optional JS file served directly from disk or a static host.

## Running the site

Open any `.html` file directly in a browser, or serve the directory with any static server:

```
npx serve .
# or
python -m http.server 8080
```

There is a `CNAME` file (`zendesignmimarlik.com`), indicating the site is deployed to GitHub Pages.

## File structure

- `index.html` — home page with the full-screen hero (logo image lockup, staggered entrance animation, og/twitter meta tags)
- `portfolio.html` — project grid with hover overlays
- `hizmetler.html` — services page (Paket Proje / İç Mekan / Anahtar Teslim Uygulama), sections have anchor ids targeted by the nav dropdown
- `hakkimizda.html` — about page
- `iletisim.html` — contact page (e-mail: info@zendm.com.tr, Instagram link)
- `restoran-ic-mekan-gaziantep.html`, `gaziantep-ozel-konut.html`, `mimarlik-ofisi.html` — individual project detail pages
- `styles.css` — single stylesheet for the entire site
- `site.js` — page transitions, hamburger menu, scroll animations, contact form
- `stone-texture.js` — legacy Canvas texture from the old dark theme; **no longer loaded by any page** (kept for reference)
- `image1.jpeg` – `image4.jpeg`, `image.png` — project images
- `ZEN DESIGN.pdf` — vector source of the full logo lockup (ZEN + DESIGN + MİMARLIK)
- `zen-logo-dark.png` (1400×543) — transparent black lockup rendered from the PDF; used in the home hero (`.hero-logo`)
- `zen-icon.jpg` (192×192) — square black ZEN avatar (from the WhatsApp jpeg); header brand mark on every page (`.brand`)
- `zen-mark-dark.png` (800×225) — "ZEN DESIGN" row only, black (currently unused)
- `zen-logo.png` (1600×620) — silver variant for dark surfaces (currently unused)
- `og-image.jpg` (1200×1200) — social-share image (`og:image` in `index.html`), derived from the WhatsApp logo jpeg
- `benzetilecektasarım.jpeg` — client-approved reference for the current visual direction (white/black/yellow poster style)
- `favicon.png` (96×96), `apple-touch-icon.png` (180×180) — generated from the ZEN logo (`WhatsApp Image 2026-07-08 at 17.29.51.jpeg`); linked in every page's `<head>`

## CSS architecture

Everything lives in `styles.css` with clearly delimited sections using `/* ─── SECTION ─── */` comments:

- **CSS custom properties** at `:root` — `--bg` (paper `#f5f4f0`), `--ink` (`#101010`), `--yellow` (`#f0df10`), `--body-text`, `--muted`, `--line`, `--line-soft`, `--max-width`
- **Light editorial theme** — paper background, black structural lines, white cards with hairline borders, square corners (no border-radius). **Yellow is an accent only** (client requirement: "sarı çok baskın olmasın, detay olarak ekle"): eyebrow square, 3px heading bars, active-nav underline, hover fills, cover-year chip, and the gold-gradient `.tagline-accent` on "sonuç nettir." in the hero. Never use it for large surfaces or long text.
- **Responsive breakpoints** — `≤ 980px` (tablet), `≤ 720px` (mobile), `≤ 400px` (small mobile). Mobile rules are grouped at the bottom under their own section comments.
- **Typography** — Montserrat only (weights 400–800). Headings are 700/800 uppercase with wide letter-spacing; the hero brand lockup is the `zen-logo-dark.png` image, not text. Fluid sizes use `clamp()`.

## Conventions

- All pages share the same header markup: a `.brand` logo link (`zen-icon.jpg`, links home) followed by the nav; mark the current page with `class="active"` on its `<a>`.
- The nav contains a HİZMETLER dropdown (`.nav-item` > `.dropdown`) linking to `hizmetler.html` anchors; on mobile the dropdown renders as a flat list inside the fullscreen menu.
- All pages still carry `class="home-page"` on `<body>`, but the class no longer has styling — the light theme is global. The home hero uses a `.hero-drop` vertical line motif taken from the reference poster.
- The `container` class constrains content to `min(1180px, 92vw)` centered; always wrap section content in `<div class="container">`.
- The footer is hidden on the home page via `.home-main + .site-footer { display: none }`.
- `iletisim.html` intentionally lists only e-mail and Instagram — no phone number.
