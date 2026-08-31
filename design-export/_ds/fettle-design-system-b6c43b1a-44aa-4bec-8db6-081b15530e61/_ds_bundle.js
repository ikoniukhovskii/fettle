/* @ds-bundle: {"format":3,"namespace":"FettleDesignSystem_b6c43b","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"ServiceCard","sourcePath":"components/core/Card.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Input.jsx"},{"name":"Textarea","sourcePath":"components/forms/Input.jsx"},{"name":"BrandMark","sourcePath":"components/navigation/Navbar.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"}],"sourceHashes":{"components/core/Button.jsx":"fef92cd8593b","components/core/Card.jsx":"03c9513e4817","components/feedback/Alert.jsx":"cdfb2f2d886a","components/feedback/Badge.jsx":"506df88ea992","components/forms/Field.jsx":"b55024d44446","components/forms/Input.jsx":"c55bdca734c5","components/navigation/Navbar.jsx":"d0f4f248817c","ui_kits/website/Site.jsx":"bf9036d28ecf","ui_kits/website/parts.jsx":"d1a49695e0f4"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.FettleDesignSystem_b6c43b = window.FettleDesignSystem_b6c43b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fettle Button — one primary action per screen.
 * Primary is rust (hover → brick); secondary is an ink outline that
 * fills on hover; ghost is a low-emphasis underlined text link.
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '10px 20px',
      fontSize: '14px'
    },
    md: {
      padding: '12px 24px',
      fontSize: '15px'
    },
    lg: {
      padding: '15px 30px',
      fontSize: '16px'
    }
  };
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: 'var(--radius-md)',
    border: 'var(--border-width-control) solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    transition: 'background .15s, border-color .15s, color .15s, opacity .15s',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--ink-12)' : 'var(--rust)',
      color: disabled ? 'var(--ink-40)' : 'var(--white)'
    },
    secondary: {
      background: 'transparent',
      color: disabled ? 'var(--ink-40)' : 'var(--ink)',
      borderColor: disabled ? 'var(--ink-12)' : 'var(--ink)'
    },
    ghost: {
      background: 'transparent',
      color: disabled ? 'var(--ink-40)' : 'var(--ink)',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      padding: `${sizes[size].padding.split(' ')[0]} 4px`
    }
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? variant === 'primary' ? {
    background: 'var(--brick)'
  } : variant === 'secondary' ? {
    background: 'var(--ink)',
    color: 'var(--white)'
  } : {
    color: 'var(--brick)'
  } : null;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...variants[variant],
      ...hoverStyle,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fettle Card — white surface, soft warm shadow, generous rounding.
 * The workhorse container: service cards, quote summaries, panels.
 * Compose freely; ServiceCard below is the common in-context shape.
 */
function Card({
  padded = true,
  elevated = true,
  onClick,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: padded ? 'var(--pad-card)' : 0,
      boxShadow: elevated ? 'var(--shadow-card)' : 'none',
      border: elevated ? 'none' : 'var(--border-width) solid var(--border-default)',
      ...style
    }
  }, rest), children);
}

/**
 * ServiceCard — the in-context pricing card: title, sub, price in display
 * type, facts below as badges. `badges` is an array of strings.
 */
