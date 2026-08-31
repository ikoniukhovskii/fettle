/* Fettle — the primary conversion moment.
   A live, inline availability check: one large plain input that resolves
   instantly to a warm, specific answer. Paired with a single always-visible,
   zero-friction fallback (call / WhatsApp) styled quietly.

   No email capture, no multi-step form, no submit-and-wait. Large tap
   targets, obvious without hover, keyboard-accessible. */

const PHONE = '+447361854124';
const PHONE_DISPLAY = '+44 7361 854124';

/* Everything resolves warmly to "available" (demo). We normalise the typed
   postcode to an outward code (e.g. "SE22") and echo it back specifically. */
function outwardCode(raw) {
  const s = (raw || '').toUpperCase().replace(/\s+/g, '');
  const m = s.match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  if (m) return m[1];
  return s.slice(0, 4);
}

function PostcodeCheck({ size = 'lg', autoFocusOnMount = false }) {
  const [value, setValue] = React.useState('');
  const [result, setResult] = React.useState(null); // { code }
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef(null);

  const check = () => {
    const code = outwardCode(value);
    if (!code) {
      inputRef.current && inputRef.current.focus();
      return;
    }
    setResult({ code });
  };

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      check();
    }
  };

  const big = size === 'lg';
  const fieldFont = big ? 20 : 18;
  const pad = big ? '18px 20px' : '15px 18px';

  return (
    <div style={{ width: '100%', maxWidth: 560 }}>
      <label
        htmlFor="postcode"
        style={{
          display: 'block',
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 600,
          color: 'var(--ink)',
          marginBottom: 10,
        }}
      >
        See if we&rsquo;re taking on homes near you
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <input
          id="postcode"
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="Enter your postcode"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (result) setResult(null);
          }}
          onKeyDown={onKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: '1 1 260px',
            minWidth: 0,
            fontFamily: 'var(--font-body)',
            fontSize: fieldFont,
            fontWeight: 500,
            padding: pad,
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${focused ? 'var(--rust)' : 'var(--ink-12)'}`,
            background: 'var(--white)',
            color: 'var(--ink)',
            outline: 'none',
            transition: 'border-color .25s ease',
          }}
        />
        <button
          type="button"
          onClick={check}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--brick)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--rust)')}
          style={{
            flex: '0 0 auto',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: fieldFont,
            padding: big ? '18px 34px' : '15px 28px',
            borderRadius: 'var(--radius-md)',
            border: '2px solid transparent',
            background: 'var(--rust)',
            color: 'var(--white)',
            cursor: 'pointer',
            transition: 'background .25s ease',
          }}
        >
          Check
        </button>
      </div>

      {/* Warm, specific answer — appears inline, calm sage confirmation */}
      <div aria-live="polite" style={{ minHeight: result ? undefined : 0 }}>
        {result && (
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--sage-tint)',
              border: '1px solid rgba(110,138,107,0.35)',
              animation: 'fettleFade .3s ease both',
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 22,
                height: 22,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: 'var(--white)',
                background: 'var(--sage)',
                marginTop: 1,
              }}
            >
              ✓
            </span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: 16 }}>
                We&rsquo;re taking on 2 more homes in {result.code} this month.
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.55, marginTop: 3 }}>
                Give us a call or a message and we&rsquo;ll arrange a first visit — no call-out fee, same
                face each time.
              </div>
            </div>
          </div>
        )}
      </div>

      <ContactFallback />
    </div>
  );
}

/* The single quiet fallback — always visible, never competes with the check. */
function ContactFallback() {
  const link = (href, label, aria) => {
    const [hover, setHover] = React.useState(false);
    return (
      <a
        href={href}
        aria-label={aria}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 500,
          color: hover ? 'var(--brick)' : 'var(--ink-60)',
          textDecoration: 'none',
          transition: 'color .25s ease',
          padding: '6px 0',
        }}
      >
        {label}
      </a>
    );
  };
  return (
    <div
      style={{
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '6px 18px',
        color: 'var(--ink-40)',
        fontSize: 15,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)' }}>Or, more simply —</span>
      {link(`tel:${PHONE}`, `Call ${PHONE_DISPLAY}`, 'Call Fettle')}
      <span aria-hidden="true" style={{ color: 'var(--ink-12)' }}>·</span>
      {link(
        `https://wa.me/${PHONE.replace('+', '')}`,
        'WhatsApp us',
        'Message Fettle on WhatsApp',
      )}
    </div>
  );
}

Object.assign(window, { PostcodeCheck, ContactFallback, PHONE, PHONE_DISPLAY });
