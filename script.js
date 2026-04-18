(() => {
  // ============================================================
  //  ACM landing pages — shared runtime
  //  Behavior:  year stamp, nav scroll state, float-cta visibility,
  //             reveal-on-scroll, Meta Pixel + GA4, CTA + section events,
  //             UTM stamping of outbound booking links.
  //  Config:    META_PIXEL_ID / GA4_ID constants below (both optional).
  //             Per-page meta tags: variant, campaign, page-category.
  // ============================================================

  // ---- Config ----
  // Pixel + GA4 IDs are public identifiers, safe to commit.
  // Leave as TODO sentinels in dev — script no-ops cleanly.
  const META_PIXEL_ID = "914136219918345";
  const GA4_ID        = "G-2RBZ1RPQNB";
  const BOOKING_HOST  = "app.hivemanager.io";

  const hasPixel = META_PIXEL_ID && !META_PIXEL_ID.startsWith("TODO");
  const hasGA4   = GA4_ID && !GA4_ID.startsWith("TODO");
  const isDev    = ["localhost", "127.0.0.1"].includes(location.hostname);

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ---- Per-page config (read from <meta> tags) ----
  const readMeta = (name) =>
    document.querySelector(`meta[name="${name}"]`)?.content?.trim() || "";

  const config = {
    variant:      readMeta("variant")       || "unknown",
    campaign:     readMeta("campaign")      || "unknown",
    pageCategory: readMeta("page-category") || "",
  };

  // ---- Meta Pixel ----
  if (hasPixel) {
    // Standard Meta Pixel bootstrap (condensed).
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  // ---- GA4 ----
  if (hasGA4) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID, {
      send_page_view: true,
      // Stamp every event with the variant/campaign so any report can slice by them.
      variant: config.variant,
      campaign: config.campaign,
    });
  }

  // Tiny shims so call sites don't need to check hasPixel/hasGA4 everywhere.
  const track = (name, params = {}) => {
    if (hasPixel) window.fbq("track", name, params);
    if (hasGA4)
      window.gtag("event", name, {
        ...params,
        variant: config.variant,
        campaign: config.campaign,
      });
    if (isDev) console.info("[track]", name, { ...params, ...config });
  };
  const trackGA = (name, params = {}) => {
    if (hasGA4)
      window.gtag("event", name, {
        ...params,
        variant: config.variant,
        campaign: config.campaign,
      });
    if (isDev) console.info("[track:ga]", name, { ...params, ...config });
  };

  // ---- UTM stamping on outbound booking links ----
  // Run once on load. Handles middle-click, right-click-copy, etc.
  const stampBookingLinks = () => {
    const links = document.querySelectorAll(`a[href*="${BOOKING_HOST}"]`);
    links.forEach((a) => {
      try {
        const url = new URL(a.href);
        const params = url.searchParams;

        // Preserve any category already baked into the href;
        // otherwise apply the page-level category meta tag.
        if (!params.has("category") && config.pageCategory) {
          params.set("category", config.pageCategory);
        }

        // Apply UTMs only if absent — don't stomp anything the author set explicitly.
        if (!params.has("utm_source"))   params.set("utm_source", "meta");
        if (!params.has("utm_medium"))   params.set("utm_medium", "paid");
        if (!params.has("utm_campaign")) params.set("utm_campaign", config.campaign);
        if (!params.has("utm_content"))  params.set("utm_content", config.variant);

        // Passthrough: if Meta appended fbclid, carry it into utm_term so it
        // appears in any downstream booking report that surfaces UTMs.
        const fbclid = new URLSearchParams(location.search).get("fbclid");
        if (fbclid && !params.has("utm_term")) {
          params.set("utm_term", `fbclid:${fbclid.slice(0, 24)}`);
        }

        url.search = params.toString();
        a.href = url.toString();
      } catch (_) {
        // Malformed href — skip.
      }
    });
  };

  // ---- CTA click tracking ----
  // Delegated click handler so dynamically-added CTAs also work.
  const wireCTAs = () => {
    document.addEventListener(
      "click",
      (e) => {
        const a = e.target.closest(`a[href*="${BOOKING_HOST}"]`);
        if (!a) return;

        // Classify CTA by its container.
        const location =
          a.classList.contains("nav-cta")
            ? "nav"
            : a.classList.contains("float-cta")
            ? "float"
            : a.closest(".cta-final")
            ? "cta-final"
            : a.closest(".hero")
            ? "hero"
            : a.closest(".footer")
            ? "footer"
            : "other";

        track("InitiateCheckout", {
          content_name: config.variant,
          content_category: config.campaign,
          source: location,
        });
        trackGA("book_cta_click", { cta_location: location });
      },
      { passive: true, capture: true }
    );
  };

  // ---- Section view tracking ----
  const wireSectionViews = () => {
    const targets = document.querySelectorAll("[data-track-section]");
    if (!targets.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      // Don't fire a burst of events on load; stay silent.
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const name = entry.target.getAttribute("data-track-section");
          trackGA("section_view", { section: name });
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );
    targets.forEach((el) => io.observe(el));
  };

  // ---- Existing UI behaviors (unchanged in spirit) ----

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Nav: scrolled state + float-cta visibility
  const nav = document.querySelector(".nav");
  const floatCta = document.querySelector(".float-cta");
  const hero = document.querySelector(".hero");

  const onScroll = () => {
    const y = window.scrollY || 0;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);

    if (floatCta && hero) {
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const nearBottom =
        window.innerHeight + y > document.body.scrollHeight - 200;
      const shouldShow = y > heroBottom && !nearBottom;
      floatCta.classList.toggle("is-visible", shouldShow);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  }

  // ---- Boot ----
  stampBookingLinks();
  wireCTAs();
  wireSectionViews();
})();
