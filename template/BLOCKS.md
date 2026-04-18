# Blocks — ACM landing-page template

This is the catalogue of every reusable block in the ACM brand system. The brand CSS (`/brand.css`) ships every class referenced here. Page-specific blocks (muscle cards, Gray's Anatomy plate) live in a page's own CSS and are documented at the bottom.

Read `../CLAUDE.md` for brand/voice guardrails. Read `../.impeccable.md` for aesthetic principles. This file just lists the Lego.

---

## How to build a new landing page

1. **Make the directory.** `mkdir wellx/<variant>` — e.g. `wellx/back-pain`. The URL will be `/<variant>/`.
2. **Copy the starter.** `cp wellx/template/_starter.html wellx/<variant>/index.html`. Relative paths already target `../brand.css`, `../script.js`, and `../assets/…` — no rewrites needed because the starter and every variant live one level deep.
3. **Fill in copy.** Every `TODO:` marker is a field to edit. Delete any BLOCK you're not using. Keep blocks in a sensible order (hero → slogan-strip → editorial sections → fit → faq → cta-final → footer).
4. **If you need page-specific CSS**, create `wellx/<variant>/page.css`, link it after `brand.css`, and move the `--brand-logo-url` `:root` rule from the inline `<style>` block into it.

The booking URL is `https://app.hivemanager.io/book/athleteschoicemassage`. For category-scoped booking (e.g. TMJ), append `?category=<id>`.

---

## Shared brand CSS (automatic, don't duplicate)

Every variant gets these by linking `/brand.css`:

- **Tokens**: colors (`--yellow`, `--flint`, `--paper`, `--ink` + scales), spacing (`--s-1` … `--s-10`, 4pt scale), motion (`--dur-1/2/3`, `--ease-out-q`), typography (`--display`, `--body` both Montserrat), layout (`--measure`, `--content-max`, `--page-pad`).
- **Reset + base**: box-sizing, margin reset, link/button reset, `::selection`, `:focus-visible`, `prefers-reduced-motion`.
- **Utilities**: `.skip-link`.

---

## Blocks (shared — available on every page)

Each block lists: **what it is**, the **classes** it uses, and notable **notes**.

### `brand-logo`
The real ACM horizontal logo, rendered via CSS `mask-image` so it inherits `currentColor`. Lives inside `.brand` (nav) and `.footer-brand` (footer).
- **HTML**: `<span class="brand-logo" aria-hidden="true"></span>`
- **Sizes**: `.brand-logo` (default 170×34), `.brand-logo-sm` (132×26), `.brand-logo-lg` (220×44).
- **Recoloring**: set `color:` on the span. On paper (default) → `var(--ink)`. On a dark panel → `var(--yellow)`.
- **Requires**: each page must set `--brand-logo-url` in `:root` to the correct relative path. See the starter's inline `<style>` block.

### `nav` — sticky top bar
- **Classes**: `.nav`, `.brand`, `.brand-logo`, `.nav-cta`.
- Sticky with a translucent paper background; gains a border on scroll (handled by `script.js`).
- Right side is always the book CTA (pill, ink-on-paper, inverts to yellow on hover).

### `hero` — primary page intro
- **Wrapper**: `<section class="hero">` with two children: `.hero-inner` (left column) and `.hero-diagram` (optional right-column figure).
- **Inner**: `.eyebrow` → `.hero-title` (with optional `.hero-highlight` on a 1–3 word phrase) → `.lead` → `.hero-ctas` (primary + ghost) → `.hero-trust` (3 stat pills).
- **Highlight** is a yellow underline that draws on 350ms after paint — use it on *one* short phrase per hero.
- First 5 direct children with `data-reveal` stagger on scroll.

### `eyebrow` — editorial label
- **HTML**: `<div class="eyebrow"><span class="eyebrow-dot" aria-hidden="true"></span>Label</div>`
- Yellow dot + uppercase tracked flint label. Used at the top of every section-head and the hero.
- On dark panels (e.g. inside `.fit-panel`), override color via `.fit-panel .eyebrow` (already handled).
- On the CTA final (yellow radial), use `.eyebrow.eyebrow-on-accent` to swap color to ink.

### `slogan-strip` — marquee
- **HTML**: `<div class="slogan-strip" aria-hidden="true"><div class="slogan-track">...</div></div>`
- Yellow strip with the slogan looping left-to-right at 40s.
- `prefers-reduced-motion` turns it into a horizontally scrollable static strip.

### `section` + `section-head` — generic content section shell
- **HTML**:
  ```html
  <section class="section">
    <div class="section-head" data-reveal>
      <div class="eyebrow">...</div>
      <h2 class="section-title">...</h2>
      <p class="section-lead">...</p>  <!-- optional -->
    </div>
    <!-- block body -->
  </section>
  ```
- Max width 1180px, vertical padding scales with viewport.
- `section-lead` is optional — skip it for sections that want to jump straight into the block.

### `failures-dl` — "why your usual fixes aren't holding"
- **HTML**: `<dl class="failures"><div class="failure"><dt>Name</dt><dd>Description</dd></div>...</dl>`
- Editorial term/definition list with subtle dividers. Each row is a 1fr/2fr grid ≥720px.
- Use 4–6 entries. Keep `dt` punchy (2–4 words) and `dd` a single sentence.

### `method-steps` — numbered walkthrough
- **HTML**:
  ```html
  <ol class="method-steps">
    <li class="step">
      <div class="step-meta">
        <span class="step-num">Step 01</span>
        <span class="step-time">~5 min</span>
      </div>
      <h3 class="step-title">Title <span class="optional">(optional)</span></h3>
      <p class="step-desc">...</p>
    </li>
  </ol>
  ```
- Sidebar of meta (yellow step pill + flint time label) on the left ≥720px.
- Use 4–5 steps. Shorter sequences feel thin; longer ones lose focus.

### `fit-checklist` — dark flint emphasis panel
- **HTML**:
  ```html
  <section class="section fit">
    <div class="fit-panel">
      <div class="section-head">...</div>
      <ul class="checklist">
        <li><span class="check" aria-hidden="true"></span>Symptom line</li>
        ...
      </ul>
    </div>
  </section>
  ```
- Flint background, yellow top accent strip. Two-column checklist ≥720px.
- Inverts colors automatically (section-title becomes paper, eyebrow becomes muted-light).
- Use 6–8 items. Odd counts are fine — the last-row border is auto-stripped.

### `faq-details` — native accessible accordion
- **HTML**: `<details class="faq-item"><summary><span>Q</span><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-body"><p>A</p></div></details>` inside `.faq-list`.
- Uses native `<details>` — no JS, keyboard and screen-reader friendly.
- The plus icon rotates to an X on open. Background tints yellow on open.
- Use 4–7 questions. Answer each in 1–3 sentences.

### `cta-final` — closing book push
- **Classes**: `.cta-final`, `.cta-final-inner`, `.eyebrow.eyebrow-on-accent`, `.cta-title`, `.btn.btn-primary.btn-xl`, `.cta-fine`.
- Radial yellow glow behind centered content. Two blurred yellow blobs in the corners.
- Include one oversized primary button (`.btn-xl`) and one line of fine print.

### `footer`
- **Classes**: `.footer`, `.footer-top`, `.footer-brand` (`brand-logo` + `footer-words` with `.hashtag`), `.footer-locations` (header + `ul`), `.footer-bot`.
- Four locations list is static (hardcoded in the starter). Year auto-updates via `#year` in script.js.

### `float-cta` — mobile-only floating book pill
- **HTML**: `<a class="float-cta" href="..." aria-label="...">Label <svg/></a>` at the bottom of `<body>`.
- Shows after the user scrolls past the hero, hides near the footer. Managed by `script.js`. Display:none ≥720px.

### `btn` — button system
- **Classes**: `.btn` + one of `.btn-primary` (yellow on ink — the hero CTA, closing CTA, float CTA) or `.btn-ghost` (outlined — secondary actions). Add `.btn-xl` for the oversized closing CTA.
- Always include the right-arrow SVG inside primary buttons for forward-motion cueing.

---

## Scroll reveal

Any element with `data-reveal` fades in when it enters the viewport. The hero's first 5 reveal-children are pre-staggered (80ms between each) via `brand.css`. Everywhere else, add `data-reveal` to the outer container of the block, not every child.

Respects `prefers-reduced-motion` automatically.

---

## Page-specific blocks (not in brand.css)

These live in one page's CSS today. When a second variant wants the same pattern, consider promoting into `brand.css`.

### `muscle-card` — anatomy/topic card grid *(in `tmj/page.css`)*
- 3-up grid of cards with a yellow numbered badge, a name, a paragraph, and a bulleted "signs" list.
- Generalizable to any "three pillars / three symptoms / three muscles" pattern.
- **HTML**:
  ```html
  <div class="muscles">
    <article class="muscle">
      <div class="muscle-num">01</div>
      <h3 class="muscle-name">Title</h3>
      <p class="muscle-desc">Description.</p>
      <ul class="muscle-signs">
        <li>Sign one</li>
        <li>Sign two</li>
      </ul>
    </article>
    ...
  </div>
  ```
- If a new variant uses it, either copy `tmj/page.css` selectors into the new `page.css`, or promote the block into `brand.css`.

### `anatomy-plate` — Gray's Anatomy engraving frame *(in `tmj/page.css`)*
- Public-domain anatomical plate styled with `mix-blend-mode: multiply` so the engraving integrates with the warm paper background.
- Corner crops (top-left + bottom-right) and a captioned footer with a yellow plate number pill.
- **HTML**:
  ```html
  <figure class="plate">
    <div class="plate-frame">
      <img src="./assets/<plate>.png" alt="..." width="..." height="..." loading="eager" decoding="async" />
    </div>
    <figcaption class="plate-caption">
      <span class="plate-num">Pl. 382</span>
      Source credit line.
    </figcaption>
  </figure>
  ```
- Use public-domain plates only (Gray's Anatomy 1918 is safe). Credit in the caption.

---

## Shared assets

- `/assets/athletes_choice_rgb-3-copy.webp` — the official horizontal ACM logo (yellow on transparent). Loaded via CSS `mask-image` on `.brand-logo`. Do not embed as `<img>` directly unless you want the baked-in yellow color.
- `/script.js` — footer year, nav scroll state, float-cta visibility, `data-reveal` IntersectionObserver. No config; portable across every variant.

## Tracking

Every variant participates in the shared analytics system via three `<meta>` tags in `<head>` plus `data-track-section` attributes on `<section>` wrappers. `../script.js` does the rest.

### Per-page config (three meta tags)

```html
<meta name="variant" content="tmj">                         <!-- kebab-case slug, unique per variant -->
<meta name="campaign" content="tmj-jaw-clenchers">          <!-- stable across iterations of the same hypothesis -->
<meta name="page-category" content="Mh3KjJu8yr">            <!-- optional Hivemanager category id -->
```

- **`variant`** — the variant identifier. Matches the directory name (`/tmj/` → `tmj`). Appears as `utm_content` on outbound booking links and as a custom dimension on every GA4 event.
- **`campaign`** — the stable name of the hypothesis being tested. When you replace `/tmj/v1` with `/tmj/v2`, both should share `campaign="tmj-jaw-clenchers"` so their events roll up.
- **`page-category`** — optional. If set, gets appended to the booking URL as `?category=<value>` (Hivemanager's booking category param).

Naming conventions:

| Field | Good | Bad |
|---|---|---|
| `variant` | `tmj`, `back-pain-v2`, `shoulder-desk` | `Variant A`, `tmj-new`, `test1` |
| `campaign` | `tmj-jaw-clenchers`, `back-pain-desk-workers` | `main`, `general`, `campaign-1` |

### Section view tracking

Any `<section>` with `data-track-section="<name>"` fires a `section_view` GA4 event once, when ≥25% of it scrolls into view. Use stable short names (`anatomy`, `method`, `fit`, `faq`, `cta-final`). The starter has these pre-wired.

### Events that fire automatically

| Event | When | Where it lands |
|---|---|---|
| `PageView` | On load | Meta Pixel |
| `page_view` | On load | GA4 |
| `section_view` | ≥25% of a `[data-track-section]` is visible | GA4 |
| `InitiateCheckout` | Click on any `a[href*="app.hivemanager.io"]` | Meta Pixel |
| `book_cta_click` | Same click | GA4 (with `cta_location`: nav / hero / cta-final / float / footer) |

No per-page JS needed. All of this runs from the shared `script.js`.

### UTM stamping

On page load, every outbound link to `app.hivemanager.io` is rewritten to carry:

```
?category=<page-category>&utm_source=meta&utm_medium=paid&utm_campaign=<campaign>&utm_content=<variant>&utm_term=fbclid:<truncated>
```

Pre-existing params on the href are preserved (we never stomp an author's explicit `category` or UTM). If Meta appends `fbclid` to the landing URL, it's carried through as `utm_term` for traceability.

### Where IDs live

`script.js` has two constants at the top:

```js
const META_PIXEL_ID = "TODO:META_PIXEL_ID";
const GA4_ID        = "TODO:G-XXXXXXXXXX";
```

Both are public identifiers — safe to commit. Replace the TODO sentinels with the real IDs before deploying. The script no-ops cleanly if either is left as a TODO (useful in local dev).

### Logging results

Decisions and variant outcomes live in `../RESULTS.md` at the repo root. Append a new entry at the end of each test; don't rewrite history — institutional memory matters.

---

## Don'ts

- Don't add a second font. Montserrat across the whole weight range is the system.
- Don't use yellow as text on paper backgrounds (fails contrast). Yellow goes on ink, flint, or the paper-tint panel never as text.
- Don't add spa imagery or spa language (see `.impeccable.md`).
- Don't rebuild a block when the existing one fits — copy the HTML from the starter and edit copy.
- Don't hand-stamp UTMs on booking links — `script.js` does it at runtime. Hand-stamps would only break the system when Meta changes conventions.
