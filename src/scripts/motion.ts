import { animate, inView, stagger } from "motion";
import Lenis from "lenis";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const isDesktopHover = window.matchMedia(
  "(hover: hover) and (pointer: fine)",
).matches;

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/* ============================================================
   LOADER — manifesto word cycle → name assembly → curtain exit
   Design / Detail / Restraint cycle through a line mask, then
   "Victor Olave." builds letter by letter and the whole screen
   clips away upward like a curtain.
   ============================================================ */
export function setupLoader(): Promise<void> {
  return new Promise((resolve) => {
    const loader = document.getElementById("loader");
    const bar = document.getElementById("loader-bar");
    const words = loader
      ? Array.from(loader.querySelectorAll<HTMLElement>("[data-loader-word]"))
      : [];
    const name = loader?.querySelector<HTMLElement>("[data-loader-name]");
    if (!loader || !bar || !name || words.length === 0) {
      resolve();
      return;
    }

    document.body.classList.add("loader-active");

    const finish = () => {
      loader.style.display = "none";
      document.body.classList.remove("loader-active");
      document.documentElement.classList.add("loaded");
      // Removing overflow:hidden can restore a persistent scrollbar and
      // narrow the layout — nudge every fit/scroll driver to re-measure.
      window.dispatchEvent(new Event("resize"));
      resolve();
    };

    if (prefersReducedMotion) {
      finish();
      return;
    }

    // Split the name into letter spans (keeps the rose "." span intact)
    const letters: HTMLElement[] = [];
    const frag = document.createDocumentFragment();
    Array.from(name.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        for (const ch of node.textContent ?? "") {
          const s = document.createElement("span");
          s.textContent = ch;
          s.style.display = "inline-block";
          if (ch === " ") s.style.whiteSpace = "pre";
          frag.appendChild(s);
          letters.push(s);
        }
      } else if (node instanceof HTMLElement) {
        node.style.display = "inline-block";
        frag.appendChild(node);
        letters.push(node);
      }
    });
    name.textContent = "";
    name.appendChild(frag);
    letters.forEach((l) => {
      l.style.transform = "translateY(120%)";
      l.style.opacity = "0";
    });
    // Letters are hidden now — the container can become visible
    // (it ships with opacity: 0 inline to avoid a pre-JS flash)
    name.style.opacity = "1";

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const STEP = 400; // ms each manifesto word dwells (entrance included)
    const EXIT_MS = 280;
    const EASE_IN_EXPO = [0.7, 0, 0.84, 0] as const;

    (async () => {
      // Hairline rides the full word + name sequence
      const total = (words.length * (STEP + EXIT_MS) + 650) / 1000;
      animate(
        bar,
        { transform: ["scaleX(0)", "scaleX(1)"] },
        { duration: total, ease: [0.3, 0, 0.2, 1] },
      );

      for (const w of words) {
        animate(
          w,
          {
            transform: ["translateY(130%)", "translateY(0%)"],
            opacity: [0, 1],
            filter: ["blur(10px)", "blur(0px)"],
          },
          { duration: 0.5, ease: EASE_OUT_EXPO },
        );
        await sleep(STEP);
        // Fully await the exit so the next word never shares the stage
        await animate(
          w,
          {
            transform: ["translateY(0%)", "translateY(-130%)"],
            opacity: [1, 0],
            filter: ["blur(0px)", "blur(8px)"],
          },
          { duration: EXIT_MS / 1000, ease: EASE_IN_EXPO },
        );
      }

      // Name assembles letter by letter through the same mask
      animate(
        letters,
        { transform: ["translateY(120%)", "translateY(0%)"], opacity: [0, 1] },
        { duration: 0.55, delay: stagger(0.026), ease: EASE_OUT_EXPO },
      );
      await sleep(600);

      // EXIT — rose sweep: a full-height rose panel wipes bottom→top across
      // the screen in one continuous pass; the dark base clips away just
      // behind the panel, so its trailing edge unveils the finished hero.
      const veil = loader.querySelector<HTMLElement>("[data-loader-veil]");

      animate(
        name,
        { transform: ["translateY(0%)", "translateY(-40%)"], opacity: [1, 0] },
        { duration: 0.5, ease: EASE_OUT_EXPO },
      );

      if (veil) {
        // The clip runs faster than the sweep so every point is removed
        // while still covered by rose — the trailing edge never exposes
        // leftover dark loader, only hero.
        animate(
          loader,
          { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] },
          { duration: 0.5, delay: 0.1, ease: [0.76, 0, 0.24, 1] },
        );
        await animate(
          veil,
          { transform: ["translateY(101%)", "translateY(-101%)"] },
          { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
        );
      } else {
        // Fallback — simple curtain if the veil is missing
        await animate(
          loader,
          { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"] },
          { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
        );
      }
      finish();
    })();
  });
}

