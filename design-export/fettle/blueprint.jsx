/* Fettle — blueprint / architect's-annotation motif.
   Thin construction lines, corner registration marks, measurement ticks,
   and small-caps mono technical labels layered over editorial placeholder
   blocks. Used with restraint: one or two moments per screen.

   The mono utility face (IBM Plex Mono) is ONLY ever used here — never for
   real headings or body copy. */

/* ---- Small-caps mono technical label, e.g. "PLASTER — LIME, BREATHABLE" ---- */
function Annotation({ children, style }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-annot)',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'var(--ink-60)',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ---- Corner registration mark (crosshair-in-corner) ---- */
function RegMark({ corner = 'tl', color = 'var(--ink-40)' }) {
  const pos = {
    tl: { top: -1, left: -1 },
    tr: { top: -1, right: -1, transform: 'scaleX(-1)' },
    bl: { bottom: -1, left: -1, transform: 'scaleY(-1)' },
    br: { bottom: -1, right: -1, transform: 'scale(-1)' },
  }[corner];
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      style={{ position: 'absolute', ...pos }}
    >
      <path d="M0 6 V0 H6" stroke={color} strokeWidth="1" />
      <path d="M3 9 H9 M9 3 V9" stroke={color} strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

/* ---- Horizontal dimension line with end ticks + centred measure label ---- */
function DimLine({ label, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: 'var(--ink-40)',
        ...style,
      }}
      aria-hidden="true"
    >
      <span style={{ width: '1px', height: '9px', background: 'currentColor', flexShrink: 0 }} />
      <span style={{ flex: 1, height: '1px', background: 'currentColor' }} />
      {label && <Annotation style={{ color: 'var(--ink-40)' }}>{label}</Annotation>}
      <span style={{ flex: 1, height: '1px', background: 'currentColor' }} />
      <span style={{ width: '1px', height: '9px', background: 'currentColor', flexShrink: 0 }} />
    </div>
  );
}

/* ---- Editorial placeholder block, annotated like a kept site drawing.
   `tone` sets the flat warm fill; `note` is the held-photo caption in the
   middle; `tag`/`tagCorner` place a single technical label; `dim` draws an
   optional dimension line along the bottom edge. ---- */
function BlueprintFrame({
  note,
  tag,
  tagCorner = 'bl',
  dim,
  tone = 'sepia',
  height = 460,
  regMarks = true,
  style,
}) {
  const tones = {
    // warm, natural, never cool — a held slot in a site drawing
    sepia: 'linear-gradient(150deg, #C9A98A 0%, #A67F5E 55%, #8A6647 100%)',
    ink: 'linear-gradient(150deg, #3A342E 0%, #2B2723 100%)',
    clay: 'linear-gradient(150deg, #C98A6E 0%, #A85E42 100%)',
    stone: 'linear-gradient(150deg, #D8CBB4 0%, #BDAE93 100%)',
  };
  const dark = tone === 'ink' || tone === 'clay';
  const lineCol = dark ? 'rgba(241,232,216,0.55)' : 'rgba(43,39,35,0.45)';
  const noteCol = dark ? 'rgba(241,232,216,0.72)' : 'rgba(43,39,35,0.58)';

  const tagPos = {
    tl: { top: 14, left: 16 },
    tr: { top: 14, right: 16 },
    bl: { bottom: 14, left: 16 },
    br: { bottom: 14, right: 16 },
  }[tagCorner];

  return (
    <figure
      style={{
        position: 'relative',
        margin: 0,
        height,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: tones[tone],
        boxShadow: 'var(--shadow-card)',
        ...style,
      }}
    >
      {/* faint construction grid line — one vertical third, restraint */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '38.2%',
          width: '1px',
          background: lineCol,
          opacity: 0.4,
        }}
      />
      {regMarks && (
        <React.Fragment>
          <RegMark corner="tl" color={lineCol} />
          <RegMark corner="tr" color={lineCol} />
          <RegMark corner="bl" color={lineCol} />
          <RegMark corner="br" color={lineCol} />
        </React.Fragment>
      )}

      {/* held-photo caption, centred, plain-spoken about what belongs here */}
      {note && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 40px',
            textAlign: 'center',
          }}
        >
          <Annotation style={{ color: noteCol, whiteSpace: 'normal', lineHeight: 1.7 }}>
            {note}
          </Annotation>
        </div>
      )}

      {/* single technical label in one corner */}
      {tag && (
        <div style={{ position: 'absolute', ...tagPos }}>
          <Annotation style={{ color: dark ? 'rgba(241,232,216,0.85)' : 'var(--brick)' }}>
            {tag}
          </Annotation>
        </div>
      )}

      {/* optional dimension line along the bottom */}
      {dim && (
        <div style={{ position: 'absolute', left: 20, right: 20, bottom: 34, color: lineCol }}>
          <DimLine label={dim} style={{ color: lineCol }} />
        </div>
      )}
    </figure>
  );
}

Object.assign(window, { Annotation, RegMark, DimLine, BlueprintFrame });
