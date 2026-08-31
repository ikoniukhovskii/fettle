/* Fettle — photo-led editorial landing page.
   One full-bleed photograph as the entire hero, giant wordmark anchored to
   its bottom edge, everything else quiet.

   Every tweak below defaults to the current committed design — changing a
   control is opt-in exploration; the page looks identical until you move
   something. */

const EDIT_PHONE = '+447361854124';
const EDIT_PHONE_DISPLAY = '+44 7361 854124';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  // Photography
  heroPhoto: 'drawing room',
  photoSaturation: 82,
  photoBrightness: 100,
  photoContrast: 100,
  imageRadius: 16,
  heroScrim: 52,
  // Typography / font sizes
  wordmarkSize: 19,
  wordmarkWeight: 800,
  wordmarkTracking: -1.5,
  wordmarkCase: 'uppercase',
  quoteScale: 82,
  headingScale: 84,
  bodyScale: 94,
  // Scroll animation
  scrollMotion: true,
  revealStyle: 'fade-up',
  revealDistance: 28,
  revealDuration: 900,
  revealEasing: 'ease-out',
  parallax: true,
  parallaxStrength: 4,
  parallaxZoom: 110,
  // Hero entrance
  heroEntrance: 'none',
  // Background animation
  bgStyle: 'flat',
  bgAnimSpeed: 40,
  // Layout
  contentWidth: 1120,
  sectionSpacing: 78,
  heroHeight: 100,
  // Accent
  accent: '#9E5A3C',
} /*EDITMODE-END*/;

const HERO_PHOTOS = {
  'drawing room': 'editorial/img/hero-drawing-room.webp',
  'kitchen & garden': 'editorial/img/kitchen-garden.webp',
  'dining skylight': 'editorial/img/dining-skylight.jpg',
};

const reduceMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Helpers ---------- */
function photoFilter(t) {
  return `saturate(${t.photoSaturation / 100}) brightness(${t.photoBrightness / 100}) contrast(${
    t.photoContrast / 100
  })`;
}

const EASE = {
  'ease-out': (p) => 1 - Math.pow(1 - p, 3),
  gentle: (p) => 1 - Math.pow(1 - p, 4),
  linear: (p) => p,
  'ease-in-out': (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
};

/* Per-style interpolated frame for the reveal, e in [0,1]. */
function revealFrame(style, e, dist) {
  const inv = 1 - e;
  switch (style) {
    case 'fade':
      return { opacity: e, transform: 'none', filter: '', clipPath: '' };
    case 'zoom':
      return { opacity: e, transform: `scale(${(0.96 + 0.04 * e).toFixed(4)})`, filter: '', clipPath: '' };
    case 'blur':
      return { opacity: e, transform: 'none', filter: `blur(${(10 * inv).toFixed(2)}px)`, clipPath: '' };
    case 'clip':
      return {
        opacity: 1,
        transform: `translateY(${(dist * 0.4 * inv).toFixed(2)}px)`,
        filter: '',
        clipPath: `inset(0 0 ${(100 * inv).toFixed(2)}% 0)`,
      };
    case 'fade-up':
    default:
      return { opacity: e, transform: `translateY(${(dist * inv).toFixed(2)}px)`, filter: '', clipPath: '' };
  }
}
function applyFrame(el, f) {
  el.style.opacity = f.opacity === undefined ? '' : String(f.opacity);
  el.style.transform = f.transform || '';
  el.style.filter = f.filter || '';
  el.style.clipPath = f.clipPath || '';
}

/* ---------- Motion: one shared rAF ticker ---------- */
/* Scroll events + IntersectionObserver are unreliable in embedded previews,
   so all scroll-linked motion polls positions off one shared rAF loop. */
const ticker = (() => {
  const subs = new Set();
  let lastRun = 0;
  const run = () => {
    lastRun = performance.now();
    subs.forEach((fn) => {
      try {
        fn();
      } catch (e) {
        subs.delete(fn);
      }
    });
  };
  const rafLoop = () => {
    if (subs.size) run();
    requestAnimationFrame(rafLoop);
  };
  requestAnimationFrame(rafLoop);
  setInterval(() => {
    if (performance.now() - lastRun > 300) {
      if (subs.size) run();
      requestAnimationFrame(rafLoop);
    }
  }, 300);
  return {
    add(fn) {
      subs.add(fn);
    },
    remove(fn) {
      subs.delete(fn);
    },
  };
})();

/* Reveal on enter — rAF-tweened so it runs even where CSS transitions stall. */
function Reveal({ children, m, style }) {
  const ref = React.useRef(null);
  const fired = React.useRef(!m.enabled);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!m.enabled) {
      fired.current = true;
      applyFrame(el, { opacity: 1, transform: 'none', filter: '', clipPath: '' });
      return;
    }
    if (fired.current) {
      applyFrame(el, { opacity: 1, transform: 'none', filter: '', clipPath: '' });
      return;
    }
    applyFrame(el, revealFrame(m.style, 0, m.distance));
    const tween = () => {
      const t0 = performance.now();
      const ease = EASE[m.easing] || EASE['ease-out'];
      const step = () => {
        if (!el.isConnected) return;
        const p = Math.min(1, (performance.now() - t0) / m.duration);
        const e = ease(p);
        if (p < 1) applyFrame(el, revealFrame(m.style, e, m.distance));
        else applyFrame(el, { opacity: 1, transform: 'none', filter: '', clipPath: '' });
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.88 && r.bottom > 0) {
        fired.current = true;
        ticker.remove(check);
        tween();
      }
    };
    ticker.add(check);
    return () => ticker.remove(check);
    // re-arm when any motion parameter changes
  }, [m.enabled, m.style, m.distance, m.duration, m.easing]);
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