/* ============================================================
   SMOOTH SCROLL — Lenis inertia layer (the one library from the
   "cinematic" brief worth its weight: ~2kb, native scroll position
   so all getBoundingClientRect-based effects keep working).
   ============================================================ */
export function setupSmoothScroll() {
  if (prefersReducedMotion) return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const raf = (time: number) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Hand anchor jumps to Lenis so they ride the same inertia curve.
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0 });
    });
  });
}

/* ============================================================
   CUSTOM CURSOR — circle that follows the mouse
   Scales/labels on hovering interactive elements
   ============================================================ */
export function setupCustomCursor() {
  if (!isDesktopHover || prefersReducedMotion) return;
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  const label = document.getElementById("cursor-label");
  if (!dot || !ring || !label) return;

  document.documentElement.classList.add("cursor-ready");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const loop = () => {
    dotX += (mouseX - dotX) * 0.9;
    dotY += (mouseY - dotY) * 0.9;
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  const setLabel = (text: string | null) => {
    if (text) {
      label.textContent = text;
      label.style.opacity = "1";
      ring.style.width = "84px";
      ring.style.height = "84px";
      ring.style.background = "var(--color-rose)";
      ring.style.borderColor = "var(--color-rose)";
      dot.style.opacity = "0";
    } else {
      label.style.opacity = "0";
      label.textContent = "";
      ring.style.width = "36px";
      ring.style.height = "36px";
      ring.style.background = "transparent";
      ring.style.borderColor = "var(--color-fg-primary)";
      dot.style.opacity = "1";
    }
  };

  // Track hoverables
  document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((el) => {
    const text = el.dataset.cursor || null;
    el.addEventListener("mouseenter", () => setLabel(text));
    el.addEventListener("mouseleave", () => setLabel(null));
  });

  // Generic small hover for any link/button
  document
    .querySelectorAll<HTMLElement>("a, button, [role='button']")
    .forEach((el) => {
      if (el.dataset.cursor !== undefined) return; // already handled
      el.addEventListener("mouseenter", () => {
        ring.style.width = "56px";
        ring.style.height = "56px";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "36px";
        ring.style.height = "36px";
      });
    });
}

/* ============================================================
   SCROLL PROGRESS — 1px rose line at the top
   ============================================================ */
export function setupScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${pct})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/* ============================================================
   SECTION REVEALS — fade-up on enter viewport
   ============================================================ */
export function setupSectionReveals() {
  if (prefersReducedMotion) return;

  const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");

  targets.forEach((el) => {
    inView(
      el,
      () => {
        const children = el.querySelectorAll<HTMLElement>("[data-reveal-child]");

        if (children.length > 0) {
          animate(
            Array.from(children),
            { opacity: [0, 1], transform: ["translateY(28px)", "translateY(0px)"] },
            { duration: 1, delay: stagger(0.08), ease: EASE_OUT_EXPO },
          );
        } else {
          animate(
            el,
            { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] },
            { duration: 0.9, ease: EASE_OUT_EXPO },
          );
        }
      },
      { amount: 0.15 },
    );
  });
}

/* ============================================================
   PARALLAX — vertical translate on scroll
   ============================================================ */
export function setupParallax() {
  if (prefersReducedMotion) return;

  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax]"),
  );
  if (!els.length) return;

  // Parallax only on desktop — on small screens stacked columns would overlap.
  const desktop = window.matchMedia("(min-width: 768px)");

  const update = () => {
    if (!desktop.matches) {
      els.forEach((el) => {
        el.style.transform = "";
      });
      return;
    }
    const vh = window.innerHeight;
    els.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const speed = Number(el.dataset.parallaxSpeed ?? "0.12");
      const center = rect.top + rect.height / 2;
      let offset = (center - vh / 2) * -speed;
      // A layer clipped by overflow:hidden may only travel as far as the
      // overscan it was given, otherwise it uncovers the box on tall screens.
      const max = Number(el.dataset.parallaxMax);
      if (Number.isFinite(max)) offset = Math.max(-max, Math.min(max, offset));
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });
  };

  desktop.addEventListener("change", update);

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
  update();
}

