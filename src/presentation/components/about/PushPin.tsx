// A semi-matte thumbtack seen from slightly above, lit from the top left. Gradients live in
// <PushPinDefs>, rendered once per board so the ids stay unique. The shadow is a separate layer
// so it can spread and fade while the pin is lifted off the photo.

// Colours are written out in full so Tailwind sees them and emits the theme variables.
const PIN_COLORS = {
  red: ["var(--color-pin-red-hi)", "var(--color-pin-red)", "var(--color-pin-red-shade)"],
  amber: ["var(--color-pin-amber-hi)", "var(--color-pin-amber)", "var(--color-pin-amber-shade)"],
  teal: ["var(--color-pin-teal-hi)", "var(--color-pin-teal)", "var(--color-pin-teal-shade)"],
  navy: ["var(--color-pin-navy-hi)", "var(--color-pin-navy)", "var(--color-pin-navy-shade)"],
} as const;

export type PinColor = keyof typeof PIN_COLORS;
export const PIN_COLOR_CYCLE = Object.keys(PIN_COLORS) as PinColor[];

const stop = (offset: string, color: string, opacity = 1) => (
  <stop offset={offset} style={{ stopColor: color, stopOpacity: opacity }} />
);

export function PushPinDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {PIN_COLOR_CYCLE.map((c) => {
          const [hi, base, shade] = PIN_COLORS[c];
          return (
            <g key={c}>
              <linearGradient id={`pin-side-${c}`} x1="0" x2="1" y1="0" y2="0">
                {stop("0", hi)}
                {stop("0.4", base)}
                {stop("1", shade)}
              </linearGradient>
              <radialGradient id={`pin-top-${c}`} cx="0.38" cy="0.32" r="0.8">
                {stop("0", hi)}
                {stop("0.55", base)}
                {stop("1", shade)}
              </radialGradient>
            </g>
          );
        })}
        <radialGradient id="pin-sheen" cx="0.5" cy="0.5" r="0.5">
          {stop("0", "var(--color-white)", 0.45)}
          {stop("1", "var(--color-white)", 0)}
        </radialGradient>
        <filter id="pin-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        <filter id="pin-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
      </defs>
    </svg>
  );
}

// Soft cast shadow down and to the right, plus a tighter contact shadow where the pin meets the paper.
export function PushPinShadow({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" overflow="visible" className={className}>
      <ellipse cx="27" cy="25" rx="13" ry="8.5" filter="url(#pin-blur)" opacity="0.22" />
      <ellipse cx="22" cy="23" rx="10" ry="6.5" filter="url(#pin-blur-sm)" opacity="0.2" />
    </svg>
  );
}

export function PushPin({ color, className }: { color: PinColor; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 40" className={className}>
      {/* Short collar into the paper, then the domed cap with its shaded rim. */}
      <path d="M16 22 L17 15 L23 15 L24 22 Z" fill={`url(#pin-side-${color})`} />
      <ellipse cx="20" cy="17" rx="12.5" ry="9" fill={`url(#pin-side-${color})`} />
      <ellipse cx="20" cy="14.5" rx="12.5" ry="9" fill={`url(#pin-top-${color})`} />
      {/* A broad, soft sheen rather than a sharp highlight keeps the finish matte. */}
      <ellipse cx="15.5" cy="11" rx="6" ry="3.4" transform="rotate(-20 15.5 11)" fill="url(#pin-sheen)" />
    </svg>
  );
}
