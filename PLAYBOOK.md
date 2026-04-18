# Playbook — creating and running landing-page variants

Day-to-day runbook for this project. **Reference docs:**
- `template/BLOCKS.md` — block catalogue (HTML snippets for every component)
- `.impeccable.md` — aesthetic principles (what we do / don't do)
- `CLAUDE.md` — brand voice, persona, project structure
- `RESULTS.md` — experiment decision log

This file answers: *how do I ship a new variant, iterate on an existing one, or retire a loser?*

---

## 30-second quickstart

```bash
cd wellx
cp template/_starter.html <variant>/index.html    # e.g. back-pain, shoulder, sciatica
mkdir -p <variant>/assets                         # only if the variant needs images
# … edit <variant>/index.html: every TODO gets real copy …
git add <variant>
git commit -m "Add <variant> landing page"
git push origin main                              # Vercel deploys automatically
```

Point a Meta ad set at `https://book.athleteschoicemassage.ca/<variant>/`. Done.

---

## Step-by-step (first time through)

### 1. Pick the variant name

Short, kebab-case, memorable. Becomes the URL path and the Meta UTM `utm_content`.

- ✅ `tmj`, `back-pain`, `shoulder`, `sciatica`, `desk-neck`
- ❌ `variant-a`, `test1`, `new-page`, `Back Pain`

If you're running a second version of an existing variant (after a test result), keep the name but suffix: `tmj-v2`. The campaign name stays the same so events roll up across versions.

### 2. Copy the starter

```bash
cp template/_starter.html <variant>/index.html
```

The starter already links `../brand.css` and `../script.js` correctly for any single-level subdir. No path rewrites needed.

### 3. Fill in the TODOs

Open `<variant>/index.html`. Every `TODO:` is a field to edit. Work top-down:

**Head:**
- `<title>` — under 60 chars, leads with the symptom/angle.
- `<meta name="description">` — one sentence, CTR-focused.
- `<meta property="og:title">` / `og:description` — what shows in Meta ad previews.
- **Tracking meta tags** — critical:
  - `variant` — the slug from step 1 (e.g. `back-pain`).
  - `campaign` — stable hypothesis name (e.g. `back-pain-desk-workers`). Shared across iterations.
  - `page-category` — optional Hivemanager category id. Leave empty if the booking flow doesn't need filtering.

**Body:**
- Hero title + highlighted phrase + lead + CTA label.
- Delete any BLOCK (`failures-dl`, `method-steps`, `fit-checklist`, `faq-details`, `cta-final`) you aren't using. Keep the order hero → slogan-strip → editorial blocks → fit → faq → cta-final → footer.
- Fill each block's copy. Match the coach voice — see `.impeccable.md` and `CLAUDE.md` for the rules ("never spa language").
- Update `data-track-section` names if they don't match what the block is about (e.g. rename `whyfail` → `myth-busts` if the section shifts framing).

### 4. Page-specific CSS (optional)

If the variant needs a new visual pattern — for example, a different anatomy diagram with a different treatment, or a new card layout — add `<variant>/page.css`:

```html
<!-- in the variant's <head>, AFTER brand.css -->
<link rel="stylesheet" href="./page.css" />
```

Move the inline `<style>` block that sets `--brand-logo-url` into `page.css`. Keep page-specific rules there. Don't edit `brand.css` — that's shared across every variant.

If you reuse the muscle-card or anatomy-plate pattern from TMJ, copy the selectors from `tmj/page.css` into the new `page.css`. If a third variant also uses them, consider promoting into `brand.css`.

### 5. Add variant-specific images

```bash
mkdir -p <variant>/assets
# drop images into <variant>/assets/
```

Reference them in HTML as `./assets/<file>`. Use compressed formats (WebP for photos, PNG for diagrams). Include `width` and `height` attributes on `<img>` to avoid layout shift.

### 6. Test locally

```bash
python3 -m http.server 8765
# open http://localhost:8765/<variant>/
```

Checks:
- Page renders identically to `/tmj/` in brand look.
- Nav Book CTA, hero CTAs, closing CTA, and float-cta all click through to the booking URL.
- DevTools console shows `[track] InitiateCheckout …` + `[track:ga] book_cta_click …` on click.
- Right-click a Book CTA → copy link → paste. URL has `?category=…&utm_source=meta&utm_medium=paid&utm_campaign=…&utm_content=<variant>` appended.
- Scroll through sections; each `data-track-section` fires once.
- `<details>` FAQs open/close. Float CTA appears below hero on mobile width.

### 7. Commit + push

```bash
git add <variant>
git commit -m "Add <variant> landing page"
git push origin main
```

Vercel builds a production deploy within ~60s. Watch the build in the Vercel dashboard if you want.

### 8. Point the ad

In Meta Ads Manager:
1. Create or clone an ad set targeting the audience for this variant.
2. Destination URL: `https://book.athleteschoicemassage.ca/<variant>/`
3. Objective: **Conversions**, optimizing for **InitiateCheckout** (our CTA-click event).
4. Budget: match whatever your competing variant gets so the test is apples-to-apples.

### 9. Log the test

Open `RESULTS.md`. Copy the template block to the bottom of the file. Fill in:
- Test name (`<symptom>-v1-vs-v2` or `<variant-a>-vs-<variant-b>`)
- Hypothesis
- Variants being compared
- Start date
- Primary + secondary metrics

Come back every 3–4 days to paste fresh numbers from GA4 + Meta Ads Manager.

---

## Verifying tracking is firing

**Meta Pixel:**
1. [Meta Events Manager](https://business.facebook.com/events_manager2) → Pixel `914136219918345` → **Test Events** tab.
2. Paste `https://book.athleteschoicemassage.ca/<variant>/` into the URL field.
3. The live page opens with test mode on. PageView fires immediately; click a Book CTA and watch `InitiateCheckout` arrive.

**GA4:**
1. [GA4](https://analytics.google.com) → Admin → **DebugView** on property `G-2RBZ1RPQNB`.
2. Visit the page with the [GA Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension enabled.
3. You should see `page_view`, `scroll`, `section_view` (one per section as you scroll), and `book_cta_click` on click — all stamped with `variant` and `campaign` params.

If an event doesn't fire, first check the meta tags in `<head>` are filled in (not still `TODO:`).

---

## Iterating on a variant

When a test result is in (see `RESULTS.md`), you usually want to keep the winning page but test a single tweak against it. Examples: new hero line, different CTA copy, reordered sections.

```bash
cp -r tmj tmj-v2                                 # or the current winner
# edit tmj-v2/index.html:
#   - change ONLY the element you're testing (single-variable changes are readable)
#   - update <meta name="variant"> to "tmj-v2"
#   - keep <meta name="campaign"> identical to tmj so events roll up to the same campaign
```

Commit, push, point a second Meta ad set at `/tmj-v2/`, and log the new test in `RESULTS.md`.

**Why keep campaign stable:** GA4 reports slice by `campaign` by default. A consistent campaign name across `tmj`, `tmj-v2`, `tmj-v3` lets you see long-term CTR trending as you iterate, not a fresh report for every tweak.

---

## Retiring a variant

When `RESULTS.md` shows a clear loser, stop sending traffic to it:
1. Pause the Meta ad set pointing at the losing URL.
2. Optional but recommended: delete the variant directory from the repo. Keeps the repo clean and prevents accidental future traffic.

```bash
git rm -r <loser>
git commit -m "Retire <loser> variant — see RESULTS.md"
git push origin main
```

The directory is gone from production on next deploy. Git history preserves it if you need to resurrect it later.

---

## Common gotchas

| Problem | Cause | Fix |
|---|---|---|
| New variant 404s on book.athleteschoicemassage.ca | Vercel hasn't finished deploying | Watch build in Vercel dashboard; give it 60s. |
| CSS is broken on new variant | Path typo in `<link rel="stylesheet">` | Must be `../brand.css` — starter has it correct. |
| Logo doesn't show up | Missing `--brand-logo-url` in CSS | Starter's inline `<style>` sets it. If moved to `page.css`, include it there. |
| CTA click doesn't track | Meta tags still say `TODO:` | Fill in `variant` + `campaign` in `<head>`. |
| Section view events missing | Section is missing `data-track-section` | Add the attribute to the outer `<section>`. |
| Brand book / CLAUDE.md accidentally public | Added a new doc to repo root | Add it to `.vercelignore`. |
| Force-push is denied by Claude | Intentional safety rule in `.claude/settings.json` | Run the force-push yourself in terminal if you really need to. |

---

## One-line reminders

- **Never edit `brand.css`** to change a specific variant's look. Use `page.css` in the variant dir.
- **One hypothesis per test.** Changing hero + CTA + images at once means you can't tell which one moved the needle.
- **Internal docs are gitignored from the deploy** via `.vercelignore`. If you add a new internal doc, add it there too.
- **Pixel / GA4 IDs live at the top of `script.js`.** Public identifiers, safe to commit. Replace with new IDs there if ACM ever switches.
- **`RESULTS.md` is append-only.** Don't rewrite past decisions — they're institutional memory.
