/* Fettle — app shell: sticky nav with the animated lockup, the entrance
   sequence, section composition, and Tweaks. */

const { BrandMark } = window.FettleDesignSystem_b6c43b;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  headline: 'A handful of London homes, kept in fine fettle.',
  heroTone: 'sepia',
  annotations: true,
  entrance: true,
} /*EDITMODE-END*/;

/* ---------- Sticky nav with the lockup (mark + wordmark) ---------- */
function Nav({ revealed, lockRef, markRef, wordRef, onCheck }) {
  const [hover, setHover] = React.useState(-1);
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'What we fix', target: 'what-we-fix' },
    { label: 'Pricing', target: 'in-context' },
    { label: 'How it works', target: 'how-it-works' },
  ];
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const chromeStyle = {
    opacity: revealed ? 1 : 0,
    transition: 'opacity .3s ease',
    pointerEvents: revealed ? 'auto' : 'none',
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--cream)',
        borderBottom: `1px solid ${revealed && scrolled ? 'var(--ink-12)' : 'transparent'}`,
        transition: 'border-color .3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="fettle-shell-pad"
      >
        {/* The lockup — animated on entrance, never leaves the DOM */}
        <a
          ref={lockRef}
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 11,
            textDecoration: 'none',
            position: 'relative',
            zIndex: 60,
            willChange: 'transform',
          }}
          aria-label="Fettle — home"
        >
          <span ref={markRef} style={{ display: 'inline-flex' }}>
            <BrandMark size={34} radius={9} />
          </span>
          <span
            ref={wordRef}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 22,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
            }}
          >
            Fettle
          </span>
        </a>

        {/* Chrome — hidden until the entrance settles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 30, ...chromeStyle }} className="fettle-nav-links">
          {links.map((l, i) => (
            <button
              key={i}
              onClick={() => jump(l.target)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                fontWeight: 500,
                color: hover === i ? 'var(--ink)' : 'var(--ink-60)',
                transition: 'color .2s ease',
                padding: '6px 2px',
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={onCheck}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--ink)') || (e.currentTarget.style.background = 'var(--ink)') || (e.currentTarget.style.color = 'var(--white)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent') || (e.currentTarget.style.color = 'var(--ink)') || (e.currentTarget.style.borderColor = 'var(--ink)')}
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 15,
              padding: '11px 22px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--ink)',
              background: 'transparent',
              color: 'var(--ink)',
              cursor: 'pointer',
              transition: 'background .25s ease, color .25s ease, border-color .25s ease',
            }}
          >
            Check your postcode
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ---------- App ---------- */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const alreadyPlayed =
    typeof sessionStorage !== 'undefined' && sessionStorage.getItem('fettle_entered') === '1';

  const shouldPlay = t.entrance && !reduce && !alreadyPlayed;
  const [revealed, setRevealed] = React.useState(!shouldPlay);

  const lockRef = React.useRef(null);
  const markRef = React.useRef(null);
  const wordRef = React.useRef(null);

  // Entrance sequence: centred mark → wordmark emerges → mark settles left → page fades in.
  React.useEffect(() => {
    if (!shouldPlay) return;
    const lock = lockRef.current;
    const mark = markRef.current;
    const word = wordRef.current;
    if (!lock || !mark || !word) {
      setRevealed(true);
      return;
    }

    const mr = mark.getBoundingClientRect();
    const lr = lock.getBoundingClientRect();
    const scale = 2.6;
    const ox = mr.left + mr.width / 2 - lr.left;
    const oy = mr.top + mr.height / 2 - lr.top;
    const dx = window.innerWidth / 2 - (mr.left + mr.width / 2);
    const dy = window.innerHeight / 2 - (mr.top + mr.height / 2);

    lock.style.transformOrigin = `${ox}px ${oy}px`;
    lock.style.transition = 'none';
    lock.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    word.style.transition = 'none';
    word.style.opacity = '0';
    word.style.clipPath = 'inset(0 100% 0 0)';
    // force reflow
    void lock.getBoundingClientRect();

    let settleTimer, wordTimer;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        lock.style.transition = 'transform 1.05s cubic-bezier(0.22, 0.61, 0.36, 1)';
        lock.style.transform = 'translate(0, 0) scale(1)';
        wordTimer = setTimeout(() => {
          word.style.transition =
            'opacity .55s ease, clip-path .7s cubic-bezier(0.22, 0.61, 0.36, 1)';
          word.style.opacity = '1';
          word.style.clipPath = 'inset(0 0 0 0)';
        }, 170);
      }),
    );

    settleTimer = setTimeout(() => {
      // clear inline transforms so layout/resize behaves normally
      lock.style.transition = '';
      lock.style.transform = '';
      lock.style.transformOrigin = '';
      word.style.transition = '';
      try {
        sessionStorage.setItem('fettle_entered', '1');
      } catch (e) {}
      setRevealed(true);
    }, 1200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleTimer);
      clearTimeout(wordTimer);
    };
  }, [shouldPlay]);

  const focusPostcode = () => {
    const el = document.getElementById('postcode');
    if (el) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => el.focus(), 400);
    }
  };

  const contentStyle = {
    opacity: revealed ? 1 : 0,
    transition: 'opacity .3s ease',
  };

  const heroToneOptions = ['sepia', 'stone', 'clay', 'ink'];

  return (
    <React.Fragment>
      <a id="top" />
      <Nav
        revealed={revealed}
        lockRef={lockRef}
        markRef={markRef}
        wordRef={wordRef}
        onCheck={focusPostcode}
      />

      <main
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '0 32px 40px',
          ...contentStyle,
        }}
        className="fettle-shell-pad"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(64px, 9vw, 104px)', paddingTop: 8 }}>
          <Hero tweaks={t} />
          <Positioning />
          <div id="what-we-fix"><WhatWeFix /></div>
          <div id="how-it-works"><HowItWorks tweaks={t} /></div>
          <div id="in-context"><InContext /></div>
          <Close tweaks={t} />
          <Footer />
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Copy" />
        <TweakText
          label="Hero headline"
          value={t.headline}
          onChange={(v) => setTweak('headline', v)}
        />
        <TweakSection label="Blueprint motif" />
        <TweakSelect
          label="Hero image tone"
          value={t.heroTone}
          options={heroToneOptions}
          onChange={(v) => setTweak('heroTone', v)}
        />
        <TweakToggle
          label="Architect annotations"
          value={t.annotations}
          onChange={(v) => setTweak('annotations', v)}
        />
        <TweakSection label="Motion" />
        <TweakToggle
          label="Entrance animation"
          value={t.entrance}
          onChange={(v) => setTweak('entrance', v)}
        />
        <TweakButton
          label="Replay entrance"
          onClick={() => {
            try {
              sessionStorage.removeItem('fettle_entered');
            } catch (e) {}
            window.location.reload();
          }}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
