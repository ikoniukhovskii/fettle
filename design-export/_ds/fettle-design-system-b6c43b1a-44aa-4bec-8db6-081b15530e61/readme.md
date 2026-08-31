# Fettle — Design System

> "In fine fettle." The friendly folk who keep your London home in good working order.

Fettle is a **boutique home-care service house** for a small, hand-picked roster of London homeowners — deliberately apart from both the one-man-band handyman and the anonymous marketplace (Rated People, TaskRabbit). A small permanent team of multi-skilled generalists does the day-to-day work; a short bench of personally-vetted specialists covers licensed trades (plumbing, rendering, tree surgery). **Access is the brand asset** — fewer clients, better work, every job carrying a name and a reputation.

This design system is the "System 02" identity carried through into tokens, components, foundation specimens and a marketing-site UI kit.

## Sources this was built from
- **`uploads/style-guide.html`** — the "System 02" brand style guide: colors, type, voice, and component specimens (buttons, badges, nav, forms, alerts, cards, spacing/radius). This is the visual ground truth; every token value here is copied from it exactly.
- **`uploads/Fettle_Brand_Vision.docx`** — "Brand Vision & Strategy" (prepared July 2026): positioning, audience, business model, service offering, personality, voice & tone, growth philosophy. This is the verbal/strategic ground truth.

No codebase, Figma, or logo files were provided. The **house mark** used throughout is the SVG that ships inside the style guide (`assets/mark-house-*.svg`) — Fettle's own mark, copied verbatim, not reconstructed.

---

## Content fundamentals

**Vibe:** Fettle sounds like a good local shop owner — plain, warm, a little dry, never corporate. Copy should read handwritten, not templated. Confidence sits in the specificity, not the volume.

- **Person & tone.** Warm, not corporate. Talk like a person who's good with their hands, not a company. Contractions are natural — "we'll" not "we will." Uses **"we"** for Fettle and **"you/your"** for the homeowner ("your London home in good working order").
- **Concrete, not vague.** Name the actual thing: *"a wonky fence"*, not *"exterior structural elements."* *"From a wonky fence to a fresh coat of paint."*
- **Capable, not salesy.** Let the finish speak for itself; state what we do plainly rather than talking it up. No hype.
- **Casing.** Sentence case for headings and UI. Eyebrows are the one uppercase moment (tracked `.14em`, rust). Prices in display type ("from £140").
- **Punctuation.** No exclamation marks doing the enthusiasm for us. Em-dashes and full stops carry the dry rhythm. British spelling and currency (£, "call-out", "tidy", "period property").
- **No emoji.** Ever. Not part of the brand.
- **Do / Don't**
  - Do: "From a wonky fence to a fresh coat of paint." · "Book a visit." · "Local team. No call-out fee. Tidy finish."
  - Don't: "End-to-end home maintenance solutions." · "Submit a service request." · "Best-in-class tradespeople at scale!"
- **Word bank:** Handywork · Mend & Make · Tidy · Proper · Odd jobs · Call-out fee · Half-day / Full-day · Wonky · In fine fettle · Good hands, good work · Local team · Tidy finish.

---

## Visual foundations

- **Colour.** Five colours, used deliberately. **Rust `#B34426`** carries the brand and drives every action; **Brick `#97381E`** is its hover/pressed. **Ink `#2B2723`** and **Cream `#F1E8D8`** do the heavy lifting for text and background (cream is *never* text). **Sage `#6E8A6B`** is a calm secondary accent (success/confirmation). White is every raised surface. Soft tints (`tan-pill`, `sage-tint`, `rust-tint`) back badges and status. One ink, four alphas, handles secondary text / placeholders / borders / hover fills. The palette is warm and earthy — terracotta grounded by sage and deep ink; **no blue, no purple, no neon, and status never introduces red or yellow.**
- **Type.** Two families, roles never swapped. **Bricolage Grotesque** (display) carries warmth and character in headlines — Bold/ExtraBold for headings, down to 52px hero. **Work Sans** (body/UI) stays plain-spoken — Regular for prose, Medium/SemiBold for labels. Prices are set in display type.
- **Backgrounds.** Flat warm cream page, flat white surfaces. **No gradients, no photographic hero washes, no repeating textures or patterns.** Depth comes from the one soft shadow, not from imagery. Imagery, where added, should be warm and natural (period London homes, honest finishes) — never cool or heavily filtered. (None shipped in the source; add real photography rather than stock-slop.)
- **Corner radii.** Rounding steps up with surface size: `6px` badges/inputs, `10px` buttons/swatches, `16px` cards/nav, `20px` pills.
- **Cards.** White surface, generous `16px` rounding, **one soft warm shadow** — `0 8px 24px rgba(43,39,35,.10), 0 2px 6px rgba(43,39,35,.06)`. No harsh borders on elevated cards; a `1px` ink-12 hairline is the flat alternative.
- **Borders.** Hairlines are ink at 12%. Buttons and form fields carry a slightly heavier `1.5px` edge.
- **Shadows.** Just two, both warm-ink and soft — `--shadow-card` (default) and `--shadow-raised` (menus/modals). Never a cool grey or hard drop shadow.
- **Buttons.** Primary = rust fill, hover → brick. Secondary = ink outline that fills ink on hover. Ghost = underlined text link, hover → brick. Disabled = ink-12 fill / ink-40 text. One primary action per screen.
- **Hover / press.** Hover shifts *colour* (rust→brick; ink outline fills; muted link→ink), never scale or glow. Transitions are short and plain — `.15s` on background/border/colour. **No bounce, no spring, no parallax.** Motion is minimal and functional; fades over movement.
- **Focus.** Always the rust ring — form fields swap their border to rust on focus.
- **Transparency & blur.** Used sparingly and only as ink alphas for text/borders — **no glassmorphism, no backdrop blur.**
- **Layout.** Roomy, boutique spacing. Marketing sections breathe at ~56–88px rhythm; content maxes around 1040px. Eyebrow → heading → lede is the standard section opener.
- **Forms.** Cream-filled fields on white cards so inputs never disappear into the page. Label above, hint below, rust focus.