/* ============================================================
   STACK CARDS — the featured handoff. Each case pins via CSS sticky
   as a full-bleed stage; as the next one rises and takes the section
   over, the outgoing layer recedes (subtle scale + dim) so the
   takeover has depth instead of a flat swap. The sticky element is
   the layer; we only transform the inner wrapper, so pinning and the
   recede never compete for the same `transform`. Desktop only —
   below 1024px the cases render in plain flow (CSS).
   ============================================================ */
export function setupStackCards() {
  if (prefersReducedMotion) return;
  const stack = document.querySelector<HTMLElement>("[data-stack]");
  if (!stack) return;

  // Same breakpoint as the sticky pin in WorkSection — below it the cases flow.
  const desktop = window.matchMedia("(min-width: 1024px)");
  const cards = Array.from(
    stack.querySelectorAll<HTMLElement>("[data-stack-item]"),
  ).map((item) => ({
    item,
    panel: item.querySelector<HTMLElement>("[data-stack-panel]"),
  }));
  if (cards.length < 2) return;

  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

  const reset = () => {
    cards.forEach(({ panel }) => {
      if (!panel) return;
      panel.style.transform = "";
      panel.style.opacity = "";
    });
  };

  const update = () => {
    if (!desktop.matches) {
      reset();
      return;
    }
    const vh = window.innerHeight;
    // Every card except the last recedes as the one after it climbs over.
    for (let i = 0; i < cards.length - 1; i++) {
      const cur = cards[i].panel;
      if (!cur) continue;
      // top:0 → parseFloat is 0, which is falsy; guard so `|| fallback`
      // doesn't silently turn a real 0 offset into something else.
      const topRaw = parseFloat(getComputedStyle(cards[i].item).top);
      const stickyTop = Number.isFinite(topRaw) ? topRaw : 0;
      const nextTop = cards[i + 1].item.getBoundingClientRect().top;
      // 0 when the next stage is a viewport away, → 1 as it pins on top.
      const p = clamp01((vh - nextTop) / (vh - stickyTop));
      const eased = p * p * (3 - 2 * p); // smoothstep
      cur.style.transform = `scale(${(1 - 0.04 * eased).toFixed(4)})`;
      cur.style.opacity = String(1 - 0.28 * eased);
    }
    const last = cards[cards.length - 1].panel;
    if (last) {
      last.style.transform = "";
      last.style.opacity = "";
    }
  };

  let ticking = false;
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  desktop.addEventListener("change", update);
  update();
}

/* ============================================================
   MANIFESTO REVEAL — the statement words start dim and brighten as
   the section scrolls through the reading zone, word by word, like a
   reading light sweeping across the line. Scroll-linked and reversible.
   Reduced motion opts out (CSS shows the words at full opacity).
   ============================================================ */
export function setupManifestoReveal() {
  if (prefersReducedMotion) return;

  const section = document.getElementById("manifesto");
  if (!section) return;
  const h2 = section.querySelector<HTMLElement>("h2");
  const words = Array.from(
    section.querySelectorAll<HTMLElement>("[data-manifesto-word]"),
  );
  if (!h2 || !words.length) return;

  const DIM = 0.18; // matches the CSS resting opacity
  const N = words.length;
  const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

  const update = () => {
    const vh = window.innerHeight;
    const rect = h2.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    // P: 0 while the statement's centre sits low (90% down the viewport),
    // → 1 once it has risen into the reading zone (40% down). About half a
    // screen of scroll drives the full brighten.
    const P = clamp01((vh * 0.9 - center) / (vh * 0.5));

    words.forEach((w, i) => {
      // Stagger each word's start across the first 70% of P; each then
      // brightens over a 30% window, so neighbours overlap and the sweep
      // reads as continuous rather than stepped.
      const start = (i / N) * 0.7;
      const wp = clamp01((P - start) / 0.3);
      const eased = wp * wp * (3 - 2 * wp); // smoothstep
      w.style.opacity = (DIM + (1 - DIM) * eased).toFixed(3);
    });
  };

  let ticking = false;
  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  update();
}

