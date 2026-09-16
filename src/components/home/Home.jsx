import React from 'react';
import { createClient } from '@supabase/supabase-js';
import heroDrawingRoomAsset from '../../assets/img/hero-drawing-room.webp';
const heroDrawingRoom = heroDrawingRoomAsset.src;
import kitchenGardenAsset from '../../assets/img/kitchen-garden.webp';
const kitchenGarden = kitchenGardenAsset.src;
import diningSkylightAsset from '../../assets/img/dining-skylight.webp';
const diningSkylight = diningSkylightAsset.src;
import livingRoomAsset from '../../assets/img/living-room.webp';
const livingRoom = livingRoomAsset.src;
import beforeAfterBeforeAsset from '../../assets/img/before-after-before.webp';
const beforeAfterBefore = beforeAfterBeforeAsset.src;
import beforeAfterAfterAsset from '../../assets/img/before-after-after.webp';
const beforeAfterAfter = beforeAfterAfterAsset.src;
import beforeAfter2BeforeAsset from '../../assets/img/before-after2-before.webp';
const beforeAfter2Before = beforeAfter2BeforeAsset.src;
import beforeAfter2AfterAsset from '../../assets/img/before-after2-after.webp';
const beforeAfter2After = beforeAfter2AfterAsset.src;
import carouselGreenLivingAsset from '../../assets/img/carousel-green-living.webp';
const carouselGreenLiving = carouselGreenLivingAsset.src;
import carouselBlueLivingAsset from '../../assets/img/carousel-blue-living.webp';
const carouselBlueLiving = carouselBlueLivingAsset.src;
import carouselHallwayAsset from '../../assets/img/carousel-hallway.webp';
const carouselHallway = carouselHallwayAsset.src;
import carouselDrawingRoomAsset from '../../assets/img/carousel-drawing-room.webp';
const carouselDrawingRoom = carouselDrawingRoomAsset.src;
import carouselKitchenAsset from '../../assets/img/carousel-kitchen.webp';
const carouselKitchen = carouselKitchenAsset.src;
import teamIliaAsset from '../../assets/img/team-ilia.webp';
const teamIlia = teamIliaAsset.src;

/* Fettle — photo-led editorial landing page.
   One full-bleed photograph as the entire hero, giant wordmark anchored to
   its bottom edge, everything else quiet.

   Every tweak below defaults to the current committed design — changing a
   control is opt-in exploration; the page looks identical until you move
   something. */

const EDIT_PHONE = '+447361854124';
const EDIT_PHONE_DISPLAY = '+44 7361 854124';

const TWEAK_DEFAULTS =  {
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
} ;

const HERO_PHOTOS = {
  'drawing room': heroDrawingRoom,
  'kitchen & garden': kitchenGarden,
  'dining skylight': diningSkylight,
};

const isBrowser = typeof window !== 'undefined';
const reduceMotion =
  isBrowser && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  if (!isBrowser) return { add() {}, remove() {} };
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
function parsePostcode(raw) {
  const compact = (raw || '').trim().toUpperCase().replace(/\s+/g, '');
  if (!compact) return null;
  // Outward (area + district) followed by the full inward code (digit + 2 letters), e.g. "SE3 9FL".
  const full = compact.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
  if (full) return { outward: full[1], postcode: `${full[1]} ${full[2]}` };
  // Outward only, e.g. "SW10" — a real area on its own is a fine input too.
  const outwardOnly = compact.match(/^([A-Z]{1,2}\d[A-Z\d]?)$/);
  if (outwardOnly) return { outward: outwardOnly[1], postcode: null };
  return { invalid: true, reason: 'malformed' };
}

// Real-postcode lookup via postcodes.io — a free, open UK postcode API (no key needed) — so a
// well-formed but made-up postcode (right shape, wrong place) gets caught before we say anything.
async function fullPostcodeExists(postcode) {
  const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}/validate`);
  if (!res.ok) return false;
  const json = await res.json();
  return !!json.result;
}

async function outcodeExists(outward) {
  const res = await fetch(`https://api.postcodes.io/outcodes/${encodeURIComponent(outward)}`);
  return res.ok;
}