function ServiceCard({
  title,
  sub,
  price,
  badges = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Card, _extends({
    style: {
      maxWidth: '420px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: '19px',
      fontWeight: 700,
      margin: '0 0 4px',
      color: 'var(--ink)'
    }
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '14px',
      color: 'var(--text-muted)',
      margin: '0 0 18px'
    }
  }, sub), price && /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: '30px',
      margin: '0 0 18px',
      color: 'var(--ink)'
    }
  }, price), badges.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, badges.map((b, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: 'var(--tan-pill)',
      color: 'var(--ink)',
      fontSize: '12px',
      fontWeight: 500,
      padding: '5px 12px',
      borderRadius: 'var(--radius-pill)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'var(--sage)'
    }
  }), b))));
}
Object.assign(__ds_scope, { Card, ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fettle Alert — status that stays on-brand. No red or yellow: sage
 * confirms, rust flags, ink notes. Icon-in-a-dot on the left, title +
 * body on the right.
 */
function Alert({
  variant = 'note',
  title,
  children,
  style,
  ...rest
}) {
  const variants = {
    confirmed: {
      surface: 'var(--sage-tint)',
      border: 'rgba(110,138,107,0.35)',
      icon: 'var(--sage)',
      glyph: '✓'
    },
    attention: {
      surface: 'var(--rust-tint)',
      border: 'rgba(179,68,38,0.25)',
      icon: 'var(--rust)',
      glyph: '!'
    },
    note: {
      surface: 'var(--white)',
      border: 'var(--ink-12)',
      icon: 'var(--ink-40)',
      glyph: 'i'
    }
  };
  const v = variants[variant];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: variant === 'attention' ? 'alert' : 'status',
    style: {
      display: 'flex',
      gap: '12px',
      padding: '16px 18px',
      borderRadius: 'var(--radius-md)',
      fontSize: '14px',
      alignItems: 'flex-start',
      background: v.surface,
      border: `var(--border-width) solid ${v.border}`,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 700,
      color: 'var(--white)',
      background: v.icon,
      marginTop: '1px'
    }
  }, v.glyph), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      marginBottom: '2px',
      color: 'var(--ink)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      lineHeight: 1.5
    }
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fettle Badge — pill-shaped, low-key, factual. States a fact about a
 * job or service; never shouts. Default carries a sage dot; `outline`
 * is a bordered tag; `rust` is a soft emphasis pill.
 */
function Badge({
  variant = 'default',
  dot,
  children,
  style,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 500,
    padding: '6px 14px',
    borderRadius: 'var(--radius-pill)',
    lineHeight: 1.2
  };
  const variants = {
    default: {
      background: 'var(--tan-pill)',
      color: 'var(--ink)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--ink)',
      border: 'var(--border-width) solid var(--border-default)'
    },
    rust: {
      background: 'var(--rust-tint)',
      color: 'var(--brick)'
    }
  };

  // dot defaults on for `default`, off for others unless explicitly set
  const showDot = dot === undefined ? variant === 'default' : dot;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), showDot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: 'var(--sage)',
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Fettle Field — label + control wrapper with optional hint. Wrap any
 * Input / Select / Textarea to get the standard label and hint spacing.
 */
function Field({
  label,
  hint,
  htmlFor,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      marginBottom: '18px',
      ...style
    }
  }, rest), label && /*#__PURE__*/React.createElement("label", {
    htmlFor: htmlFor,
    style: {
      display: 'block',
      fontSize: '13px',
      fontWeight: 600,
      marginBottom: '6px',
      color: 'var(--ink)',
      fontFamily: 'var(--font-body)'
    }
  }, label), children, hint && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: 'var(--text-faint)',
      marginTop: '5px'
    }
  }, hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared field styling: cream-filled control on white cards, rust focus ring.
const fieldBase = {
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  padding: 'var(--pad-field)',
  borderRadius: 'var(--radius-sm)',
  border: 'var(--border-width-control) solid var(--ink-12)',
  background: 'var(--surface-sunken)',
  color: 'var(--ink)',
  outline: 'none',
  transition: 'border-color .15s'
};
function useFocusBorder() {
  const [focused, setFocused] = React.useState(false);
  return {
    focused,
    handlers: {
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false)
    },
    borderColor: focused ? 'var(--rust)' : 'var(--ink-12)'
  };
}

/** Text input — cream fill, rust focus. */
function Input({
  style,
  ...rest
}) {
  const {
    handlers,
    borderColor
  } = useFocusBorder();
  return /*#__PURE__*/React.createElement("input", _extends({
    style: {
      ...fieldBase,
      borderColor,
      ...style
    }
  }, handlers, rest));
}

/** Select — same field styling as Input. Pass <option> children. */
function Select({
  children,
  style,
  ...rest
}) {
  const {
    handlers,
    borderColor
  } = useFocusBorder();
  return /*#__PURE__*/React.createElement("select", _extends({
    style: {
      ...fieldBase,
      borderColor,
      ...style
    }
  }, handlers, rest), children);
}