/* ============================================================
   FIT HEADINGS — on mobile, scale a multi-line display heading so its
   widest line nearly fills the column. The CSS clamp floors at a fixed
   size on small screens, so the title stops short of the edge; here we
   measure the widest line and size to fill. Desktop hands sizing back to
   the clamp. Same idea as setupHeroNameFit, generalised via [data-fit].
   ============================================================ */
export function setupFitHeadings() {
  const headings = Array.from(
    document.querySelectorAll<HTMLElement>("[data-fit]"),
  );
  if (!headings.length) return;

  const mobile = window.matchMedia("(max-width: 767px)");
  const BASE = 100; // probe size used only to measure intrinsic line width
  const FILL = 0.94; // default fraction of the column width the widest line fills

  const fit = (h: HTMLElement) => {
    if (!mobile.matches) {
      // Desktop owns sizing via the CSS clamp — drop the inline override.
      h.style.removeProperty("font-size");
      return;
    }
    const lines = Array.from(
      h.querySelectorAll<HTMLElement>("[data-fit-line]"),
    );
    if (!lines.length) return;
    const avail = h.clientWidth;
    if (avail <= 0) return;

    // Per-element fill override via data-fit="0.9"; falls back to the default.
    const override = parseFloat(h.dataset.fit || "");
    const fill = Number.isFinite(override) ? override : FILL;

    // Measure each line at a known size (lines are nowrap, so scrollWidth is
    // their intrinsic width), scale to the widest one.
    h.style.fontSize = `${BASE}px`;
    let maxW = 0;
    lines.forEach((l) => (maxW = Math.max(maxW, l.scrollWidth)));
    if (maxW <= 0) return;
    h.style.fontSize = `${Math.floor(BASE * ((avail * fill) / maxW))}px`;
  };

  const fitAll = () => headings.forEach(fit);

  fitAll();
  // Re-fit once the display font has loaded — measuring against the fallback
  // serif would size the heading wrong (FOUT).
  if (document.fonts?.ready) document.fonts.ready.then(fitAll);
  window.addEventListener("resize", fitAll, { passive: true });
  mobile.addEventListener("change", fitAll);
}

/* ============================================================
   HERO NAME FIT — on mobile the stacked name should nearly fill the
   available width. Font metrics make a fixed clamp unreliable, so we
   measure the wider word and scale the shared font-size to fill ~92%.
   On desktop we clear the inline size and let the CSS clamp own it.
   ============================================================ */
export function setupHeroNameFit() {
  const section = document.getElementById("hero");
  if (!section) return;
  const container = section.querySelector<HTMLElement>(".hero-names");
  const names = Array.from(
    section.querySelectorAll<HTMLElement>(
      "[data-hero-name-left], [data-hero-name-right]",
    ),
  );
  if (!container || !names.length) return;

  const mobile = window.matchMedia("(max-width: 767px)");
  const BASE = 100; // probe size used only to measure intrinsic word width
  const FILL = 0.92; // fraction of the available width the name should occupy

  const fit = () => {
    if (!mobile.matches) {
      // Desktop owns sizing via the CSS clamp + split driver.
      names.forEach((el) => el.style.removeProperty("font-size"));
      return;
    }
    const cs = getComputedStyle(container);
    const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const avail = container.clientWidth - padX;
    if (avail <= 0) return;

    // Measure each word at a known size, scale to the WIDER one so both share
    // a single font-size (kept visually consistent; the narrower word simply
    // doesn't reach the edge — which reinforces the staggered look).
    let maxW = 0;
    names.forEach((el) => {
      el.style.fontSize = `${BASE}px`;
      maxW = Math.max(maxW, el.scrollWidth);
    });
    if (maxW <= 0) return;
    const size = Math.round(BASE * ((avail * FILL) / maxW));
    names.forEach((el) => (el.style.fontSize = `${size}px`));
  };

  fit();
  // Re-fit once Fraunces has loaded — measuring against the fallback serif
  // would size the name wrong (FOUT).
  if (document.fonts?.ready) document.fonts.ready.then(fit);
  window.addEventListener("resize", fit, { passive: true });
  mobile.addEventListener("change", fit);
}

