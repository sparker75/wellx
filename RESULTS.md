# Experiment log — ACM landing pages

Running log of landing-page A/B tests. Append a new entry when a test starts; update in place while running; never rewrite history after calling a winner — past decisions are institutional memory.

**Primary metric**: CTA click rate (Book CTA clicks ÷ sessions) — measured in GA4, ground truth for which variant Meta sends more intent to.
**Secondary metrics**: scroll depth, section views, time on page, device split.
**Booking completions**: currently unobservable end-to-end (Hivemanager is opaque). UTMs on outbound links are set up so that if Hivemanager ever exposes booking-level attribution, historical data will be there.

**Decision rules**
- Each variant runs ≥14 days to absorb day-of-week swings.
- Each variant accumulates ≥200 CTA clicks before calling a winner.
- Use a Bayesian calculator (e.g. [GrowthBook's online calc](https://www.growthbook.io/stats)) for "p(A > B)". Call the winner at p ≥ 0.90.
- If neither crosses after 4 weeks, declare a tie and pick the simpler copy.

---

## Template (copy this for each new test)

```markdown
## <test-name> — YYYY-MM-DD → YYYY-MM-DD

**Hypothesis**: <what we think will beat what, and why>
**Variants**: /<variant-a>/ vs /<variant-b>/
**Campaign name**: <campaign meta tag, shared by both variants>
**Traffic split**: Meta ad-set level, equal budget / same audience
**Primary metric**: CTA click rate
**Secondary**: section_view reach, scroll depth, time on page

### Results (updated YYYY-MM-DD)

| Variant        | Sessions | CTA clicks | CTR   | Scroll to #method | Notes            |
|----------------|---------:|-----------:|------:|------------------:|------------------|
| /<variant-a>/  |        0 |          0 |  0.0% |              0.0% |                  |
| /<variant-b>/  |        0 |          0 |  0.0% |              0.0% |                  |

**Bayesian p(A > B)**: — (calc: )
**Decision**: <ship A / ship B / iterate / tie>
**Learnings**:
- <one-line takeaway>
- <another>
```

---

## Tests

<!-- Append each test as a new H2 section below. Most recent at the bottom. -->
