# Athletes Choice Massage — Project

A/B test landing pages for **Athletes Choice Massage** (ACM), driven by Meta ads. Single conversion goal: book an appointment online via `https://app.hivemanager.io/book/athleteschoicemassage`. For TMJ-specific landings, append `?category=Mh3KjJu8yr`.

ACM is a locally-owned, partner-run therapeutic massage clinic in Edmonton, Alberta — operating since 2016. They are explicitly **not a spa** ("no trickling water, no pan flutes"). Their voice is clinical, results-focused, and warm.

## Brand Guidelines (Brand Book v2.0, October 2025)

### Colors

| Token | Hex | Use |
|---|---|---|
| **Vivid Yellow** | `#FFD600` | Attention, CTAs, slogan blocks, accents. Saturated — use sparingly and only with dark text on top. **Never** as text on light backgrounds (fails contrast). |
| **Flint** | `#716B64` | Secondary surfaces, dark panels, supporting body text. Warm gray-brown. |

Working palette extends these with:
- Off-white paper background (warm-tinted, e.g., `oklch(97% 0.005 75)`) — never sterile pure white
- Near-black for primary text (warm-tinted, e.g., `oklch(20% 0.01 75)`) — never pure `#000`
- Flint variants for borders, secondary surfaces

### Typography

- **Primary (display)**: **SIFON** — Pangram Pangram, paid. Use when licensed.
- **Secondary (body)**: **Montserrat** — free via Google Fonts. Use full weight range (300–900) to create hierarchy.
- **Project default**: **Montserrat** for both display and body (per user directive). Lean on weight + size + tracking to get display character.

Banned reflexes that creep in even with Montserrat: don't pair it with Inter, DM Sans, Plus Jakarta Sans, or other generic sans-serifs to "balance" — single font does the work.

### Voice

Speak like a **trusted coach or teammate**:

- **Supportive and knowledgeable** — encouraging, motivating, always professional.
- **Empowering** — give clients tools and understanding so they feel in control of their own health.
- **Knowledgeable but approachable** — experts in the field, but never jargon-y or above the reader.
- **Respectful** — clear personal boundaries, dignity for every client.
- **Inclusive** — key demographic is active people, but everyone is welcome.
- **Locally grounded** — partner-owned, community-invested. Edmonton, not "a chain."

**Never** spa-language: no "relax," "treat yourself," "indulge," "pamper," "escape." No candles or lotus or stones. The brand explicitly differentiates from spa.

### Slogan + identity phrases

- **Slogan**: *"Life's too short to be sore!"* — eye-catching contexts (hero, signage, social, apparel).
- **Hashtag**: `#LiveYourSport`
- **Mission**: *"Maintaining active lifestyles"* — for body copy, footers, articles.

### Photography direction

- Low lighting, high contrast, professional grade.
- Real practitioners in branded shirts working on real clients.
- Dark backgrounds, focused subject, deep shadows.
- **Never**: spa stock (lotus, candles, stones, soft-focus, towels rolled in baskets), smiling-therapist-with-arms-crossed clichés.

### Logo

Geometric circle with horizontal bars and a small arch — three lockups (icon-only, horizontal with wordmark, stacked with wordmark). Full color (yellow + black) preferred. Black on white for high-visibility small sizes.

### Locations (4)

- South Edmonton
- Downtown Edmonton
- West Edmonton
- Sherwood Park

## Target Persona — "Jessica"

32-year-old female professional. Desk-bound career. Active: running and yoga. Has booked massage/chiro before for pain relief. Spends ~$115/treatment, has comprehensive insurance benefits. TikTok + Instagram, ~143 min/day phone scroll.

This is the *primary* persona. The secondary persona (TMJ landing page) is similar but specifically dealing with jaw clenching, sleep bruxism, or stress-driven jaw tension.

## Values

Lead with **Clinical Excellence**. Supporting values: Accountability, Teamwork, Communication, Growth Mindset, Empowerment.

## Design system reference

Full aesthetic direction, principles, and don'ts live in `.impeccable.md`. The original brand book PDF lives at `./ACM Brand Book.pdf`. Re-read either when in doubt.

## Tech / deploy

Static site deployed on Vercel from this directory. Plain HTML/CSS/JS — no build step.

## Project structure

```
wellx/
├── brand.css                 # Shared tokens + generic components (every page imports this)
├── script.js                 # Shared JS (footer year, nav scroll, float-cta, data-reveal)
├── assets/
│   └── athletes_choice_rgb-3-copy.webp   # Real ACM logo, used via CSS mask-image on .brand-logo
├── template/
│   ├── _starter.html         # Annotated HTML skeleton — copy this to spin up a new variant
│   └── BLOCKS.md             # Block catalogue + 4-step recipe for building a new page
├── tmj/                      # The TMJ landing variant
│   ├── index.html            # → /tmj/
│   ├── page.css              # TMJ-only styles: .muscle* grid, .plate* anatomy frame
│   └── assets/
│       ├── gray382.png
│       └── gray383.png
├── index.html                # Redirect to /tmj/
└── .impeccable.md            # Aesthetic principles (read when designing)
```

**New variants** live at `/<variant>/` (e.g. `/back-pain/`, `/shoulder/`). Each variant is a subdirectory with its own `index.html`, optional `page.css`, and optional `assets/`. They import `../brand.css` and `../script.js`. Follow the recipe in `template/BLOCKS.md`.

## Tracking + experimentation

- **Primary conversion**: Book-CTA click, tracked via Meta Pixel (`InitiateCheckout`) and GA4 (`book_cta_click`). Hivemanager's booking flow is opaque to us — we cannot attribute booking completion end-to-end.
- **Variant split**: Meta ad-set level. One ad set per variant, each pointing at its `/<variant>/` URL. No in-repo traffic splitting yet (Vercel Edge Middleware is a future upgrade).
- **IDs**: Meta Pixel ID and GA4 Measurement ID live as constants at the top of `script.js`. Pixel/GA4 IDs are public — safe to commit. Script no-ops if either is left as the `TODO:` sentinel.
- **Per-page config**: every variant sets three meta tags in `<head>` — `variant`, `campaign`, and optional `page-category`. See `template/BLOCKS.md#tracking` for naming rules. UTMs are stamped on outbound booking links automatically on load.
- **Section-view events**: add `data-track-section="<name>"` to any `<section>` you want GA4 to count as "seen." The starter pre-wires anatomy/method/fit/faq/cta-final.
- **Results**: every experiment is logged in `RESULTS.md` — hypothesis, dates, variant numbers, decision. Append-only; never rewrite past entries.

## Deployment

- Hosted on Vercel as a static project. Plain HTML/CSS/JS, no build step.
- Production domain: **`book.athleteschoicemassage.ca`**. To wire:
  1. Vercel → Project → Settings → Domains → add `book.athleteschoicemassage.ca`.
  2. At DNS provider, add a `CNAME` record: `book` → `cname.vercel-dns.com`.
  3. TLS is auto-provisioned.
  4. Update Meta ad destinations to `https://book.athleteschoicemassage.ca/<variant>/`.
- `vercel.json` sets baseline security headers and a long `Cache-Control` for `/assets/**`. HTML is not cached aggressively so copy/layout edits show up on the next request.