/* ============================================================
   HERO SPLIT — scroll opens the name like a curtain to reveal the
   portrait, which grows to full-bleed (inspired by lukebaffait.fr).
   Driven by writing inline styles to the [data-hero-*] targets.
   ============================================================ */
export function setupHeroSplit() {
  const section = document.getElementById("hero");
  if (!section) return;

  const media = section.querySelector<HTMLElement>("[data-hero-media]");
  const statement = section.querySelector<HTMLElement>("[data-hero-statement]");
  const left = section.querySelector<HTMLElement>("[data-hero-name-left]");
  const right = section.querySelector<HTMLElement>("[data-hero-name-right]");
  const bg = section.querySelector<HTMLElement>("[data-hero-bg]");
  const fading = Array.from(
    section.querySelectorAll<HTMLElement>("[data-hero-desc], [data-hero-bar]"),
  );

  // Two scroll-driven layouts share this pin:
  //  · desktop (≥768px): the name splits like a curtain and a clip-path iris
  //    reveals the statement panel.
  //  · mobile (<768px): clip-path iris is janky on touch GPUs, so the name
  //    cross-fades/scales out while the statement fades + scales in. Same
  //    meaning (name → statement), and it surfaces the statement that the
  //    desktop reveal shows. The branch is re-checked each frame so rotation
  //    between layouts is handled.
  // Reduced motion opts out entirely (CSS collapses the hero to one viewport).
  const desktop = window.matchMedia("(min-width: 768px)");
  if (prefersReducedMotion) return;

  // Maps a value from [a, b] into [0, 1], clamped.
  const range = (p: number, a: number, b: number) =>
    Math.min(1, Math.max(0, (p - a) / (b - a)));
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  // Gap kept between each name's inner edge and the image edge.
  const PAD = 28;

  let rafId: number | null = null;

  const update = () => {
    rafId = null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const distance = Math.max(1, section.offsetHeight - vh);
    const p = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / distance));

    if (desktop.matches) {
      // ---------- DESKTOP: curtain split + clip-path iris reveal ----------
      // Phase 1 — text rises from lower-centre to the vertical middle.
      const rise = easeOut(range(p, 0, 0.3));
      const riseY = (1 - rise) * vh * 0.28;

      // Phase 2 — iris reveal: a circle grows from the centre, morphs through a
      // rounded square, and ends as the full-viewport rectangle. Using clip-path
      // (not a scaled box) keeps the circle perfectly round on any aspect ratio
      // and guarantees a clean full rectangle at the end — no leftover square.
      const grow = easeOut(range(p, 0.28, 1));
      const Rmin = 18;
      const Rmatch = Math.min(vw, vh) * 0.3; // circle radius where it morphs

      let shapeW = Rmin * 2;
      if (media) {
        if (grow < 0.5) {
          // Growing circle.
          const r = Rmin + (Rmatch - Rmin) * (grow / 0.5);
          media.style.clipPath = `circle(${r.toFixed(1)}px at 50% 50%)`;
          shapeW = r * 2;
        } else {
          // Rounded inset expanding to the full rectangle. At k=0 the inset
          // (a 2·Rmatch square with radius Rmatch) equals the matching circle.
          const k = (grow - 0.5) / 0.5;
          const insetX = (vw / 2 - Rmatch) * (1 - k);
          const insetY = (vh / 2 - Rmatch) * (1 - k);
          const rad = Rmatch * (1 - k);
          media.style.clipPath =
            `inset(${insetY.toFixed(1)}px ${insetX.toFixed(1)}px round ${rad.toFixed(1)}px)`;
          shapeW = vw - 2 * insetX;
        }
        media.style.opacity = String(range(p, 0.28, 0.45));
      }

      // Statement text scales with the reveal for a "grows from a dot" feel.
      if (statement) {
        statement.style.transform = `scale(${(0.55 + 0.45 * grow).toFixed(4)})`;
      }

      // Names split by the revealed shape's half-width + padding — the shape
      // width is the single source of truth for the separation.
      const sep = shapeW / 2 + PAD;
      if (left) {
        left.style.opacity = "";
        left.style.transform = `translate(${-sep}px, calc(-50% + ${riseY}px))`;
      }
      if (right) {
        right.style.opacity = "";
        right.style.transform = `translate(${sep}px, calc(-50% + ${riseY}px))`;
      }
    } else {
      // ---------- MOBILE: cross-fade handoff (name out → statement in) ------
      // Names are stacked (flex-col), so we fade + lift + shrink them instead
      // of splitting, then bring the statement up by opacity (clip-path off).
      const nameOut = easeOut(range(p, 0, 0.4));
      const nameY = -nameOut * vh * 0.15;
      const nameScale = 1 - nameOut * 0.2;
      const nameOpacity = 1 - nameOut;
      [left, right].forEach((el) => {
        if (!el) return;
        el.style.transform =
          `translateY(${nameY.toFixed(1)}px) scale(${nameScale.toFixed(3)})`;
        // At the very top let the CSS intro fade-in own opacity; once scrolling
        // we must use !important to beat that animation's `fill: both`.
        if (p <= 0.001) {
          el.style.removeProperty("opacity");
        } else {
          el.style.setProperty("opacity", String(nameOpacity), "important");
        }
      });

      if (media) {
        media.style.clipPath = "none";
        media.style.opacity = String(range(p, 0.42, 0.8));
      }
      if (statement) {
        const s = 0.82 + 0.18 * easeOut(range(p, 0.42, 0.95));
        statement.style.transform = `scale(${s.toFixed(4)})`;
      }
    }

    // Gradient recedes as the statement panel takes over.
    if (bg) bg.style.opacity = String(0.95 - range(p, 0, 0.6) * 0.6);

    // Descriptor + bottom bar are hero-exclusive: fade out fully and early,
    // well before the statement panel starts appearing (at p≈0.28).
    // Must use !important — the intro `hero-fade-in` animation (fill: both)
    // otherwise wins the cascade over inline opacity and pins them visible.
    const uiOpacity = 1 - range(p, 0, 0.14);
    fading.forEach((el) => {
      if (p <= 0.001) {
        // Let the CSS intro animation own opacity at the very top.
        el.style.removeProperty("opacity");
        el.style.removeProperty("pointer-events");
      } else {
        el.style.setProperty("opacity", String(uiOpacity), "important");
        el.style.pointerEvents = uiOpacity < 0.05 ? "none" : "";
      }
    });
  };

  const requestUpdate = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
}