/** Textarea — vertically resizable, min 80px. */
function Textarea({
  style,
  ...rest
}) {
  const {
    handlers,
    borderColor
  } = useFocusBorder();
  return /*#__PURE__*/React.createElement("textarea", _extends({
    style: {
      ...fieldBase,
      borderColor,
      resize: 'vertical',
      minHeight: '80px',
      ...style
    }
  }, handlers, rest));
}
Object.assign(__ds_scope, { Input, Select, Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Fettle house mark in a rust rounded tile. */
function BrandMark({
  size = 30,
  radius = 8
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: radius,
      background: 'var(--rust)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size * 0.5,
    height: size * 0.5,
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 11L12 3L21 11",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V10",
    stroke: "white",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}

/**
 * Fettle Navbar — mark, wordmark, a short set of links, one primary
 * button. Nothing competes with the primary action. `links` is an array
 * of { label, href } (or { label, onClick }); `action` is a { label, onClick }.
 */
function Navbar({
  brand = 'Fettle',
  links = [],
  action,
  floating = true,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(-1);
  return /*#__PURE__*/React.createElement("nav", _extends({
    style: {
      background: 'var(--white)',
      border: floating ? 'var(--border-width) solid var(--border-default)' : 'none',
      borderBottom: floating ? undefined : 'var(--border-width) solid var(--border-default)',
      borderRadius: floating ? 'var(--radius-lg)' : 0,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: floating ? 'var(--shadow-card)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement(BrandMark, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: '18px',
      color: 'var(--ink)'
    }
  }, brand)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '28px',
      alignItems: 'center'
    }
  }, links.map((l, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: l.href || '#',
    onClick: l.onClick,
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      fontSize: '14px',
      fontWeight: 500,
      textDecoration: 'none',
      color: hover === i ? 'var(--ink)' : 'var(--text-muted)',
      transition: 'color .15s',
      cursor: 'pointer'
    }
  }, l.label)), action && /*#__PURE__*/React.createElement("button", {
    onClick: action.onClick,
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: '14px',
      padding: '10px 20px',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      background: 'var(--rust)',
      color: 'var(--white)',
      cursor: 'pointer'
    }
  }, action.label)));
}
Object.assign(__ds_scope, { BrandMark, Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Site.jsx
try { (() => {
/* Fettle website — the shell. Composes the DS Navbar with the shared parts
   and a tiny in-memory router so the index.html is a real click-through:
   Home → Services → Pricing → Book a visit (with a working request form). */

function Site() {
  const {
    Navbar
  } = window.FettleDesignSystem_b6c43b;
  const [page, setPage] = React.useState('home');
  const go = p => setPage(p);
  const wrap = {
    maxWidth: 1040,
    margin: '0 auto',
    padding: '0 32px'
  };
  const section = {
    padding: '56px 0'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      background: 'var(--cream)',
      fontFamily: 'var(--font-body)',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      paddingTop: 20
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    brand: "Fettle",
    links: [{
      label: 'What we fix',
      onClick: e => {
        e.preventDefault();
        go('services');
      }
    }, {
      label: 'Pricing',
      onClick: e => {
        e.preventDefault();
        go('pricing');
      }
    }, {
      label: 'About',
      onClick: e => {
        e.preventDefault();
        go('home');
      }
    }],
    action: {
      label: 'Book a visit',
      onClick: () => go('book')
    }
  })), /*#__PURE__*/React.createElement("main", {
    style: wrap
  }, page === 'home' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    onBook: () => go('book'),
    onServices: () => go('services')
  }), /*#__PURE__*/React.createElement("section", {
    style: section
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What we fix",
    title: "A single team that happens to do a lot",
    lede: "Grouped so the range reads as considered, not sprawling \u2014 one team you get to know, across the jobs a period London home actually needs."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement(ServicesGrid, null)), /*#__PURE__*/React.createElement("section", {
    style: {
      ...section,
      borderTop: '1px solid var(--ink-12)'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Why Fettle",
    title: "Fewer clients, better work"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement(TrustStrip, null))), page === 'services' && /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 0 56px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "What we fix",
    title: "What we fix",
    lede: "From a wonky fence to a fresh coat of paint. Licensed trades \u2014 plumbing, rendering, tree surgery \u2014 go to our small, personally-vetted bench, under the same standard."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement(ServicesGrid, null)), page === 'pricing' && /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 0 56px'
    }
  }, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Pricing",
    title: "Priced for care, not the cheapest quote",
    lede: "No call-out fee, even if the job turns out smaller than quoted. Tap a card to start a request."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 28
    }
  }), /*#__PURE__*/React.createElement(PricingSection, {
    onBook: () => go('book')
  })), page === 'book' && /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '48px 0 64px',
      display: 'grid',
      gridTemplateColumns: '1fr 480px',
      gap: 48,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHead, {
    eyebrow: "Book a visit",
    title: "Tell us what needs doing",
    lede: "We'll come and take a proper look. Local team, tidy finish, no call-out fee."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: 380
    }
  }, window.FettleDesignSystem_b6c43b.Alert && /*#__PURE__*/React.createElement(window.FettleDesignSystem_b6c43b.Alert, {
    variant: "note",
    title: "No call-out fee"
  }, "Even if the job turns out smaller than quoted, the visit is on us."))), /*#__PURE__*/React.createElement(BookingForm, {
    onDone: () => go('home')
  })), /*#__PURE__*/React.createElement(SiteFooter, null)));
}
Object.assign(window, {
  Site
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Site.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/parts.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Fettle website — shared parts (Hero, ServicesGrid, TrustStrip, PricingSection,
   BookingForm, Footer). Each reads DS primitives from the global namespace at
   render time so load order is forgiving. */

const DS = () => window.FettleDesignSystem_b6c43b;

/* ---- Service data (from the brand vision: grouped so the range reads as
   considered, not sprawling — a single team that happens to do a lot) ---- */
const SERVICE_GROUPS = [{
  group: 'Fabric & Finish',
  items: ['Handyman', 'Painting', 'Plastering', 'Puttying', 'Rendering']
}, {
  group: 'Outside & Structure',
  items: ['Fencing', 'Small tree surgery']
}, {
  group: 'Home Care',
  items: ['Cleaning', 'Carpet & flooring']
}, {
  group: 'Practical & Plumbing',
  items: ['Plumbing']
}, {
  group: 'Life Admin',
  items: ['Moving services']
}];
const PRICING = [{
  title: 'Handyman half-day',
  sub: 'Shelves, fences, odd jobs',
  price: 'from £140',
  badges: ['Local team', 'No call-out fee', 'Tidy finish']
}, {
  title: 'Handyman full-day',
  sub: 'A proper run at the list',
  price: 'from £260',
  badges: ['Local team', 'Same face each visit']
}, {
  title: 'Painting & plastering',
  sub: 'Per room, materials in',
  price: 'from £320',
  badges: ['Dust-sheeted', 'Tidy finish']
}];

/* ---------- Section heading ---------- */
function SectionHead({
  eyebrow,
  title,
  lede,
  align = 'left'
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      margin: align === 'center' ? '0 auto' : 0,
      textAlign: align
    }
  }, eyebrow && /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--rust)',
      margin: '0 0 10px'
    }
  }, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 32,
      fontWeight: 700,
      margin: '0 0 8px',
      color: 'var(--ink)'
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-60)',
      fontSize: 16,
      margin: 0,
      lineHeight: 1.6
    }
  }, lede));
}