// North, northwest, west, southwest, a little south, central (EC/WC), and Richmond (TW) — the broad patch we cover.
const SERVICE_AREA_LETTERS = new Set(['N', 'NW', 'W', 'SW', 'SE', 'TW', 'EC', 'WC']);
// From this many prior checks on an area, we start calling it "busy" instead of naming a count.
const POPULAR_AREA_THRESHOLD = 5;

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

function areaLetters(outward) {
  const m = outward.match(/^[A-Z]{1,2}/);
  return m ? m[0] : '';
}

function currentSeason() {
  const month = new Date().getMonth(); // 0 = Jan
  if (month === 11 || month <= 1) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Reads the shared check count for an area and bumps it by one, atomically enough for this
// cosmetic counter. Returns how many times it had been checked *before* this call (by anyone).
async function bumpAreaCheckCount(area) {
  const { data: existing } = await supabase
    .from('postcode_checks')
    .select('check_count')
    .eq('area', area)
    .maybeSingle();
  const previousCount = existing?.check_count ?? 0;
  if (existing) {
    await supabase.from('postcode_checks').update({ check_count: previousCount + 1 }).eq('area', area);
  } else {
    await supabase.from('postcode_checks').insert({ area, check_count: 1 });
  }
  return previousCount;
}

function firstCheckMessage(area) {
  return pick([
    `We work across ${area} – get in touch and we’ll tell you if there’s room on the list.`,
    `${area} is within our patch. Drop us a line and we’ll take a look.`,
    `Good news – we cover ${area}. Get in touch and we’ll see what we can do.`,
    `We’re active around ${area}. Reach out and we’ll take it from there.`,
  ]);
}

function repeatCheckMessage(area) {
  const season = currentSeason();
  return pick([
    `We have already got a home in ${area} on the books this ${season}.`,
    `${area}’s no stranger to us – we have worked there this ${season}.`,
    `We already look after a home nearby in ${area}.`,
    `We have done work in ${area} this ${season}, and there may be room for more.`,
  ]);
}

function popularAreaMessage(area) {
  return pick([
    `${area} is one of our busier postcodes – we have done numerous jobs there.`,
    `We know ${area} well by now – we have worked there many times.`,
    `${area} keeps us busy. We have done plenty of work in the area.`,
    `We have built up plenty of experience in ${area} over time.`,
  ]);
}

function outOfAreaMessage(area) {
  return `We don’t currently cover ${area}, but get in touch and we’ll see what we can do.`;
}

function QuietPostcode({ id, t }) {
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [checking, setChecking] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);
  const bs = t.bodyScale / 100;

  const check = async () => {
    const parsed = parsePostcode(value);
    if (!parsed) {
      inputRef.current && inputRef.current.focus();
      return;
    }
    if (parsed.invalid) {
      setResult(parsed);
      return;
    }
    const area = parsed.outward;

    setChecking(true);
    let exists = true;
    try {
      exists = parsed.postcode ? await fullPostcodeExists(parsed.postcode) : await outcodeExists(area);
    } catch {
      exists = true; // lookup unreachable — don't block the visitor over an outage
    }
    if (!exists) {
      setChecking(false);
      setResult({ invalid: true, reason: 'nonexistent' });
      return;
    }

    if (!SERVICE_AREA_LETTERS.has(areaLetters(area))) {
      setChecking(false);
      setResult({ area, postcode: parsed.postcode, covered: false, message: outOfAreaMessage(area) });
      return;
    }
    let previousCount = 0;
    try {
      previousCount = await bumpAreaCheckCount(area);
    } catch {
      previousCount = 0; // can't reach the shared count — still show a friendly result
    }
    setChecking(false);
    const message =
      previousCount === 0
        ? firstCheckMessage(area)
        : previousCount < POPULAR_AREA_THRESHOLD
          ? repeatCheckMessage(area)
          : popularAreaMessage(area);
    setResult({ area, postcode: parsed.postcode, covered: true, message });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
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
            if (result) setResult(null);
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
        <button
          type="button"
          onClick={check}
          disabled={checking}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 13 * bs,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '13px 26px',
            borderRadius: 999,
            border: 'none',
            background: 'var(--rust)',
            color: 'var(--cream)',
            opacity: checking ? 0.6 : 1,
            cursor: checking ? 'default' : 'pointer',
            transition: 'background .15s ease',
          }}
          onMouseEnter={(e) => {
            if (!checking) e.currentTarget.style.background = 'var(--brick)';
          }}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rust)')}
        >
          {checking ? 'Checking…' : 'Check'}
        </button>
      </div>
      <div aria-live="polite">
        {result && !result.invalid && (
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
            {result.covered && <span style={{ color: 'var(--sage)', marginRight: 8 }}>✓</span>}
            {result.message}
            <span style={{ display: 'block', marginTop: 16 }}>
              <a
                href={`/contact?postcode=${encodeURIComponent(result.postcode || result.area)}`}
                style={{
                  display: 'inline-block',
                  padding: '11px 26px',
                  borderRadius: 999,
                  background: 'var(--rust)',
                  color: 'var(--cream)',
                  fontWeight: 600,
                  fontSize: 14 * bs,
                  textDecoration: 'none',
                  transition: 'background .15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brick)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rust)')}
              >
                Get in touch
              </a>
            </span>
            <span style={{ display: 'block', marginTop: 10, color: 'var(--ink-40)', fontSize: 15 * bs }}>
              Or{' '}
              <a href={`tel:${EDIT_PHONE}`} className="quiet-link" style={{ color: 'inherit' }}>
                call {EDIT_PHONE_DISPLAY}
              </a>{' '}
              /{' '}
              <a href={`https://wa.me/${EDIT_PHONE.replace('+', '')}`} className="quiet-link" style={{ color: 'inherit' }}>
                WhatsApp
              </a>
              .
            </span>
          </p>
        )}
        {result && result.invalid && (
          <p
            style={{
              margin: '22px auto 0',
              maxWidth: 460,
              fontFamily: 'var(--font-body)',
              fontSize: 16.5 * bs,
              lineHeight: 1.6,
              color: 'var(--brick)',
              textAlign: 'center',
            }}
          >
            {result.reason === 'nonexistent'
              ? 'That postcode doesn’t look right – please double-check it.'
              : 'That doesn’t look like a postcode – check it and try again.'}
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
          <button className="hlink nav-optional" onClick={() => jump('a-look-inside')}>
            Our work
          </button>
          <button className="hlink nav-optional" onClick={() => jump('availability')}>
            Check availability
          </button>
          <button className="hlink-cta" onClick={() => { window.location.href = '/contact'; }}>
            Contact
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
      <div aria-hidden="true" className="hero-scrim" style={{ position: 'absolute', inset: 0 }} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 'clamp(19vh, 24vh, 26vh)',
          transform: 'translateX(-50%)',
          zIndex: 2,
          padding: '0 24px',
          maxWidth: 760,
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: 12.5,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          lineHeight: 1.7,
          color: 'rgba(241,232,216,0.92)',
        }}
      >
        <p style={{ margin: 0 }}>A small London team, keeping a short list of homes in good working order.</p>
        <p style={{ margin: 0, marginTop: 22 }}>By recommendation, mostly.</p>
      </div>

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
      <p className="hero-script-tagline" aria-hidden="true">
        your home, in fine
      </p>
    </header>
  );
}