---

## Iconography

- **Brand mark:** a single line-drawn **house** (roof + walls), 2px round-cap strokes, shown white inside a rust rounded tile (or rust-on-transparent). Shipped in `assets/mark-house-white.svg` and `assets/mark-house-rust.svg`, and reproduced in `Navbar`'s `BrandMark`. This is the only bespoke glyph in the source.
- **UI glyphs:** the style guide uses **plain typographic marks inside a coloured dot** for alerts — `✓` (sage, confirm), `!` (rust, attention), `i` (ink, note). These are Unicode characters, not an icon font. `Alert` reproduces them exactly.
- **No icon font or icon set** is defined by the source — Fettle's UI is deliberately word-first (badges and labels carry meaning, not pictograms). **Do not sprinkle in a general-purpose icon set.** If a product surface genuinely needs line icons, use **Lucide** (CDN) — its 2px round-cap stroke matches the house mark — and flag the addition. **No emoji.**

---

## Components

Reusable React primitives, exactly the families the style guide defines (no invented extras). Import via `const { X } = window.<Namespace>` (run `check_design_system` for the exact namespace).

- **Button** (`components/core/`) — primary / secondary / ghost; sizes sm/md/lg; disabled; fullWidth.
- **Card / ServiceCard** (`components/core/`) — white shadowed surface; the in-context pricing card.
- **Badge** (`components/feedback/`) — fact pill (sage dot) / outline tag / rust emphasis.
- **Alert** (`components/feedback/`) — confirmed (sage) / attention (rust) / note (ink). No red or yellow.
- **Field / Input / Select / Textarea** (`components/forms/`) — cream-filled controls with a rust focus ring.
- **Navbar / BrandMark** (`components/navigation/`) — mark, wordmark, short links, one primary action.

Each directory carries a `*.card.html` (Design System tab thumbnail), a `.d.ts` props contract, and a `.prompt.md` usage note.

## UI kits

- **`ui_kits/website/`** — the Fettle marketing site: an interactive click-through (Home → What we fix → Pricing → Book a visit, with a working request form) built entirely from the components above. Entry: `index.html`.

## Foundations (Design System tab)

Specimen cards live in `guidelines/` — Colours (primary, neutrals, accents, ink alphas), Type (display, body, pairing), Spacing (scale, radius & shadow), and Brand (mark & lockup, voice do/don't, word bank).

---

## Index / manifest (root)

- `styles.css` — global entry point; `@import`s the token files (consumers link this one file).
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius-shadow.css`.
- `components/` — `core/`, `feedback/`, `forms/`, `navigation/`.
- `guidelines/` — foundation specimen cards.
- `ui_kits/website/` — marketing-site recreation.
- `assets/` — `mark-house-white.svg`, `mark-house-rust.svg`.
- `SKILL.md` — Agent-Skills-compatible entry point.
- `uploads/` — the original brand sources.

## Caveats / substitutions
- **Fonts** are Bricolage Grotesque + Work Sans, loaded from **Google Fonts** via `@import` in `tokens/fonts.css` (both are the real brand faces named in the source; no binaries were provided). Self-host by dropping `.woff2` files in `assets/fonts/` and replacing the import with local `@font-face` rules.
- **No logo lockup file** beyond the house mark was provided; the wordmark is set live in Bricolage Grotesque.
- No product photography was provided — imagery slots are intentionally empty.

## Intentional additions
- **`BrandMark`** (exported alongside `Navbar`) — a small standalone house-mark component. Added because the source uses the mark in several places (nav, footer, guide header) and a single reusable glyph avoids re-inlining the SVG. One-line reason: reuse of the only bespoke brand glyph.