/* ============================================================
   SIDE RAILS — left section counter + right "you are here" nav
   ============================================================ */
export function setupSideRails() {
  const links = Array.from(
    document.querySelectorAll<HTMLElement>("[data-rail-link]"),
  );
  if (!links.length) return;

  const counter = document.querySelector<HTMLElement>("[data-rail-counter]");
  const ids = links.map((l) => l.dataset.railLink ?? "");
  let current = -1;

  const setActive = (idx: number) => {
    if (idx === current) return;
    current = idx;
    links.forEach((l, i) => l.classList.toggle("is-active", i === idx));
    if (counter) counter.textContent = String(idx + 1).padStart(2, "0");
  };

  let rafId: number | null = null;
  const spy = () => {
    rafId = null;
    let activeIdx = 0;
    const line = window.innerHeight * 0.4;
    for (let i = 0; i < ids.length; i++) {
      const el = document.getElementById(ids[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= line) activeIdx = i;
    }
    setActive(activeIdx);

    // Flip chrome theme when the active section is a light zone.
    const activeEl = document.getElementById(ids[activeIdx]);
    document.documentElement.classList.toggle(
      "on-light",
      activeEl?.dataset.theme === "light",
    );
  };

  const request = () => {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(spy);
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request, { passive: true });
  spy();
}

/* ============================================================
   ACCORDION — progressive-enhanced expand/collapse (Skills).
   CSS owns the height animation (grid-template-rows); JS only
   toggles state and ARIA. Without JS, panels stay open.
   ============================================================ */
export function setupAccordion() {
  const roots = document.querySelectorAll<HTMLElement>("[data-acc-root]");
  roots.forEach((root) => {
    const items = Array.from(
      root.querySelectorAll<HTMLElement>("[data-acc-item]"),
    );
    items.forEach((item) => {
      const trigger = item.querySelector<HTMLElement>("[data-acc-trigger]");
      if (!trigger) return;

      const startOpen = item.dataset.accDefault === "open";
      item.classList.toggle("is-open", startOpen);
      trigger.setAttribute("aria-expanded", String(startOpen));

      trigger.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        item.classList.toggle("is-open", willOpen);
        trigger.setAttribute("aria-expanded", String(willOpen));
      });
    });
  });
}