/* ---------- What we do ---------- */
function WhatWeDo({ t, m }) {
  const sf = t.sectionSpacing / 100;
  return (
    <section
      id="what-we-do"
      data-screen-label="What we do"
      style={{ padding: `calc(clamp(72px, 11vw, 130px) * ${sf}) 24px calc(clamp(60px, 9vw, 110px) * ${sf})`, position: 'relative', zIndex: 1 }}
    >
      <Reveal m={m}>
        <h2
          style={{
            margin: '0 auto 20px',
            maxWidth: 640,
            textAlign: 'center',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: `calc(clamp(32px, 4.4vw, 52px) * ${t.headingScale / 100})`,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textWrap: 'balance',
          }}
        >
          What we do
        </h2>
        <p
          style={{
            margin: '0 auto',
            maxWidth: 560,
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 19 * (t.bodyScale / 100),
            lineHeight: 1.65,
            color: 'var(--ink-60)',
          }}
        >
          One team for the whole house &ndash; painting, plastering, plumbing, fences, floors, and the odd jobs in between.
        </p>
        <p style={{ margin: '18px auto 0', textAlign: 'center' }}>
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
            A visit and quote is £30 &ndash; counted toward the work if you go ahead
          </span>
        </p>
      </Reveal>
    </section>
  );
}