/* Gentle parallax on a photo inside an overflow-hidden frame. */
function useParallax(cfg) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const img = el.querySelector('img');
    if (!img) return;
    if (!cfg.enabled) {
      img.style.transform = '';
      return;
    }
    const scale = cfg.zoom / 100;
    let last = '';
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      const tr = `translateY(${(p * cfg.strength).toFixed(2)}%) scale(${scale})`;
      if (tr !== last) {
        last = tr;
        img.style.transform = tr;
      }
    };
    ticker.add(update);
    return () => {
      ticker.remove(update);
      img.style.transform = '';
    };
  }, [cfg.enabled, cfg.strength, cfg.zoom]);
  return ref;
}

/* ---------- Animated background layer ---------- */
function Background({ t }) {
  if (t.bgStyle === 'flat') return null;
  const dur = `${Math.max(12, 120 - t.bgAnimSpeed)}s`;
  if (t.bgStyle === 'vignette') {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(120% 90% at 50% 40%, rgba(43,39,35,0) 55%, rgba(43,39,35,0.08) 100%)',
        }}
      />
    );
  }
  if (t.bgStyle === 'grain') {
    return (
      <div
        aria-hidden="true"
        className="bg-grain"
        style={{ animationDuration: dur }}
      />
    );
  }
  // drift — two soft warm blooms easing slowly across the cream
  return (
    <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div className="bg-bloom bg-bloom-a" style={{ animationDuration: dur }} />
      <div className="bg-bloom bg-bloom-b" style={{ animationDuration: `calc(${dur} * 1.3)` }} />
    </div>
  );
}

/* ---------- Quiet postcode check ---------- */
function outward(raw) {
  const s = (raw || '').toUpperCase().replace(/\s+/g, '');
  const m = s.match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  return m ? m[1] : s.slice(0, 4);
}