/* ---------- Hero ---------- */
function Hero({
  onBook,
  onServices
}) {
  const {
    Button,
    Badge
  } = DS();
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '76px 0 64px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--rust)',
      margin: '0 0 18px'
    }
  }, "Boutique home care \xB7 London"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 60,
      lineHeight: 1.02,
      margin: '0 0 18px',
      color: 'var(--ink)',
      maxWidth: 720
    }
  }, "Good hands,", /*#__PURE__*/React.createElement("br", null), "good work."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      color: 'var(--ink-60)',
      maxWidth: 540,
      margin: '0 0 28px',
      lineHeight: 1.55
    }
  }, "The friendly folk who keep your London home in good working order \u2014 from a wonky fence to a fresh coat of paint."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onBook
  }, "Book a visit"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "lg",
    onClick: onServices
  }, "What we fix")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Badge, null, "Local team"), /*#__PURE__*/React.createElement(Badge, null, "No call-out fee"), /*#__PURE__*/React.createElement(Badge, null, "Tidy finish")));
}

/* ---------- Services grid ---------- */
function ServicesGrid({
  compact
}) {
  const {
    Card,
    Badge
  } = DS();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr 1fr' : '1fr 1fr 1fr',
      gap: 16
    }
  }, SERVICE_GROUPS.map(g => /*#__PURE__*/React.createElement(Card, {
    key: g.group,
    style: {
      padding: '22px 24px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      fontWeight: 700,
      margin: '0 0 14px',
      color: 'var(--ink)'
    }
  }, g.group), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, g.items.map(i => /*#__PURE__*/React.createElement(Badge, {
    key: i,
    variant: "outline"
  }, i))))));
}