/* ---------- Team ---------- */
const TEAM = [
  { name: 'Ilia', role: 'Founder', note: 'Inspection and quotation.', photo: teamIlia },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
];

function PersonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function Team({ t, m }) {
  const sf = t.sectionSpacing / 100;
  return (
    <section id="team" data-screen-label="Team" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: `calc(clamp(48px, 7vw, 88px) * ${sf}) 24px calc(clamp(56px, 8vw, 100px) * ${sf})` }}>
        <Reveal m={m}>
          <h2
            style={{
              margin: '0 auto 12px',
              maxWidth: 640,
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: `calc(clamp(28px, 3.8vw, 44px) * ${t.headingScale / 100})`,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              textWrap: 'balance',
            }}
          >
            Meet the team
          </h2>
          <p
            style={{
              margin: '0 auto',
              maxWidth: 480,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: 17 * (t.bodyScale / 100),
              lineHeight: 1.6,
              color: 'var(--ink-60)',
            }}
          >
            The small permanent team behind every visit.
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 'clamp(28px, 4vw, 44px)',
              marginTop: 'clamp(32px, 5vw, 48px)',
              maxWidth: 900,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {TEAM.map((person, i) => (
              <div key={i} style={{ width: 180, textAlign: 'center' }}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    margin: '0 auto 16px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: 'var(--tan-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--ink-40)',
                  }}
                >
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <PersonIcon />
                  )}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 17,
                    color: person.placeholder ? 'var(--ink-40)' : 'var(--ink)',
                  }}
                >
                  {person.name || 'Name'}
                </p>
                <p
                  style={{
                    margin: '4px 0 0',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 12.5,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-40)',
                  }}
                >
                  {person.role || 'Role'}
                </p>
                {person.note && (
                  <p style={{ margin: '8px 0 0', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.5, color: 'var(--ink-60)' }}>
                    {person.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Photo story ---------- */
const STORY = [
  {
    img: kitchenGarden,
    alt: 'A bright kitchen extension opening onto a London garden',
    caption: 'Plimsoll Road, Highbury · N5',
    line: 'From a wonky fence to a fresh coat of paint, one team does the lot painting, plastering, plumbing, fences, floors, odd jobs.',
    wide: true,
  },
  {
    img: livingRoom,
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
function BeforeAfter({ t, m, before, after, beforeAlt, afterAlt, quote, caption }) {
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
          {quote}
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
              src={after}
              alt={afterAlt}
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
              src={before}
              alt={beforeAlt}
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
            {caption}
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}

const BEFORE_AFTERS = [
  {
    before: beforeAfterBefore,
    after: beforeAfterAfter,
    beforeAlt: '42 – the garden and driveway before: overgrown beds, weeds through the paving',
    afterAlt: '42 – the garden and driveway after Fettle’s work: clipped hedges, fresh planting, tidy paving',
    quote: 'Same house, N6. Drag to see the difference a season of upkeep makes.',
    caption: 'Bishopswood Road, Highgate · N6',
  },
  {
    before: beforeAfter2Before,
    after: beforeAfter2After,
    beforeAlt: 'A period dining room before: tired dark walls, bare boards, worn furniture',
    afterAlt: 'The same dining room after Fettle’s work: fresh paint, restored cornice, warm and finished',
    quote: 'Same room, N6. Drag to see what a proper going-over does.',
    caption: 'Lambolle Road, Belsize Park · NW3',
  },
];

function Story({ t, m, pcfg }) {
  return (
    <section id="our-work" data-screen-label="Our work" style={{ position: 'relative', zIndex: 1 }}>
      {STORY.map((s, i) => (
        <React.Fragment key={i}>
          {i === STORY.length - 1 && (
            <React.Fragment>
              <Carousel t={t} m={m} />
              {BEFORE_AFTERS.map((b, j) => <BeforeAfter key={'ba' + j} t={t} m={m} {...b} />)}
            </React.Fragment>
          )}
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
    <section id="availability" data-screen-label="Close" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: `calc(clamp(32px, 4vw, 64px) * ${sf}) 24px calc(clamp(80px, 10vw, 120px) * ${sf})` }}>
        <Reveal m={m}>
          <div
            style={{
              maxWidth: 760,
              margin: '0 auto',
              background: 'var(--tan-pill)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 56px)',
            }}
          >
          <p
            style={{
              margin: '0 auto 40px',
              maxWidth: 480,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic',
              fontSize: 16.5 * (t.bodyScale / 100),
              lineHeight: 1.6,
              color: 'var(--ink-60)',
            }}
          >
            &ldquo;They knew where our stopcock was before we did. Three winters in and it is the same two faces every time, which is rather the whole point.&rdquo;
            <span style={{ display: 'block', marginTop: 8, fontStyle: 'normal', fontSize: 13, letterSpacing: '0.04em', color: 'var(--ink-40)' }}>
              Sarah M. &middot; Plimsoll Road, Highbury
            </span>
          </p>
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
              margin: '0 auto 12px',
              maxWidth: 440,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontSize: 17 * (t.bodyScale / 100),
              lineHeight: 1.6,
              color: 'var(--ink-60)',
            }}
          >
            One postcode is all it takes. If we have room near you, we&rsquo;ll say so plainly.
          </p>
          <p
            style={{
              margin: '0 auto 36px',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 13.5 * (t.bodyScale / 100),
              color: 'var(--ink-40)',
            }}
          >
            A visit and quote is £30, counted toward the work if you go ahead.
          </p>
          <QuietPostcode id="postcode-close" t={t} />
          </div>
        </Reveal>
      </div>

    </section>
  );
}

/* ---------- FAQ ---------- */
const FAQS = [
  {
    q: 'How much does a visit cost?',
    a: 'A visit to see the job and give you a price is £30. If you go ahead with the work that same visit, it comes straight off the cost, so there is no call-out fee on top. As an introductory rate for our first clients, a half-day starts at £90, a full day at £160, materials on top at cost. You will know the price before we lift a tool. Licensed trades are quoted job by job once we have seen the work.',
  },
  {
    q: 'What sort of jobs do you take on?',
    a: 'From a wonky fence to a fresh coat of paint, one team does the lot: painting, plastering, plumbing, floors, fences, and the odd jobs that never quite get done. Anything that needs a licence, plumbing, rendering, tree surgery, goes to a specialist we know by name and have used before.',
  },
  {
    q: 'Do you have room for my home?',
    a: 'We take on a few more homes each season, postcode by postcode, so we can keep doing right by the ones already on the list. Give us your postcode and we will tell you plainly whether there is room near you. We work across north, northwest, west, southwest, south, and central London.',
  },
  {
    q: 'Will it be the same people each time?',
    a: 'Yes. A small permanent team does the day-to-day work, so it is the same faces each visit. People who know where the stopcock is, and which floorboard creaks.',
  },
  {
    q: 'What happens on the first visit?',
    a: 'The visit itself is £30 – we come and take a proper look, note what needs doing, and get to know the house. Then you get a plain price, half-day or full-day, with no surprises, and the £30 counts toward it if you go ahead there and then. Dust sheets down, shoes off, radio low, and everything left tidy.',
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
      { label: 'About Fettle', href: '/about' },
      { label: 'Testimonials', href: '/testimonials' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    head: 'Services',
    links: [
      { label: 'What we fix', href: '/services' },
      { label: 'How it works', href: '/how-it-works' },
    ],
  },
  {
    head: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms of use', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
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

/* ---------- Coverflow carousel (header) ---------- */
const CAROUSEL = [
  { img: beforeAfter2After, caption: 'Bishopswood Road, Highgate · N6' },
  { img: carouselGreenLiving, caption: 'Plimsoll Road, Highbury · N5' },
  { img: carouselBlueLiving, caption: 'Church Crescent, Muswell Hill · N10' },
  { img: carouselHallway, caption: 'Fitzjohn’s Avenue, Hampstead · NW3' },
  { img: carouselDrawingRoom, caption: 'Lansdowne Road, Holland Park · W11' },
  { img: carouselKitchen, caption: 'Wadham Gardens, Primrose Hill · NW3' },
  { img: diningSkylight, caption: 'Mount View Road, Crouch End · N4' },
];

function Carousel({ t, m }) {
  const n = CAROUSEL.length;
  const [active, setActive] = React.useState(0);
  const sf = t.sectionSpacing / 100;

  const go = (dir) => setActive((a) => (a + dir + n) % n);

  // offset in [-n/2 .. n/2]
  const rel = (i) => {
    let d = i - active;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  const cardFor = (d) => {
    const abs = Math.abs(d);
    const base = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: 'clamp(240px, 30vw, 400px)',
      height: 'clamp(320px, 40vw, 520px)',
      borderRadius: t.imageRadius + 6,
      overflow: 'hidden',
      transition: 'transform .55s cubic-bezier(.22,.61,.36,1), filter .55s ease, opacity .45s ease',
      transformOrigin: 'center center',
      willChange: 'transform',
    };
    if (d === 0) {
      return {
        ...base,
        transform: 'translate(-50%, -50%) translateX(0) rotateY(0deg) scale(1.12)',
        zIndex: 6,
        filter: 'none',
        opacity: 1,
        boxShadow: 'var(--shadow-raised)',
        cursor: 'default',
      };
    }
    const dir = d < 0 ? -1 : 1;
    const shift = abs === 1 ? 300 : 560;
    const rot = abs === 1 ? 34 : 42;
    const scale = abs === 1 ? 0.82 : 0.66;
    return {
      ...base,
      transform: `translate(-50%, -50%) translateX(${dir * shift}px) rotateY(${-dir * rot}deg) scale(${scale})`,
      zIndex: abs === 1 ? 4 : 2,
      filter: 'brightness(0.5) saturate(0.85)',
      opacity: abs >= 2 ? 0 : 1,
      pointerEvents: abs >= 2 ? 'none' : 'auto',
      cursor: 'pointer',
      boxShadow: 'var(--shadow-card)',
    };
  };

  const arrow = (dir) => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [dir < 0 ? 'left' : 'right']: 'clamp(8px, 4vw, 60px)',
    zIndex: 10,
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--rust)',
    color: 'var(--cream)',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'var(--shadow-raised)',
    transition: 'background .15s ease',
  });

  return (
    <section id="a-look-inside" data-screen-label="A look inside" style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ padding: `calc(clamp(24px, 3vw, 48px) * ${sf}) 24px calc(clamp(40px, 6vw, 72px) * ${sf})` }}>
        <Reveal m={m}>
          <div
            style={{
              maxWidth: 1180,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 16,
              paddingBottom: 8,
              borderBottom: '1px solid var(--ink-12)',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: `calc(clamp(26px, 3.4vw, 40px) * ${t.headingScale / 100})`,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
              }}
            >
              A look inside
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(18px, 2.2vw, 24px)',
                color: 'var(--ink-40)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(active + 1).padStart(2, '0')}
              <span style={{ fontSize: '0.7em' }}> / {String(n).padStart(2, '0')}</span>
            </span>
          </div>
        </Reveal>

        <Reveal m={m}>
          <div
            style={{
              position: 'relative',
              height: 'clamp(380px, 46vw, 600px)',
              marginTop: 'clamp(28px, 4vw, 48px)',
              perspective: '1700px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              style={arrow(-1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brick)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rust)')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>

            <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
              {CAROUSEL.map((c, i) => {
                const d = rel(i);
                return (
                  <div
                    key={i}
                    style={cardFor(d)}
                    onClick={() => d !== 0 && setActive(i)}
                    aria-hidden={d !== 0}
                  >
                    <img
                      src={c.img}
                      alt={c.caption}
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              style={arrow(1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brick)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rust)')}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </Reveal>

        <Reveal m={m}>
          <p
            style={{
              margin: 'clamp(24px, 3vw, 36px) auto 0',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 12,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--ink-40)',
            }}
          >
            {CAROUSEL[active].caption}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 18 }}>
            {CAROUSEL.map((c, i) => (
              <button
                key={i}
                type="button"
                aria-label={'Go to ' + c.caption}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? 26 : 8,
                  height: 8,
                  borderRadius: 20,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  background: i === active ? 'var(--rust)' : 'var(--ink-12)',
                  transition: 'width .3s ease, background .15s ease',
                }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- App ---------- */
export default function Home() {
  const t = TWEAK_DEFAULTS;


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
      <WhatWeDo t={t} m={m} />
      <Story t={t} m={m} pcfg={pcfg} />
      <Close t={t} m={m} />
      <Team t={t} m={m} />
      <FAQ t={t} m={m} />
      <SiteFooter />
    </React.Fragment>
  );
}