function QuietPostcode({ id, t }) {
  const [value, setValue] = React.useState('');
  const [code, setCode] = React.useState(null);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const bs = t.bodyScale / 100;

  const check = () => {
    const c = outward(value);
    if (!c) {
      inputRef.current && inputRef.current.focus();
      return;
    }
    setCode(c);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
        <input
          id={id}
          ref={inputRef}
          type="text"
          autoComplete="postal-code"
          placeholder="Your postcode"
          aria-label="Enter your postcode to check availability"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (code) setCode(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              check();
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: 220,
            fontFamily: 'var(--font-body)',
            fontSize: 18 * bs,
            fontWeight: 400,
            padding: '12px 2px',
            border: 'none',
            borderBottom: `1.5px solid ${focused ? 'var(--rust-muted)' : 'var(--ink-40)'}`,
            background: 'transparent',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color .3s ease',
            textAlign: 'center',
            borderRadius: 0,
          }}
        />
        <button type="button" onClick={check} className="quiet-check-btn" style={{ color: 'var(--ink)' }}>
          Check
        </button>
      </div>
      <div aria-live="polite">
        {code && (
          <p
            style={{
              margin: '22px auto 0',
              maxWidth: 460,
              fontFamily: 'var(--font-body)',
              fontSize: 16.5 * bs,
              lineHeight: 1.6,
              color: 'var(--ink)',
              textAlign: 'center',
            }}
          >
            <span style={{ color: 'var(--sage)', marginRight: 8 }}>✓</span>
            We&rsquo;re taking on two more homes in {code} this summer.
            <span style={{ display: 'block', marginTop: 6, color: 'var(--ink-40)', fontSize: 15 * bs }}>
              <a href={`tel:${EDIT_PHONE}`} className="quiet-link" style={{ color: 'inherit' }}>
                Call {EDIT_PHONE_DISPLAY}
              </a>{' '}
              or{' '}
              <a href={`https://wa.me/${EDIT_PHONE.replace('+', '')}`} className="quiet-link" style={{ color: 'inherit' }}>
                WhatsApp us
              </a>{' '}
              and we&rsquo;ll arrange a first visit.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------- Floating header ----------
   Full-width bar aligned over the hero at the top; on scroll it eases into
   a rounded white pill that follows you down the page. The morph is
   rAF-tweened (CSS transitions are unreliable in embedded previews). */
function Header() {
  const navRef = React.useRef(null);

  React.useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const clampv = (min, vw, max) => Math.max(min, Math.min(max, (vw / 100) * window.innerWidth));
    const lerp = (a, b, p) => a + (b - a) * p;
    const easeOut = (p) => 1 - Math.pow(1 - p, 3);
    const CREAM = [241, 232, 216];
    const INK = [43, 39, 35];

    let cur = 0; // 0 = top bar, 1 = pill

    const apply = (raw) => {
      const p = easeOut(raw);
      const iw = window.innerWidth;
      const vPad = lerp(clampv(20, 3, 34), 12, p);
      const hPad = lerp(clampv(22, 4, 48), clampv(18, 2.4, 26), p);
      const maxW = lerp(iw, Math.min(920, iw - 28), p);
      const mt = lerp(0, 14, p);
      const rad = lerp(0, 20, p);
      const fg = CREAM.map((c, i) => Math.round(lerp(c, INK[i], p)));
      nav.style.maxWidth = `${maxW}px`;
      nav.style.marginTop = `${mt}px`;
      nav.style.padding = `${vPad}px ${hPad}px`;
      nav.style.borderRadius = `${rad}px`;
      nav.style.background = `rgba(255,255,255,${p.toFixed(3)})`;
      nav.style.boxShadow = `0 8px 24px rgba(43,39,35,${(0.1 * p).toFixed(3)}), 0 2px 6px rgba(43,39,35,${(
        0.06 * p
      ).toFixed(3)})`;
      nav.style.setProperty('--hdr-fg', `rgb(${fg[0]},${fg[1]},${fg[2]})`);
    };

    const tick = () => {
      const target = window.scrollY > window.innerHeight * 0.5 ? 1 : 0;
      if (Math.abs(cur - target) > 0.001) {
        cur += (target - cur) * 0.16;
        if (Math.abs(cur - target) <= 0.001) cur = target;
        apply(cur);
      }
    };

    apply(0);
    ticker.add(tick);
    window.addEventListener('resize', () => apply(cur));
    return () => ticker.remove(tick);
  }, []);

  const jump = (id) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 40,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
  };

  return (
    <div className="fettle-header-wrap">
      <nav ref={navRef} className="fettle-header" aria-label="Primary">
        <a
          href="#"
          className="hbrand"
          onClick={(e) => {
            e.preventDefault();
            jump('top');
          }}
        >
          Fettle
        </a>
        <div className="hlinks">
          <button className="hlink nav-optional" onClick={() => jump('our-work')}>
            Our work
          </button>
          <button className="hlink nav-optional" onClick={() => { window.location.href = 'pages/contact.html'; }}>
            Contact
          </button>
          <button className="hlink" onClick={() => jump('availability')}>
            Check availability
          </button>
        </div>
      </nav>
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero({ t }) {
  let heroAnim = 'none';
  if (!reduceMotion) {
    if (t.heroEntrance === 'kenburns') heroAnim = 'kenburns 32s ease-in-out infinite alternate';
    else if (t.heroEntrance === 'fade') heroAnim = 'heroFade 1.3s ease both';
  }

  return (
    <header
      style={{ position: 'relative', height: `${t.heroHeight}svh`, minHeight: 520, overflow: 'hidden' }}
      data-screen-label="Hero"
    >
      <img
        src={HERO_PHOTOS[t.heroPhoto] || HERO_PHOTOS['drawing room']}
        alt="A quietly kept London drawing room"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: photoFilter(t),
          transformOrigin: 'center',
          animation: heroAnim,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to bottom, rgba(28,24,20,0.38) 0%, rgba(28,24,20,0) 22%, rgba(28,24,20,0) 55%, rgba(28,24,20,${(
            t.heroScrim / 100
          ).toFixed(2)}) 100%)`,
        }}
      />

      <p
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 'clamp(19vh, 24vh, 26vh)',
          transform: 'translateX(-50%)',
          zIndex: 2,
          margin: 0,
          padding: '0 24px',
          maxWidth: 560,
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          lineHeight: 2,
          color: 'rgba(241,232,216,0.92)',
        }}
      >
        A small London team, keeping a short list of homes in good working order. By recommendation, mostly.
      </p>

      <h1
        aria-label="Fettle"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '-0.07em',
          margin: 0,
          zIndex: 2,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: t.wordmarkWeight,
          fontSize: `clamp(88px, ${t.wordmarkSize}vw, 340px)`,
          lineHeight: 0.82,
          letterSpacing: `${t.wordmarkTracking / 100}em`,
          textTransform: t.wordmarkCase,
          color: 'var(--cream)',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        Fettle
      </h1>
    </header>
  );
}

/* ---------- Availability strip ---------- */
function Availability({ t, m }) {
  const sf = t.sectionSpacing / 100;
  return (
    <section
      id="availability"
      data-screen-label="Availability check"
      style={{ padding: `calc(clamp(72px, 11vw, 130px) * ${sf}) 24px`, position: 'relative', zIndex: 1 }}
    >
      <Reveal m={m}>
        <p
          style={{
            margin: '0 auto 30px',
            maxWidth: 520,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 17.5 * (t.bodyScale / 100),
            lineHeight: 1.65,
            color: 'var(--ink-60)',
          }}
        >
          We take on a few more homes each season, postcode by postcode.
        </p>
        <QuietPostcode id="postcode-top" t={t} />
      </Reveal>
    </section>
  );
}

/* ---------- Photo story ---------- */
const STORY = [
  {
    img: 'editorial/img/kitchen-garden.webp',
    alt: 'A bright kitchen extension opening onto a London garden',
    caption: 'Plimsoll Road, Highbury · N5',
    line: 'From a wonky fence to a fresh coat of paint, one team does the lot — painting, plastering, plumbing, fences, floors, odd jobs.',
    wide: true,
  },
  {
    img: 'editorial/img/dining-skylight.jpg',
    alt: 'A dining room beneath a timber-framed skylight',
    caption: 'Bishopswood Road, Highgate · N6',
    line: 'The same faces each visit. People who know where the stopcock is, and which floorboard creaks.',
    wide: false,
  },
  {
    img: 'editorial/img/living-room.gif',
    alt: 'A drawing room with parquet floors and a sculptural staircase',
    caption: 'Wadham Gardens, Primrose Hill · NW3',
    line: 'Dust sheets down, shoes off, radio low. Work you notice only by the fact everything simply works.',
    wide: true,
  },
];

function StoryBlock({ item, t, m, pcfg, first }) {
  const frameRef = useParallax(pcfg);
  const cw = t.contentWidth;
  const sf = t.sectionSpacing / 100;
  return (
    <div style={{ marginBottom: `calc(clamp(90px, 13vw, 170px) * ${sf})` }}>
      <Reveal m={m}>
        <p
          style={{
            margin: `0 auto calc(clamp(44px, 6vw, 72px) * ${sf})`,
            maxWidth: 760,
            padding: '0 24px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: `calc(clamp(24px, 3.1vw, 38px) * ${t.quoteScale / 100})`,
            lineHeight: 1.28,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textWrap: 'balance',
          }}
        >
          {item.line}
        </p>
      </Reveal>
      <Reveal m={m}>
        <figure
          style={{
            margin: '0 auto',
            width: item.wide
              ? `min(${cw}px, calc(100% - 48px))`
              : `min(${Math.min(760, cw)}px, calc(100% - 48px))`,
          }}
        >
          <div
            ref={frameRef}
            style={{
              overflow: 'hidden',
              borderRadius: t.imageRadius,
              aspectRatio: item.wide ? '16 / 10' : '4 / 5',
              maxHeight: '86vh',
            }}
          >
            <img
              src={item.img}
              alt={item.alt}
              loading={first ? 'eager' : 'lazy'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: photoFilter(t),
                willChange: 'transform',
              }}
            />
          </div>
          <figcaption
            style={{
              marginTop: 16,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 11.5,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-40)',
            }}
          >
            {item.caption}
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}

/* ---------- Before / after comparison slider ---------- */
function BeforeAfter({ t, m }) {
  const cw = t.contentWidth;
  const sf = t.sectionSpacing / 100;
  const wrapRef = React.useRef(null);
  const [pos, setPos] = React.useState(50);
  const draggingRef = React.useRef(false);

  const setFromClientX = React.useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  React.useEffect(() => {
    const move = (e) => {
      if (!draggingRef.current) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setFromClientX(x);
      if (e.cancelable) e.preventDefault();
    };
    const up = () => { draggingRef.current = false; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [setFromClientX]);

  const start = (e) => {
    draggingRef.current = true;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    setFromClientX(x);
  };

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - 4)); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + 4)); e.preventDefault(); }
    else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
    else if (e.key === 'End') { setPos(100); e.preventDefault(); }
  };

  const tag = {
    position: 'absolute',
    top: 18,
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: 11.5,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--ink)',
    background: 'var(--cream)',
    padding: '7px 14px',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-card)',
    pointerEvents: 'none',
    zIndex: 4,
  };

  return (
    <div style={{ marginBottom: `calc(clamp(90px, 13vw, 170px) * ${sf})` }}>
      <Reveal m={m}>
        <p
          style={{
            margin: `0 auto calc(clamp(44px, 6vw, 72px) * ${sf})`,
            maxWidth: 760,
            padding: '0 24px',
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: `calc(clamp(24px, 3.1vw, 38px) * ${t.quoteScale / 100})`,
            lineHeight: 1.28,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textWrap: 'balance',
          }}
        >
          Same house, N6. Drag to see the difference a season of upkeep makes.
        </p>
      </Reveal>
      <Reveal m={m}>
        <figure style={{ margin: '0 auto', width: `min(${cw}px, calc(100% - 48px))` }}>
          <div
            ref={wrapRef}
            onMouseDown={start}
            onTouchStart={start}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: t.imageRadius,
              aspectRatio: '16 / 10',
              maxHeight: '86vh',
              cursor: 'ew-resize',
              userSelect: 'none',
              touchAction: 'pan-y',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {/* After = base layer (right side) */}
            <img
              src="editorial/img/before-after-after.png"
              alt="42 — the garden and driveway after Fettle&rsquo;s work: clipped hedges, fresh planting, tidy paving"
              draggable={false}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                filter: photoFilter(t),
              }}
            />
            {/* Before = full-size image clipped to the left of the handle */}
            <img
              src="editorial/img/before-after-before.jpeg"
              alt="42 — the garden and driveway before: overgrown beds, weeds through the paving"
              draggable={false}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                filter: photoFilter(t),
                clipPath: `inset(0 ${100 - pos}% 0 0)`,
              }}
            />

            <span style={{ ...tag, left: 18 }}>Before</span>
            <span style={{ ...tag, right: 18 }}>After</span>

            {/* Handle */}
            <div
              role="slider"
              tabIndex={0}
              aria-label="Reveal before and after"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              onKeyDown={onKey}
              onMouseDown={start}
              onTouchStart={start}
              style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${pos}%`,
                width: 2,
                background: 'var(--cream)',
                transform: 'translateX(-1px)',
                zIndex: 3,
                cursor: 'ew-resize',
              }}
            >
              <div
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 46, height: 46,
                  borderRadius: '50%',
                  background: 'var(--rust)',
                  boxShadow: 'var(--shadow-raised)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--cream)',
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 8l-4 4 4 4" />
                  <path d="M14 8l4 4-4 4" />
                </svg>
              </div>
            </div>
          </div>
          <figcaption
            style={{
              marginTop: 16,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 11.5,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-40)',
            }}
          >
            Bishopswood Road, Highgate &middot; N6
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}

