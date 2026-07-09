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
- `stone-texture.js` — Canvas API background texture generator (obsidian base + copper veins), loaded on every page
- `image1.jpeg` – `image4.jpeg`, `image.png` — project images
- `ZEN DESIGN.pdf` — vector source of the full logo lockup (ZEN + DESIGN + MİMARLIK)
- `zen-logo.png` (1600×620) — transparent, silver-tinted lockup rendered from the PDF; used in the home hero (`.hero-logo`)
- `og-image.jpg` (1200×1200) — social-share image (`og:image` in `index.html`), derived from the WhatsApp logo jpeg
- `favicon.png` (96×96), `apple-touch-icon.png` (180×180) — generated from the ZEN logo (`WhatsApp Image 2026-07-08 at 17.29.51.jpeg`); linked in every page's `<head>`

## CSS architecture

Everything lives in `styles.css` with clearly delimited sections using `/* ─── SECTION ─── */` comments:

- **CSS custom properties** at `:root` — `--bg`, `--copper` (`#b88a44`), `--text`, `--text-muted`, `--line`, `--line-soft`, `--max-width`
- **Home page overrides** — `.home-page` class on `<body>` applies a darker background, different header style, and larger nav. All home-specific rules are grouped under `/* ═══ HOME PAGE ═══ */`.
- **Responsive breakpoints** — `≤ 980px` (tablet), `≤ 720px` (mobile), `≤ 400px` (small mobile). Mobile rules are grouped at the bottom under their own section comments.
- **Typography** — Cormorant (body serif), Josefin Sans (headings, nav, UI labels, home hero tagline). The hero brand lockup is the `zen-logo.png` image, not text. All `font-size` values use `clamp()` for fluid scaling.

## Conventions

- All pages share the same nav markup; mark the current page with `class="active"` on its `<a>`.
- The nav contains a HİZMETLER dropdown (`.nav-item` > `.dropdown`) linking to `hizmetler.html` anchors; on mobile the dropdown renders as a flat list inside the fullscreen menu.
- All pages apply `class="home-page"` on `<body>` — this is intentional; the home-page dark background is used site-wide.
- The `container` class constrains content to `min(1180px, 92vw)` centered; always wrap section content in `<div class="container">`.
- The footer is hidden on the home page via `.home-main + .site-footer { display: none }`.
- `stone-texture.js` is a purely decorative canvas background; it only draws on pages with `body.home-page` (which every page has) and is loaded via a `<script>` tag on each page.
