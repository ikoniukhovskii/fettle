# Fettle

Marketing site for Fettle — boutique home care, London. Built with [Astro](https://astro.build)
on top of the Claude Design canvas export.

```sh
npm run dev       # dev server (managed daemon; `npx astro dev stop` to halt)
npm run build     # static site -> dist/
npm run preview   # serve dist/
```

## Layout

```
design-export/          the Claude Design canvas export, verbatim — source of truth
src/
  assets/img/           photographs, re-encoded to WebP (see below)
  components/home/      Home.jsx — the ported editorial home page
  layouts/
    Base.astro          <html> shell, meta, fonts
    Page.astro          header + 3-column footer for content pages
  pages/                index.astro + the eight content pages
  styles/
    tokens/             design-system tokens, copied from the export
    ds.css              token manifest (@imports only)
    home.css            page chrome lifted from the artboard's <style>
    site.css            content-page styles (was pages/fettle-site.css)
scripts/
  optimize-images.mjs   one-time image re-encode
  port-home.mjs         home.jsx -> src/components/home/Home.jsx
  port-pages.mjs        pages/*.html -> src/pages/*.astro
```

The `scripts/` ports are re-runnable: if the canvas is re-exported into
`design-export/`, run them again rather than hand-editing the output.

## What the port changed

The canvas artboards loaded React + **Babel Standalone** from a CDN and compiled
JSX in the browser on every page view. That's right for a design canvas and wrong
for production. The port:

- **Removed the runtime toolchain.** JSX compiles at build time. No CDN, no
  `babel.min.js`, no React development builds.
- **Froze the tweaks system.** `TWEAK_DEFAULTS` was a live control panel; it is
  now a constant, and the `TweaksPanel` UI is gone. The accent colour it used to
  set via JS (`--rust-muted: #9E5A3C`) is now declared in `home.css`.
- **Re-encoded the photography.** The export shipped photographs as lossless PNG
  — `before-after-after.png` alone was 8.8 MB. All 13 images are WebP at a
  sensible ceiling: **30.9 MB → 2.7 MB**. `carousel-skylight.jpg` was dropped as
  byte-identical to `dining-skylight.jpg`.
- **Replaced `chrome.js`.** The header and footer were injected with `innerHTML`
  after load; they're now server-rendered markup in `Page.astro`.
- **Real routes.** `pages/about.html` → `/about`, and so on.

The home page is **server-rendered** — the hero, wordmark and footer are in the
HTML, so it reads correctly with JS disabled and to crawlers.

## Known gaps

- **The home page hydrates as one island** (`client:load` in `index.astro`).
  Only four things genuinely need JS — the before/after sliders, the carousel,
  the FAQ accordion and the postcode check — plus the scroll-morphing header.
  Splitting those into separate islands and reimplementing `Reveal`/`useParallax`
  as a small IntersectionObserver script would take the page to near-zero JS.
  Right now it ships ~225 KB of React.
- **The contact form posts nowhere.** `contact.astro` only fakes a success state,
  same as the export did. Needs a real endpoint or a form service.
- **`living-room.webp` is an animated WebP** (206 KB) converted from a GIF. A
  short muted MP4/WebM would be smaller still.
- **No `site` set** in `astro.config.mjs` — canonical URLs currently fall back to
  `https://fettle.london`. Set the real domain before launch.
- `design-export/uploads/` duplicates `design-export/editorial/img/` and is
  ~40 MB of the repo. Safe to delete once you're happy with the port.

## Design system

Tokens in `src/styles/tokens/` are copied from the **Fettle Design System**
project on claude.ai/design (`b6c43b1a-44aa-4bec-8db6-081b15530e61`). They can be
re-pulled live rather than re-exported. `home.jsx` never used the design system's
React components — only its CSS custom properties — so no component bundle is
vendored here.