function Story({ t, m, pcfg }) {
  return (
    <section id="our-work" data-screen-label="Our work" style={{ position: 'relative', zIndex: 1 }}>
      {STORY.map((s, i) => (
        <React.Fragment key={i}>
          {i === STORY.length - 1 && <BeforeAfter t={t} m={m} />}
          <StoryBlock item={s} t={t} m={m} pcfg={pcfg} first={i === 0} />
        </React.Fragment>
      ))}
    </section>
  );
}

/* ---------- Close ---------- */
function Close({ t, m }) {
  const cw = t.contentWidth;
  const sf = t.sectionSpacing / 100;
  return (
    <section id="closing" data-screen-label="Close" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: `calc(clamp(90px, 13vw, 170px) * ${sf}) 24px calc(clamp(80px, 10vw, 120px) * ${sf})` }}>
        <Reveal m={m}>
          <h2
            style={{
              margin: '0 auto 16px',
              maxWidth: 640,
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: `calc(clamp(30px, 4vw, 48px) * ${t.headingScale / 100})`,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              textWrap: 'balance',
            }}
          >
            See if there&rsquo;s room on the list.
          </h2>
          <p
            style={{
              margin: '0 auto 36px',
              maxWidth: 440,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: 17 * (t.bodyScale / 100),
              lineHeight: 1.6,
              color: 'var(--ink-60)',
            }}
          >
            One postcode is all it takes. If we&rsquo;ve room near you, we&rsquo;ll say so plainly.
          </p>
          <QuietPostcode id="postcode-close" t={t} />
        </Reveal>
      </div>

    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  {
    q: 'How much does a visit cost?',
    a: 'A half-day starts at £140, a full day at £260, materials on top at cost. No call-out fee, and you will know the price before we lift a tool. Licensed trades are quoted job by job once we have seen the work.',
  },
  {
    q: 'What sort of jobs do you take on?',
    a: 'From a wonky fence to a fresh coat of paint, one team does the lot: painting, plastering, plumbing, floors, fences, and the odd jobs that never quite get done. Anything that needs a licence, plumbing, rendering, tree surgery, goes to a specialist we know by name and have used before.',
  },
  {
    q: 'Do you have room for my home?',
    a: 'We take on a few more homes each season, postcode by postcode, so we can keep doing right by the ones already on the list. Give us your postcode and we will tell you plainly whether there is room near you. We work across N5, N6, NW3 and around.',
  },
  {
    q: 'Will it be the same people each time?',
    a: 'Yes. A small permanent team does the day-to-day work, so it is the same faces each visit. People who know where the stopcock is, and which floorboard creaks.',
  },
  {
    q: 'What happens on the first visit?',
    a: 'We come and take a proper look, note what needs doing, and get to know the house. Then you get a plain price, half-day or full-day, with no surprises. Dust sheets down, shoes off, radio low, and everything left tidy.',
  },
];

