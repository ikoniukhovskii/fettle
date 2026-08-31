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
  imageRadius: 2,
  heroScrim: 52,
  // Typography / font sizes
  wordmarkSize: 19,
  wordmarkWeight: 800,
  wordmarkTracking: -1.5,
  wordmarkCase: 'uppercase',
  quoteScale: 100,
  headingScale: 100,
  bodyScale: 100,
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
  contentWidth: 1280,
  sectionSpacing: 100,
  heroHeight: 100,
  // Accent
  accent: '#9E5A3C',
} /*EDITMODE-END*/;

const HERO_PHOTOS = {
  'drawing room': 'editorial-v1/img/hero-drawing-room.webp',
  'kitchen & garden': 'editorial-v1/img/kitchen-garden.webp',
  'dining skylight': 'editorial-v1/img/dining-skylight.jpg',
  'street terrace': 'editorial-v1/img/terrace-street.jpg',
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

/* ---------- Hero ---------- */
function Hero({ t }) {
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 40,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
  };

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

      {/* Minimal top bar */}
      <nav
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(20px, 3vw, 34px) clamp(22px, 4vw, 48px)',
          zIndex: 3,
        }}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
          }}
          className="quiet-link"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 20,
            color: 'var(--cream)',
            textDecoration: 'none',
            letterSpacing: '0.01em',
          }}
        >
          Fettle
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(18px, 3vw, 36px)' }}>
          <button className="hero-nav-link nav-optional" onClick={() => jump('our-work')}>
            Our work
          </button>
          <button className="hero-nav-link nav-optional" onClick={() => jump('closing')}>
            Contact
          </button>
          <button className="hero-nav-link hero-nav-action" onClick={() => jump('availability')}>
            Check availability
          </button>
        </div>
      </nav>

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
    img: 'editorial-v1/img/kitchen-garden.webp',
    alt: 'A bright kitchen extension opening onto a London garden',
    caption: 'Plimsoll Road — kitchen & garden',
    line: 'From a wonky fence to a fresh coat of paint, one team does the lot — painting, plastering, plumbing, fences, floors, odd jobs.',
    wide: true,
  },
  {
    img: 'editorial-v1/img/dining-skylight.jpg',
    alt: 'A dining room beneath a timber-framed skylight',
    caption: 'A north London dining room',
    line: 'The same faces each visit. People who know where the stopcock is, and which floorboard creaks.',
    wide: false,
  },
  {
    img: 'editorial-v1/img/living-room.gif',
    alt: 'A drawing room with parquet floors and a sculptural staircase',
    caption: 'Wadham Gardens — drawing room',
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

function Story({ t, m, pcfg }) {
  return (
    <section id="our-work" data-screen-label="Our work" style={{ position: 'relative', zIndex: 1 }}>
      {STORY.map((s, i) => (
        <StoryBlock key={i} item={s} t={t} m={m} pcfg={pcfg} first={i === 0} />
      ))}
    </section>
  );
}

/* ---------- Close ---------- */
function Close({ t, m, pcfg }) {
  const frameRef = useParallax(pcfg);
  const cw = t.contentWidth;
  const sf = t.sectionSpacing / 100;
  return (
    <section id="closing" data-screen-label="Close" style={{ position: 'relative', zIndex: 1 }}>
      <Reveal m={m}>
        <figure style={{ margin: '0 auto', width: `min(${cw}px, calc(100% - 48px))` }}>
          <div ref={frameRef} style={{ overflow: 'hidden', borderRadius: t.imageRadius, aspectRatio: '16 / 9' }}>
            <img
              src="editorial-v1/img/terrace-street.jpg"
              alt="A red-brick Victorian terrace on a leafy London street"
              loading="lazy"
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
            North London — a street we know well
          </figcaption>
        </figure>
      </Reveal>

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

      <footer
        style={{
          borderTop: '1px solid var(--ink-12)',
          margin: '0 auto',
          width: `min(${cw}px, calc(100% - 48px))`,
          padding: '28px 0 40px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>
          Fettle
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 11.5,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--ink-40)',
          }}
        >
          London · © 2026 · By recommendation, mostly
        </span>
      </footer>
    </section>
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
      <Hero t={t} />
      <Availability t={t} m={m} />
      <Story t={t} m={m} pcfg={pcfg} />
      <Close t={t} m={m} pcfg={pcfg} />

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
