/* Fettle — landing page sections. Editorial, asymmetric, magazine pacing.
   Composes design-system components (Badge, Card, ServiceCard) with the
   blueprint motif and the postcode check. */

const { Badge, Card, ServiceCard } = window.FettleDesignSystem_b6c43b;

function Eyebrow({ children, style }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        color: 'var(--rust)',
        margin: '0 0 14px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/* ---------- Hero ---------- */
function Hero({ tweaks }) {
  return (
    <header className="fettle-reveal" style={{ paddingTop: 40 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)',
          gap: 56,
          alignItems: 'center',
        }}
        className="fettle-hero-grid"
      >
        {/* Left — editorial headline + the conversion moment */}
        <div>
          <Eyebrow>Boutique home care · London</Eyebrow>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(40px, 5vw, 60px)',
              lineHeight: 1.04,
              letterSpacing: '-0.015em',
              color: 'var(--ink)',
              margin: '0 0 22px',
              textWrap: 'balance',
            }}
          >
            {tweaks.headline}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 19,
              lineHeight: 1.6,
              color: 'var(--ink-60)',
              margin: '0 0 34px',
              maxWidth: 480,
            }}
          >
            One small, permanent team looks after a short list of homes across South and East London.
            From a wonky fence to a fresh coat of paint — good hands, good work, the same faces each
            visit.
          </p>
          <PostcodeCheck size="lg" />
        </div>

        {/* Right — the single strong annotated-drawing moment */}
        <div style={{ position: 'relative' }}>
          <BlueprintFrame
            tone={tweaks.heroTone}
            height={520}
            note="PHOTOGRAPH — PERIOD TERRACE, EAST DULWICH · FULL-BLEED"
            tag="PLASTER — LIME, BREATHABLE"
            tagCorner="bl"
            dim={tweaks.annotations ? 'SE22' : null}
          />
          {tweaks.annotations && (
            <div
              style={{
                position: 'absolute',
                top: -14,
                right: 22,
                background: 'var(--cream)',
                padding: '0 8px',
              }}
            >
              <Annotation style={{ color: 'var(--brick)' }}>FIG. 01 — IN FINE FETTLE</Annotation>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------- Positioning pull-quote ---------- */
function Positioning() {
  return (
    <section className="fettle-reveal" style={{ maxWidth: 980 }}>
      <Eyebrow>Why we take on fewer homes</Eyebrow>
      <blockquote
        style={{
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'clamp(26px, 3.4vw, 40px)',
          lineHeight: 1.22,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          textWrap: 'balance',
        }}
      >
        We keep the list short on purpose. A home we look after gets the same team, who learn its
        quirks, its boiler and its draughty sash windows — so the work is quieter, tidier, and done
        properly the first time.
      </blockquote>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 17,
          lineHeight: 1.6,
          color: 'var(--ink-60)',
          margin: '24px 0 0',
          maxWidth: 620,
        }}
      >
        We grow by word of mouth, not adverts. Most new homes come from a neighbour&rsquo;s
        recommendation — which is exactly how we&rsquo;d like to keep it.
      </p>
    </section>
  );
}

/* ---------- What we fix — editorial index ---------- */
const SERVICE_GROUPS = [
  {
    group: 'Fabric & Finish',
    note: 'The everyday care of walls, woodwork and surfaces.',
    items: ['Handyman & odd jobs', 'Painting', 'Plastering', 'Puttying', 'Rendering'],
  },
  {
    group: 'Outside & Structure',
    note: 'The garden edge and the boundary line.',
    items: ['Fencing', 'Small tree surgery'],
  },
  {
    group: 'Home Care',
    note: 'Keeping the inside in good order.',
    items: ['Cleaning', 'Carpet & flooring'],
  },
  {
    group: 'Plumbing',
    note: 'A personally-vetted specialist on the bench.',
    items: ['Plumbing'],
  },
  {
    group: 'Life Admin',
    note: 'The jobs that come with moving.',
    items: ['Moving services'],
  },
];