function FaqItem({ item, open, onToggle, t }) {
  const bodyF = t.bodyScale / 100;
  return (
    <div style={{ borderTop: '1px solid var(--ink-12)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          padding: '24px 4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: `calc(clamp(17px, 2vw, 21px) * ${t.headingScale / 100})`,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {item.q}
        </span>
        <span
          aria-hidden="true"
          style={{
            flex: '0 0 auto',
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: open ? 'var(--rust)' : 'transparent',
            border: open ? 'none' : '1.5px solid var(--ink)',
            color: open ? 'var(--cream)' : 'var(--ink)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background .15s ease, color .15s ease, border-color .15s ease, transform .2s ease',
            transform: open ? 'rotate(45deg)' : 'none',
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows .28s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              margin: 0,
              padding: '0 60px 26px 4px',
              maxWidth: '62ch',
              fontFamily: 'var(--font-body)',
              fontSize: 16.5 * bodyF,
              lineHeight: 1.65,
              color: 'var(--ink-60)',
            }}
          >
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ({ t, m }) {
  const [open, setOpen] = React.useState(0);
  const cw = Math.min(920, t.contentWidth);
  const sf = t.sectionSpacing / 100;
  return (
    <section id="faq" data-screen-label="FAQ" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: `calc(clamp(72px, 11vw, 130px) * ${sf}) 24px calc(clamp(80px, 10vw, 120px) * ${sf})` }}>
        <div style={{ maxWidth: cw, margin: '0 auto' }}>
          <Reveal m={m}>
            <p style={{ margin: '0 auto 22px', textAlign: 'center' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: 11.5,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'var(--rust)',
                  background: 'var(--tan-pill)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                }}
              >
                Frequently asked questions
              </span>
            </p>
            <h2
              style={{
                margin: '0 auto 14px',
                textAlign: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: `calc(clamp(40px, 7vw, 76px) * ${t.headingScale / 100})`,
                lineHeight: 1,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
              }}
            >
              Good to know
            </h2>
            <p
              style={{
                margin: '0 auto calc(clamp(40px, 6vw, 68px) * ' + sf + ')',
                maxWidth: 460,
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
                fontSize: 17 * (t.bodyScale / 100),
                lineHeight: 1.6,
                color: 'var(--ink-60)',
              }}
            >
              Everything worth knowing before we start.
            </p>
          </Reveal>
          <Reveal m={m}>
            <div style={{ borderBottom: '1px solid var(--ink-12)' }}>
              {FAQS.map((f, i) => (
                <FaqItem
                  key={i}
                  item={f}
                  t={t}
                  open={open === i}
                  onToggle={() => setOpen(open === i ? -1 : i)}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Site footer (three columns, matches sub-pages) ---------- */
const FOOT_COLS = [
  {
    head: 'Company',
    links: [
      { label: 'About Fettle', href: 'pages/about.html' },
      { label: 'Testimonials', href: 'pages/testimonials.html' },
      { label: 'Contact', href: 'pages/contact.html' },
    ],
  },
  {
    head: 'Services',
    links: [
      { label: 'What we fix', href: 'pages/services.html' },
      { label: 'How it works', href: 'pages/how-it-works.html' },
    ],
  },
  {
    head: 'Legal',
    links: [
      { label: 'Privacy', href: 'pages/privacy.html' },
      { label: 'Terms of use', href: 'pages/terms.html' },
      { label: 'Cookies', href: 'pages/cookies.html' },
    ],
  },
];

function SiteFooter() {
  const cream = 'rgba(241,232,216,';
  return (
    <footer
      data-screen-label="Footer"
      style={{ position: 'relative', zIndex: 1, background: 'var(--ink)', color: 'var(--cream)' }}
    >
      <div style={{ width: 'min(1240px, calc(100% - 48px))', margin: '0 auto', padding: 'clamp(48px,6vw,72px) 0 clamp(24px,3vw,32px)' }}>
        <div className="foot-top-grid">
          <div style={{ gridColumn: 'var(--brand-col)' }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); }}
              style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, letterSpacing: '-0.01em', textDecoration: 'none', color: 'var(--cream)' }}
            >
              Fettle
            </a>
            <p style={{ margin: '16px 0 0', maxWidth: '32ch', fontSize: 14.5, lineHeight: 1.6, color: cream + '0.62)' }}>
              London home care with efficiency, transparency and a tidy finish.
            </p>
          </div>
          {FOOT_COLS.map((col) => (
            <div key={col.head}>
              <h4 style={{ margin: '4px 0 18px', fontWeight: 700, fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: cream + '0.55)' }}>
                {col.head}
              </h4>
              {col.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="foot-link"
                  style={{ display: 'block', marginBottom: 13, fontSize: 15, textDecoration: 'none', color: cream + '0.88)', width: 'fit-content' }}
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            paddingTop: 22, borderTop: `1px solid ${cream}0.14)`,
          }}
        >
          <span style={{ fontSize: 13, letterSpacing: '0.02em', color: cream + '0.5)' }}>
            © 2026 Fettle. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {['In', 'Ig'].map((s) => (
              <a
                key={s}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="foot-social-btn"
                aria-label={s === 'In' ? 'Fettle on LinkedIn' : 'Fettle on Instagram'}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 26,
                  border: `1px solid ${cream}0.22)`, borderRadius: 'var(--radius-sm)', fontSize: 12,
                  textDecoration: 'none', color: cream + '0.7)',
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })}
        style={{
          position: 'absolute', right: 'clamp(16px,3vw,40px)', top: 46, width: 44, height: 44, border: 'none',
          borderRadius: '50%', background: 'var(--rust)', color: 'var(--cream)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V5" />
          <path d="M5 12l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--rust-muted', t.accent);
  }, [t.accent]);

  const m = {
    enabled: t.scrollMotion && !reduceMotion,
    style: t.revealStyle,
    distance: t.revealDistance,
    duration: t.revealDuration,
    easing: t.revealEasing,
  };
  const pcfg = {
    enabled: t.scrollMotion && t.parallax && !reduceMotion,
    strength: t.parallaxStrength,
    zoom: t.parallaxZoom,
  };

  return (
    <React.Fragment>
      <Background t={t} />
      <Header />
      <Hero t={t} />
      <Availability t={t} m={m} />
      <Story t={t} m={m} pcfg={pcfg} />
      <Close t={t} m={m} />
      <FAQ t={t} m={m} />
      <SiteFooter />

      <TweaksPanel>
        <TweakSection label="Photography" />
        <TweakSelect
          label="Hero photo"
          value={t.heroPhoto}
          options={Object.keys(HERO_PHOTOS)}
          onChange={(v) => setTweak('heroPhoto', v)}
        />
        <TweakSlider label="Saturation" value={t.photoSaturation} min={30} max={130} unit="%" onChange={(v) => setTweak('photoSaturation', v)} />
        <TweakSlider label="Brightness" value={t.photoBrightness} min={70} max={130} unit="%" onChange={(v) => setTweak('photoBrightness', v)} />
        <TweakSlider label="Contrast" value={t.photoContrast} min={70} max={130} unit="%" onChange={(v) => setTweak('photoContrast', v)} />
        <TweakSlider label="Image corners" value={t.imageRadius} min={0} max={24} unit="px" onChange={(v) => setTweak('imageRadius', v)} />
        <TweakSlider label="Hero scrim" value={t.heroScrim} min={0} max={80} unit="%" onChange={(v) => setTweak('heroScrim', v)} />

        <TweakSection label="Type — wordmark" />
        <TweakSlider label="Wordmark size" value={t.wordmarkSize} min={12} max={26} unit="vw" onChange={(v) => setTweak('wordmarkSize', v)} />
        <TweakRadio label="Weight" value={t.wordmarkWeight} options={[700, 800]} onChange={(v) => setTweak('wordmarkWeight', v)} />
        <TweakSlider label="Letter-spacing" value={t.wordmarkTracking} min={-5} max={6} step={0.5} unit="/100em" onChange={(v) => setTweak('wordmarkTracking', v)} />
        <TweakRadio label="Case" value={t.wordmarkCase} options={['uppercase', 'none']} onChange={(v) => setTweak('wordmarkCase', v)} />

        <TweakSection label="Type — sizes" />
        <TweakSlider label="Pull-quotes" value={t.quoteScale} min={70} max={140} unit="%" onChange={(v) => setTweak('quoteScale', v)} />
        <TweakSlider label="Close heading" value={t.headingScale} min={70} max={150} unit="%" onChange={(v) => setTweak('headingScale', v)} />
        <TweakSlider label="Body text" value={t.bodyScale} min={80} max={130} unit="%" onChange={(v) => setTweak('bodyScale', v)} />

        <TweakSection label="Scroll animation" />
        <TweakToggle label="Scroll motion" value={t.scrollMotion} onChange={(v) => setTweak('scrollMotion', v)} />
        <TweakSelect label="Reveal style" value={t.revealStyle} options={['fade-up', 'fade', 'zoom', 'blur', 'clip']} onChange={(v) => setTweak('revealStyle', v)} />
        <TweakSlider label="Reveal travel" value={t.revealDistance} min={0} max={80} unit="px" onChange={(v) => setTweak('revealDistance', v)} />
        <TweakSlider label="Reveal duration" value={t.revealDuration} min={300} max={1800} step={50} unit="ms" onChange={(v) => setTweak('revealDuration', v)} />
        <TweakSelect label="Reveal easing" value={t.revealEasing} options={['ease-out', 'gentle', 'ease-in-out', 'linear']} onChange={(v) => setTweak('revealEasing', v)} />

        <TweakSection label="Parallax" />
        <TweakToggle label="Photo parallax" value={t.parallax} onChange={(v) => setTweak('parallax', v)} />
        <TweakSlider label="Parallax strength" value={t.parallaxStrength} min={0} max={14} unit="%" onChange={(v) => setTweak('parallaxStrength', v)} />
        <TweakSlider label="Parallax zoom" value={t.parallaxZoom} min={100} max={130} unit="%" onChange={(v) => setTweak('parallaxZoom', v)} />

        <TweakSection label="Hero entrance" />
        <TweakRadio label="On load" value={t.heroEntrance} options={['none', 'kenburns', 'fade']} onChange={(v) => setTweak('heroEntrance', v)} />

        <TweakSection label="Background animation" />
        <TweakSelect label="Style" value={t.bgStyle} options={['flat', 'drift', 'vignette', 'grain']} onChange={(v) => setTweak('bgStyle', v)} />
        <TweakSlider label="Drift speed" value={t.bgAnimSpeed} min={5} max={100} unit="" onChange={(v) => setTweak('bgAnimSpeed', v)} />

        <TweakSection label="Layout" />
        <TweakSlider label="Content width" value={t.contentWidth} min={860} max={1600} step={20} unit="px" onChange={(v) => setTweak('contentWidth', v)} />
        <TweakSlider label="Section spacing" value={t.sectionSpacing} min={50} max={160} unit="%" onChange={(v) => setTweak('sectionSpacing', v)} />
        <TweakSlider label="Hero height" value={t.heroHeight} min={60} max={100} unit="vh" onChange={(v) => setTweak('heroHeight', v)} />

        <TweakSection label="Accent" />
        <TweakColor
          label="Accent colour"
          value={t.accent}
          options={['#9E5A3C', '#B34426', '#97381E', '#6E8A6B', '#2B2723']}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Reset" />
        <TweakButton label="Reset all tweaks" onClick={() => Object.keys(TWEAK_DEFAULTS).forEach((k) => setTweak(k, TWEAK_DEFAULTS[k]))} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