/* ---------- Trust strip ---------- */
function TrustStrip() {
  const points = [{
    k: 'Capped roster',
    v: 'We take on a limited number of homes — never an open marketplace of strangers.'
  }, {
    k: 'The same faces',
    v: 'A small, permanent team who get to know your home by name.'
  }, {
    k: 'No surprises',
    v: 'Clear pricing, clear timelines, and we leave it tidy — every time.'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 32
    }
  }, points.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.k
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 18,
      margin: '0 0 6px',
      color: 'var(--ink)'
    }
  }, p.k), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'var(--ink-60)',
      margin: 0,
      lineHeight: 1.55
    }
  }, p.v))));
}

/* ---------- Pricing ---------- */
function PricingSection({
  onBook
}) {
  const {
    ServiceCard
  } = DS();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, PRICING.map(p => /*#__PURE__*/React.createElement(ServiceCard, _extends({
    key: p.title
  }, p, {
    onClick: onBook,
    style: {
      cursor: 'pointer'
    }
  }))));
}

/* ---------- Booking form ---------- */
function BookingForm({
  onDone
}) {
  const {
    Field,
    Input,
    Select,
    Textarea,
    Button,
    Alert
  } = DS();
  const [sent, setSent] = React.useState(false);
  if (sent) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 480
      }
    }, /*#__PURE__*/React.createElement(Alert, {
      variant: "confirmed",
      title: "Request received"
    }, "Thanks \u2014 one of the team will be in touch within a day to confirm a visit. No call-out fee, whatever the job turns out to be."), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => {
        setSent(false);
        onDone && onDone();
      }
    }, "\u2190 Back to the site")));
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      background: 'var(--white)',
      border: '1px solid var(--ink-12)',
      borderRadius: 'var(--radius-lg)',
      padding: 32,
      maxWidth: 480,
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Name"
  }, /*#__PURE__*/React.createElement(Input, {
    required: true,
    placeholder: "Your name"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email"
  }, /*#__PURE__*/React.createElement(Input, {
    required: true,
    type: "email",
    placeholder: "you@email.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "What needs fixing?"
  }, /*#__PURE__*/React.createElement(Select, null, SERVICE_GROUPS.map(g => /*#__PURE__*/React.createElement("option", {
    key: g.group
  }, g.group)), /*#__PURE__*/React.createElement("option", null, "Something else"))), /*#__PURE__*/React.createElement(Field, {
    label: "Tell us a bit more",
    hint: "The more specific, the better we can quote."
  }, /*#__PURE__*/React.createElement(Textarea, {
    placeholder: "e.g. Fence panel came loose in the storm, three posts along the back."
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    type: "submit"
  }, "Request a visit"));
}

/* ---------- Footer ---------- */
function SiteFooter() {
  const {
    BrandMark
  } = DS();
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--ink-12)',
      marginTop: 24,
      padding: '32px 0 8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(BrandMark, {
    size: 28,
    radius: 8
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      color: 'var(--ink)'
    }
  }, "Fettle")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'var(--ink-40)',
      margin: 0,
      fontStyle: 'italic'
    }
  }, "In fine fettle. \xB7 London home care, by referral."));
}
Object.assign(window, {
  SERVICE_GROUPS,
  PRICING,
  SectionHead,
  Hero,
  ServicesGrid,
  TrustStrip,
  PricingSection,
  BookingForm,
  SiteFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/parts.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.BrandMark = __ds_scope.BrandMark;

__ds_ns.Navbar = __ds_scope.Navbar;

})();