function WhatWeFix() {
  return (
    <section className="fettle-reveal">
      <div style={{ maxWidth: 640, marginBottom: 48 }}>
        <Eyebrow>What we fix</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 3.4vw, 36px)',
            lineHeight: 1.12,
            color: 'var(--ink)',
            margin: '0 0 12px',
          }}
        >
          Eleven things, one team.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-60)', margin: 0 }}>
          A single crew of multi-skilled generalists does the day-to-day; a short bench of vetted
          specialists covers the licensed trades.
        </p>
      </div>

      <div style={{ borderTop: '1px solid var(--ink-12)' }}>
        {SERVICE_GROUPS.map((g, i) => (
          <div
            key={i}
            className="fettle-index-row"
            style={{
              display: 'grid',
              gridTemplateColumns: '48px minmax(180px, 1fr) 2fr',
              gap: 24,
              alignItems: 'baseline',
              padding: '26px 0',
              borderBottom: '1px solid var(--ink-12)',
            }}
          >
            <Annotation style={{ color: 'var(--ink-40)' }}>
              {String(i + 1).padStart(2, '0')}
            </Annotation>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 23,
                  color: 'var(--ink)',
                  margin: '0 0 4px',
                }}
              >
                {g.group}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-40)', margin: 0 }}>
                {g.note}
              </p>
            </div>
            <ul
              style={{
                listStyle: 'none',
                margin: 0,
                padding: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px 10px',
                alignSelf: 'center',
              }}
            >
              {g.items.map((it, j) => (
                <li key={j}>
                  <Badge variant="outline" dot={false} style={{ fontSize: 14 }}>
                    {it}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- How it works — editorial prose, no false numbers ---------- */
function HowItWorks({ tweaks }) {
  return (
    <section className="fettle-reveal">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.85fr) minmax(0, 1.15fr)',
          gap: 56,
          alignItems: 'center',
        }}
        className="fettle-hero-grid"
      >
        <BlueprintFrame
          tone="stone"
          height={420}
          note="PHOTOGRAPH — TIDY WORKBENCH, DUST-SHEETED FLOOR"
          tag="FENCE — REPLACED 2024"
          tagCorner="tr"
          dim={tweaks.annotations ? 'SAME TEAM' : null}
        />
        <div>
          <Eyebrow>How it works</Eyebrow>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(26px, 3.2vw, 34px)',
              lineHeight: 1.15,
              color: 'var(--ink)',
              margin: '0 0 20px',
            }}
          >
            It starts with a visit, not a form.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17.5, lineHeight: 1.7, color: 'var(--ink-60)', margin: '0 0 16px' }}>
            Check your postcode above and, if we&rsquo;ve room, we&rsquo;ll come round to look at
            the job in person — no call-out fee. You&rsquo;ll meet the person who&rsquo;ll actually
            do the work.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17.5, lineHeight: 1.7, color: 'var(--ink-60)', margin: '0 0 16px' }}>
            We quote plainly, half-day or full-day, materials in. Then we get on with it — dust
            sheets down, a tidy finish, and the same faces if you have us back.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17.5, lineHeight: 1.7, color: 'var(--ink-60)', margin: 0 }}>
            No app to learn, no strangers, no chasing. Just good hands, good work.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- In context — tangible, specific pricing ---------- */
const PRICING = [
  {
    title: 'Handyman half-day',
    sub: 'A run of odd jobs — shelves up, a wonky fence panel, a sticking door.',
    price: 'from £140',
    badges: ['Local team', 'No call-out fee', 'Tidy finish'],
  },
  {
    title: 'Repaint — one room',
    sub: 'Walls and woodwork, two coats, materials in. Dust sheets down.',
    price: 'from £320',
    badges: ['Dust-sheeted', 'Same face each visit'],
  },
  {
    title: 'Lime plaster patch',
    sub: 'Breathable repair for a period wall, made good and ready to paint.',
    price: 'from £280',
    badges: ['Period-proper', 'Breathable'],
  },
];

function InContext() {
  return (
    <section className="fettle-reveal">
      <div style={{ maxWidth: 640, marginBottom: 44 }}>
        <Eyebrow>In context</Eyebrow>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(28px, 3.4vw, 36px)',
            lineHeight: 1.12,
            color: 'var(--ink)',
            margin: '0 0 12px',
          }}
        >
          Real jobs, plain prices.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-60)', margin: 0 }}>
          A few recent jobs, priced the way we quote them. No hidden call-out fee, no surprises at
          the end.
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
          alignItems: 'stretch',
        }}
      >
        {PRICING.map((p, i) => (
          <ServiceCard
            key={i}
            title={p.title}
            sub={p.sub}
            price={p.price}
            badges={p.badges}
            style={{ maxWidth: 'none', height: '100%', boxSizing: 'border-box' }}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------- Close — the postcode check, restated as the only CTA ---------- */
function Close({ tweaks }) {
  return (
    <section className="fettle-reveal">
      <div
        style={{
          background: 'var(--ink)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(40px, 6vw, 72px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {tweaks.annotations && (
          <React.Fragment>
            <RegMark corner="tl" color="rgba(241,232,216,0.4)" />
            <RegMark corner="tr" color="rgba(241,232,216,0.4)" />
            <RegMark corner="bl" color="rgba(241,232,216,0.4)" />
            <RegMark corner="br" color="rgba(241,232,216,0.4)" />
          </React.Fragment>
        )}
        <div style={{ maxWidth: 620, position: 'relative' }}>
          <Eyebrow style={{ color: 'var(--cream)', opacity: 0.7 }}>
            In fine fettle
          </Eyebrow>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(30px, 4vw, 44px)',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
              margin: '0 0 18px',
              textWrap: 'balance',
            }}
          >
            See if there&rsquo;s room on the list.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 18,
              lineHeight: 1.6,
              color: 'rgba(241,232,216,0.72)',
              margin: '0 0 32px',
            }}
          >
            One postcode is all it takes. If we&rsquo;ve room near you, we&rsquo;ll say so plainly.
          </p>
          <div className="fettle-close-check">
            <PostcodeCheck size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { BrandMark } = window.FettleDesignSystem_b6c43b;
  return (
    <footer
      style={{
        borderTop: '1px solid var(--ink-12)',
        marginTop: 24,
        paddingTop: 40,
        paddingBottom: 48,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandMark size={30} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>
          Fettle
        </span>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-40)', marginLeft: 8 }}>
          Good hands, good work. London.
        </span>
      </div>
      <Annotation style={{ color: 'var(--ink-40)' }}>© 2026 · BY RECOMMENDATION ONLY</Annotation>
    </footer>
  );
}

Object.assign(window, {
  Eyebrow,
  Hero,
  Positioning,
  WhatWeFix,
  HowItWorks,
  InContext,
  Close,
  Footer,
});