/* ============================================================
   MAGNETIC — interactive CTAs gently pull toward the cursor, then
   spring back on leave. The CSS transition on transform does the
   smoothing (a lagged follow reads as "magnetic"). Desktop + fine
   pointer only; reduced motion opts out.
   ============================================================ */
export function setupMagnetic() {
  if (!isDesktopHover || prefersReducedMotion) return;

  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-magnetic]"),
  );

  els.forEach((el) => {
    const strength = Number(el.dataset.magnetic) || 0.35;
    const MAX = 14; // px — cap the pull so it stays subtle

    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const x = Math.max(-MAX, Math.min(MAX, dx * strength));
      const y = Math.max(-MAX, Math.min(MAX, dy * strength));
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0px, 0px)";
    });
  });
}

/* ============================================================
   KINETIC HEADINGS — the big serif divider words settle into place:
   each letter rises + fades on a stagger, while the whole word morphs
   its Fraunces variable axes (weight + softness) from thin/hard to
   full/soft — a "the type finds its form" reveal. One-shot on enter.
   Reduced motion: CSS shows letters at rest, JS skips.
   ============================================================ */
export function setupKineticHeadings() {
  if (prefersReducedMotion) return;

  const heads = Array.from(
    document.querySelectorAll<HTMLElement>("[data-kinetic]"),
  );

  heads.forEach((h) => {
    const letters = Array.from(
      h.querySelectorAll<HTMLElement>("[data-kinetic-letter]"),
    );
    if (!letters.length) return;

    inView(
      h,
      () => {
        animate(
          letters,
          { opacity: [0, 1], transform: ["translateY(0.45em)", "translateY(0em)"] },
          { duration: 1, delay: stagger(0.045), ease: EASE_OUT_EXPO },
        );
        // Variable-axis settle — thin/hard → full/soft. Drives registered
        // custom props the heading's font-variation-settings reads.
        // Axis ranges match the loaded Fraunces (wght 300..700, SOFT 30..100).
        animate(
          h,
          { "--kinetic-wght": [300, 340], "--kinetic-soft": [30, 100] },
          { duration: 1.2, ease: EASE_OUT_EXPO },
        );
      },
      { amount: 0.5 },
    );
  });
}

/* ============================================================
   BLUEPRINT RULES — the Process step lines draw themselves in (scaleX
   from the left) as each card enters, like a draftsman ruling the
   sheet. The real top border stays as the no-JS / reduced-motion
   baseline; this rose overlay is the animated layer.
   ============================================================ */
export function setupBlueprintRules() {
  const rules = Array.from(
    document.querySelectorAll<HTMLElement>("[data-process-rule]"),
  );
  if (!rules.length) return;

  if (prefersReducedMotion) {
    rules.forEach((r) => (r.style.transform = "scaleX(1)"));
    return;
  }

  rules.forEach((r, i) => {
    const card = r.closest<HTMLElement>("[data-reveal-child]") ?? r;
    inView(
      card,
      () => {
        animate(
          r,
          { transform: ["scaleX(0)", "scaleX(1)"] },
          { duration: 0.8, delay: (i % 2) * 0.12, ease: EASE_OUT_EXPO },
        );
      },
      { amount: 0.4 },
    );
  });
}

/* ============================================================
   ENTRY POINT
   ============================================================ */
export async function initKineticEditorial() {
  // 1) Start the loader, but DON'T wait for it — everything below boots
  //    while the curtain still covers the screen, so the hero (split
  //    positions, fitted type, first scroll-driver frame) is fully
  //    settled before the loader exits. The curtain reveals a finished
  //    scene instead of one still arranging itself.
  const loaderDone = setupLoader();

  // 2) Boot the rest underneath the loader
  setupSmoothScroll();
  setupScrollProgress();
  setupHeroNameFit();
  setupFitHeadings();
  setupHeroSplit();
  setupSectionReveals();
  setupParallax();
  setupStackCards();
  setupManifestoReveal();
  setupCustomCursor();
  setupSideRails();
  setupAccordion();
  setupMagnetic();
  setupKineticHeadings();
  setupBlueprintRules();

  // 3) Resolve when the curtain has fully lifted
  await loaderDone;
}
